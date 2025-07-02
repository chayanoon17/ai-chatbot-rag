import { useState } from "react";

export type ChatMessage = {
  message: string;
  role: "user" | "bot";
};

export function useChatLogic() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: "user", message: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const thinking: ChatMessage = { role: "bot", message: "Thinking..." };
    setMessages((prev) => [...prev, thinking]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev.slice(0, -1), // remove "Thinking..."
          { role: "bot", message: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "bot", message: "No response from AI" },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", message: "Something went wrong" },
      ]);
      setError("Failed to fetch response.");
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    input,
    setInput,
    error,
    setError,
    sendMessage,
  };
}
