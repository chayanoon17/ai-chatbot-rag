# Chatbot AI RAG (Retrieval-Augmented Generation)

> ระบบแชทบอท AI ที่รองรับ RAG (Retrieval-Augmented Generation) พร้อมฟีเจอร์ Streaming Response แบบ Real-time

## คุณสมบัติ
- ถาม-ตอบด้วย GPT และ fallback เป็น RAG เมื่อ AI ไม่มั่นใจ
- Streaming Response: ข้อความตอบกลับทีละ chunk แบบ real-time
- รองรับเอกสารฐานความรู้ (Knowledge Base) ด้วย Embedding + Prisma
- Next.js 14, TypeScript, TailwindCSS, Prisma, PostgreSQL

## วิธีใช้งาน

### 1. ติดตั้ง Dependencies
```bash
pnpm install
# หรือ
yarn install
# หรือ
npm install
```

### 2. ตั้งค่าฐานข้อมูล
1. สร้างไฟล์ `.env` และกำหนด DATABASE_URL สำหรับ PostgreSQL
2. รัน migration:
```bash
npx prisma migrate dev
```

### 3. รันโปรเจกต์
```bash
pnpm dev
# หรือ
yarn dev
# หรือ
npm run dev
```

### 4. เพิ่มเอกสาร (Document)
เพิ่มข้อมูลในตาราง Document (ผ่าน Prisma Studio หรือ API)

### 5. เริ่มแชทกับ AI
เข้าใช้งานผ่านหน้าเว็บ `/chat`

## โครงสร้างโปรเจกต์

```
app/           // Next.js API & Pages
components/    // React Components
hooks/         // React Hooks (เช่น useChatLogic)
lib/           // ฟังก์ชัน AI, Embedding, Prisma
prisma/        // Prisma schema
public/        // Static files
```

## ฟีเจอร์เด่น
- **RAG**: ใช้ Embedding + Similarity Search เพื่อค้นหาข้อมูลที่เกี่ยวข้อง
- **Streaming**: ส่งข้อความตอบกลับแบบ chunk real-time
- **Fallback**: ถ้า GPT ไม่มั่นใจ จะใช้ RAG อัตโนมัติ

## ข้อกำหนดระบบ
- Node.js 18+
- PostgreSQL

## License
MIT
