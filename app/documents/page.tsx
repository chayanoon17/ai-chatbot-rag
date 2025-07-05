"use client";

import { Textarea } from "@heroui/input";
import React, { useState } from "react";
import { Button } from "@heroui/button";

import { useDocuments } from "@/hooks/useDocuments";
import UserIcon from "@/components/icons/usericon";

export default function DocumentManager() {
  const { documents, loading, error, addDocument, deleteDocument } =
    useDocuments();
  const [content, setContent] = useState("");

  // ฟังก์ชันเพิ่มเอกสารทีละหลายบรรทัด
  const handleAddMultiple = async () => {
    const lines = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    try {
      for (const line of lines) {
        await addDocument(line);
      }
      setContent("");
    } catch (e) {
      alert((e as Error).message);
    }
  };

  return (
    <div>
      <h1>Document Management</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Textarea
        classNames={{
          base: "max-w-xxl w-full",
          input: "resize-y min-h-[200px]",
        }}
        disabled={loading}
        placeholder="พิมพ์เมนูอาหารทีละบรรทัด เช่น\nข้าวผัดกุ้ง — ข้าวผัดกับกุ้งสด\nต้มยำกุ้ง — ซุปเผ็ดรสจัด"
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end mt-4 mb-4">
        <Button
          color="primary"
          disabled={loading}
          variant="ghost"
          onClick={handleAddMultiple}
        >
          Add Multiple Documents
        </Button>
        <Button
          color="secondary"
          disabled={loading}
          variant="flat"
          onClick={async () => {
            try {
              const res = await fetch("/api/generate-embeddings", {
                method: "POST",
              });
              const data = await res.json();

              alert(
                `✅ ${data.message}\nUpdated: ${data.updated}/${data.total}`,
              );
            } catch (e) {
              alert(`❌ ${(e as Error).message}`);
            }
          }}
        >
          Generate Embeddings
        </Button>
      </div>

      {loading && <p>Loading...</p>}

      <ul>
        {documents.map((doc) => (
          <li key={doc.id} className="flex justify-between items-center gap-2">
            <span>{doc.content}</span>
            <Button
              color="danger"
              disabled={loading}
              startContent={<UserIcon />}
              variant="bordered"
              onClick={() => deleteDocument(doc.id)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
