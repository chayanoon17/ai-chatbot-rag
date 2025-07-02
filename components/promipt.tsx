"use client";
import { title, subtitle } from "@/components/primitives";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import dynamic from "next/dynamic";

const LottiePlayer = dynamic(() => import("./lottiepayer"), {
  ssr: false,
});

type PromptSuggestionProps = {
  onSelect: (prompt: string) => void;
};

const prompts = [
  "Hello, how are you?",
  "How's the weather today?",
  "Can you tell me a joke?",
  "What is the capital of France?",
];

export function PromptSuggestion({ onSelect }: PromptSuggestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full px-4"
    >
      {/* ส่วนข้อความ + Lottie */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-6 mb-6">
        {/* Text Section */}
        <div className="text-center  md:max-w-xxl">
          <span className={title()}>Chatbot&nbsp;</span>
          <span className={title({ color: "violet" })}>+RAG&nbsp;</span>
          <br />
          <span className={title()}>Chatbots for your organization</span>
          <div className={subtitle({ class: "mt-4" })}>
            Try it first for free.
          </div>
        </div>

        {/* Lottie Section */}
        <div className="w-full max-w-[200px]">
          <LottiePlayer src="https://lottie.host/cb467272-be5e-4c4b-a234-8f30ee070518/eIH9nwFtTa.lottie" />
        </div>
      </div>

      {/* ปุ่ม Prompt */}
      <div className="w-full flex flex-wrap justify-center md:justify-center gap-1">
        {prompts.map((text, index) => (
          <Button
            key={index}
            variant="bordered"
            className="text-sm whitespace-nowrap"
            onClick={() => onSelect(text)}
          >
            {text}
          </Button>
        ))}
      </div>
    </motion.div>
  );
}
