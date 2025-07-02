"use client";

import { Alert } from "@heroui/alert";
import { ChatMessage } from "@/components/chatmessage";
import { ChatInput } from "@/components/chatInput";
import { useChatLogic } from "@/hooks/usechatlogic";
import { PromptSuggestion } from "@/components/promipt";

export default function ChatbotPage() {
  const { messages, loading, input, setInput, error, setError, sendMessage } =
    useChatLogic();

  return (
    <div className="flex flex-col items-center w-full bg-black text-white ">
      
      <div className="flex flex-col w-full max-w-3xl gap-2  pb-40">
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} message={msg.message} />
        ))}
        {error && (
          <Alert
            color="danger"
            variant="flat"
            onClose={() => setError(null)}
            className="mt-2"
          >
            {error}
          </Alert>
        )}
      </div>

      {messages.length === 0 && input.trim() === "" && (

          <PromptSuggestion
            onSelect={(prompt) => {
              setInput(prompt);
              sendMessage();
            }}
          />

      )}

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={sendMessage}
        loading={loading}
      />
    </div>
  );
}
