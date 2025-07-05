"use client";

import { Textarea } from "@heroui/input";
import React, { useState } from "react";
import { useDocuments } from "@/hooks/useDocuments";
import { Button } from "@heroui/button";

type UserIconProps = {
  fill?: string;
  size?: number;
  height?: number;
  width?: number;
  [key: string]: any;
};

export const UserIcon = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}: UserIconProps) => {
  return (
    <svg
      data-name="Iconly/Curved/Profile"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        fill="none"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      >
        <path
          d="M11.845 21.662C8.153 21.662 5 21.088 5 18.787s3.133-4.425 6.845-4.425c3.692 0 6.845 2.1 6.845 4.4s-3.134 2.9-6.845 2.9z"
          data-name="Stroke 1"
        />
        <path
          d="M11.837 11.174a4.372 4.372 0 10-.031 0z"
          data-name="Stroke 3"
        />
      </g>
    </svg>
  );
};

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
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="พิมพ์เมนูอาหารทีละบรรทัด เช่น\nข้าวผัดกุ้ง — ข้าวผัดกับกุ้งสด\nต้มยำกุ้ง — ซุปเผ็ดรสจัด"
        disabled={loading}
        classNames={{
          base: "max-w-xxl w-full",
          input: "resize-y min-h-[200px]",
        }}
      />
      <div className="flex justify-end mt-4 mb-4">
        <Button
          onClick={handleAddMultiple}
          disabled={loading}
          color="primary"
          variant="ghost"
        >
          Add Multiple Documents
        </Button>
        <Button
          onClick={async () => {
            try {
              const res = await fetch("/api/generate-embeddings", {
                method: "POST",
              });
              const data = await res.json();
              alert(
                `✅ ${data.message}\nUpdated: ${data.updated}/${data.total}`
              );
            } catch (e) {
              alert(`❌ ${(e as Error).message}`);
            }
          }}
          disabled={loading}
          color="secondary"
          variant="flat"
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
              onClick={() => deleteDocument(doc.id)}
              disabled={loading}
              color="danger"
              startContent={<UserIcon />}
              variant="bordered"
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
