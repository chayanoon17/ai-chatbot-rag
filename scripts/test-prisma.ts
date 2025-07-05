import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // สร้าง document ใหม่
  const doc = await prisma.document.create({
    data: { content: "test create" },
  });

  console.log("Created doc:", doc);

  // ดึง documents ทั้งหมด
  const all = await prisma.document.findMany();

  console.log("All docs:", all);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
