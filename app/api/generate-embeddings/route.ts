// app/api/generate-embeddings/route.ts
import { NextResponse } from "next/server";
import { getEmbedding } from "@/lib/ai/embedding";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    console.log('🚀 Starting embedding generation...');
    
    // ดึงเอกสารที่ยังไม่มี embedding
    const documents = await prisma.document.findMany({
      where: {
        embedding: { equals: null }
      }
    });

    console.log(`📝 Found ${documents.length} documents without embeddings`);

    if (documents.length === 0) {
      return NextResponse.json({ 
        message: "All documents already have embeddings!",
        updated: 0
      });
    }

    let updated = 0;
    const errors = [];

    for (const doc of documents) {
      try {
        console.log(`Processing document ${doc.id}: ${doc.content.substring(0, 50)}...`);
        
        // Generate embedding
        const embedding = await getEmbedding(doc.content);
        console.log(`Generated embedding with ${embedding.length} dimensions`);
        
        // Update document with embedding
        await prisma.document.update({
          where: { id: doc.id },
          data: { embedding: embedding }
        });
        
        updated++;
        console.log(`✅ Updated document ${doc.id}`);
        
        // หน่วงเวลาเล็กน้อยเพื่อไม่ให้ rate limit
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        let errorMsg: string;
        if (error && typeof error === "object" && "message" in error) {
          errorMsg = `Error processing document ${doc.id}: ${(error as { message: string }).message}`;
        } else {
          errorMsg = `Error processing document ${doc.id}: ${String(error)}`;
        }
        console.error(`❌ ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    return NextResponse.json({
      message: "Embedding generation completed!",
      updated,
      total: documents.length,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
    let errorMsg = "Unknown error";
    if (error && typeof error === "object" && "message" in error) {
      errorMsg = (error as { message: string }).message;
    } else {
      errorMsg = String(error);
    }
    return NextResponse.json(
      { error: "Failed to generate embeddings", details: errorMsg },
      { status: 500 }
    );
  }
}