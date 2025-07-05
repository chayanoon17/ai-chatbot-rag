// File: app/api/documents/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const documents = await prisma.document.findMany();
  return NextResponse.json(documents);
}

export async function POST(request: Request) {
  const { content } = await request.json();
  if (!content) {
    return NextResponse.json({ error: "Missing content" }, { status: 400 });
  }
  const result = await prisma.document.create({ data: { content } });
  return NextResponse.json(result);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

if (!id) {
  return NextResponse.json({ error: "Missing id" }, { status: 400 });
}

try {
  const numericId = Number(id);
  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const result = await prisma.document.delete({
    where: { id: numericId },
  });

  return NextResponse.json(result);
} catch (error) {
  console.error("Failed to delete document:", error);
  return NextResponse.json(
    { error: "Failed to delete document" },
    { status: 500 }
  );
}

}
