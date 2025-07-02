"use client";
import ChatbotPage from "./chat/page";

// import Link from "next/link";
// import { Snippet } from "@heroui/snippet";
// import { Code } from "@heroui/code";
// import { button as buttonStyles } from "@heroui/theme";
// import { title, subtitle } from "@/components/primitives";
// import { GithubIcon } from "@/components/icons";

export default function Home() {
  return (
    <ChatbotPage/>
    // <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
    //   <div className="inline-block max-w-xl text-center justify-center">
    //     <span className={title()}>Chatbot&nbsp;</span>
    //     <span className={title({ color: "violet" })}>+RAG&nbsp;</span>
    //     <br />
    //     <span className={title()}>
    //       Chatbots for your organization
    //     </span>
    //     <div className={subtitle({ class: "mt-4" })}>
    //       Try it first for free.
    //     </div>
    //   </div>

    //   <div className="flex gap-3">
    //     <Link
    //     href="/chat"
    //       className={buttonStyles({
    //         color: "primary",
    //         radius: "full",
    //         variant: "shadow",
    //       })}
    //     >
    //       Goto chatbot+RAG
    //     </Link>
    //     <Link
    //       className={buttonStyles({ variant: "bordered", radius: "full" })}
    //       href="https://github.com/chayanoon17"
    //     >
    //       <GithubIcon size={20} />
    //       GitHub
    //     </Link>
    //   </div>

    // </section>
  );
}
