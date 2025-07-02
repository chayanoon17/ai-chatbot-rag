// lib/ai/chat.ts
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

const model = new ChatOpenAI({
  temperature: 0.7,
  modelName: 'gpt-3.5-turbo',
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Type สำหรับข้อความแต่ละรายการ
export type ChatMessage = {
  role: 'user' | 'bot';
  message: string;
};

// ฟังก์ชันใหม่ที่รับ history ทั้งหมด
export async function askLLM(messages: ChatMessage[]): Promise<string> {
  const formattedMessages = messages.map((msg) =>
    msg.role === 'user'
      ? new HumanMessage(msg.message)
      : new AIMessage(msg.message)
  );

  const res = await model.invoke(formattedMessages);
  return res.content as string;
}
