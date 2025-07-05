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
    if (loading || !input.trim()) return;

    const userMsg: ChatMessage = { role: "user", message: input };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "bot", message: "Thinking..." }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      // Streaming response
      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let aiMsg = "";

        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "bot", message: "" },
        ]);
        while (!done) {
          const { value, done: doneReading } = await reader.read();

          done = doneReading;
          if (value) {
            aiMsg += decoder.decode(value);
            setMessages((prev) => [
              ...prev.slice(0, -1),
              { role: "bot", message: aiMsg },
            ]);
          }
        }
        if (!aiMsg) {
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "bot", message: "No response from AI" },
          ]);
        }
      } else {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "bot", message: "No response from AI" },
        ]);
      }
    } catch {
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
