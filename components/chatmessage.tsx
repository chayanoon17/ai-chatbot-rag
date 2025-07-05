import clsx from "clsx";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import { useState } from "react";
import { Alert } from "@heroui/alert";

import { CopyIcon } from "./icons/copyicon";

import { HeartIcon } from "@/components/icons/heartIcon";

type ChatMessageProps = {
  message: string;
  role: "user" | "bot";
};

export function ChatMessage({ message, role }: ChatMessageProps) {
  const isUser = role === "user";
  const [liked, setLiked] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [copy, setCopy] = useState(false);
  const [showAlertCopy, setShowAlertCopy] = useState(false);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "flex w-full mb-2",
        isUser ? "justify-end" : "justify-start",
      )}
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={clsx(
          "flex flex-col max-w-[80%] px-4 py-2 rounded-lg shadow-sm",
          isUser
            ? "bg-blue-900 text-right self-end items-end text-white"
            : " text-left self-start items-start text-white",
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message}</p>

        {/* เฉพาะข้อความจาก bot เท่านั้นถึงจะแสดงปุ่ม */}
        {!isUser && (
          <div className="flex gap-2 mt-2">
            <Button
              isIconOnly
              aria-label="Like"
              className="mt-2 self-start"
              color="danger"
              onClick={() => {
                setLiked(!liked);
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 1000);
              }}
            >
              <HeartIcon
                fill={liked ? "#e00" : "currentColor"}
                filled={liked}
              />
            </Button>
            <Button
              isIconOnly
              aria-label="Like"
              className="mt-2 self-start"
              color="danger"
              onClick={() => {
                setCopy(!copy);
                setShowAlertCopy(true);
                setTimeout(() => setShowAlert(false), 1000);
              }}
            >
              <CopyIcon />
            </Button>

            {/* Alert เล็ก */}
            {showAlert && (
              <motion.div
                animate={{ y: 0, opacity: 1 }}
                className=" absolute top-4 flex  items-center justify-center w-[50%] z-50 text-white px-4 py-2 "
                exit={{ y: -50, opacity: 0 }}
                initial={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Alert
                  hideIcon
                  color="danger"
                  description="Thank you for liking!"
                  title="Liked!"
                />
              </motion.div>
            )}
            {showAlertCopy && (
              <motion.div
                animate={{ y: 0, opacity: 1 }}
                className=" absolute top-4 flex  items-center justify-center w-[50%] z-50 text-white px-4 py-2 "
                exit={{ y: -50, opacity: 0 }}
                initial={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Alert
                  hideIcon
                  color="danger"
                  description="Successfully copied!"
                  title="Copy!"
                />
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
