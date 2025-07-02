import { NextResponse } from "next/server";
import { askLLM, ChatMessage } from "@/lib/ai/chat";

export async function POST(req: Request) {
  const body = await req.json();
  const messages: ChatMessage[] = body.messages;

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "messages must be an array" }, { status: 400 });
  }

  try {
    const reply = await askLLM(messages);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("LLM error:", error);
    return NextResponse.json({ error: "Failed to generate reply" }, { status: 500 });
  }
}
