import { prisma } from "@/lib/prisma";
import { getEmbedding } from "@/lib/ai/embedding";

export async function saveDocumentWithEmbedding(content: string) {
  // 1. คำนวณ embedding จากข้อความ
  const embedding = await getEmbedding(content);

  // 2. บันทึกข้อมูลและ embedding ลงฐานข้อมูล
  await prisma.document.create({
    data: {
      content,
      embedding,
    },
  });
}
