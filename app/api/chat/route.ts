import { NextResponse } from "next/server";
import { askLLM, ChatMessage } from "@/lib/ai/chat";
import { getEmbedding } from "@/lib/ai/embedding";
import { prisma } from "@/lib/prisma";

type RequestBody = {
  messages: ChatMessage[];
};

function isUncertainAnswer(answer: string) {
  const uncertainPhrases = [
    "ขอโทษ", "ไม่ทราบ", "ไม่แน่ใจ", "ไม่สามารถตอบได้", "sorry", "I don't know",
    "ขึ้นอยู่กับ", "สามารถตรวจสอบ", "ควรตรวจสอบ", "แนะนำให้", "ข้อมูลอาจแตกต่าง"
  ];
  return uncertainPhrases.some(keyword => answer.toLowerCase().includes(keyword.toLowerCase()))
    || answer.length < 20;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const messages = body.messages;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages must be an array" },
        { status: 400 }
      );
    }
    if (
      !messages.every(
        (msg) => typeof msg.role === "string" && typeof msg.message === "string"
      )
    ) {
      return NextResponse.json(
        { error: "invalid message format" },
        { status: 400 }
      );
    }

    const latestMessage = messages[messages.length - 1].message;

    // Streaming helper and mock streaming LLM moved to top-level

    // 1. ถาม GPT ก่อน (stream)
    if (!isUncertainAnswer(await askLLM([{ role: "user", message: latestMessage }]))) {
      const stream = createStream(streamLLM(latestMessage));
      return new NextResponse(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // 2. ถ้า GPT ไม่มั่นใจ fallback ไป RAG (stream)
    const queryEmbedding = await getEmbedding(latestMessage);
    const results = (await prisma.$queryRaw`
      SELECT 
        content,
        (
          SELECT SUM(a.val * b.val)
          FROM unnest(embedding) WITH ORDINALITY a(val, idx),
               unnest(${queryEmbedding}::float[]) WITH ORDINALITY b(val, idx)
          WHERE a.idx = b.idx
        ) / (
          sqrt((SELECT SUM(val * val) FROM unnest(embedding) val)) * 
          sqrt((SELECT SUM(val * val) FROM unnest(${queryEmbedding}::float[]) val))
        )::float as similarity
      FROM "Document"
      WHERE embedding IS NOT NULL AND array_length(embedding, 1) > 0
      ORDER BY similarity DESC
      LIMIT 10
    `) as { content: string; similarity: number }[];

    const context = results.map((r) => r.content).join("\n---\n");
    const ragPrompt = `Context:\n${context}\n\nQ: ${latestMessage}\nA:`;
    const stream = createStream(streamLLM(ragPrompt));
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error(
      "LLM error:",
      (error as Error).message,
      (error as Error).stack
    );
    return NextResponse.json(
      { error: "Failed to generate reply" },
      { status: 500 }
    );
  }
}

// Streaming helper (must be top-level)
function createStream(generator: AsyncGenerator<string, void, void>) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await generator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(encoder.encode(value));
      }
    },
  });
}

// Mock streaming LLM (replace with real streaming from askLLM if available)
async function* streamLLM(prompt: string) {
  // If askLLM supports streaming, use it here. Otherwise, split reply for demo.
  const reply = await askLLM([{ role: "user", message: prompt }]);
  for (let i = 0; i < reply.length; i += 10) {
    yield reply.slice(i, i + 10);
    await new Promise((res) => setTimeout(res, 20));
  }
}
