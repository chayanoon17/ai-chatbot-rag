// hooks/useDocuments.ts
import { useState, useEffect } from "react";

export type Document = {
  id: number;
  content: string;
};

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchDocuments() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/documents");

      if (!res.ok) throw new Error("Failed to fetch documents");
      const data = await res.json();

      setDocuments(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function addDocument(content: string) {
    if (!content.trim()) throw new Error("Content is required");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to add document");
      await fetchDocuments();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function deleteDocument(id: number) {
    if (!confirm("Confirm delete?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/documents", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to delete document");
      console.log("Document deleted successfully");
      await fetchDocuments();
    } catch (err: any) {
      console.error("Failed to delete document:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    error,
    addDocument,
    deleteDocument,
  };
}
