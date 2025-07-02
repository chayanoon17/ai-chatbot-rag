import clsx from "clsx";
import { motion } from "framer-motion";
import { HeartIcon } from "@/components/icons/heartIcon";
import { Button } from "@heroui/button";
import { useState } from "react";
import { Alert } from "@heroui/alert";
import { CopyIcon } from "./icons/copyicon";

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        "flex w-full mb-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={clsx(
          "flex flex-col max-w-[80%] px-4 py-2 rounded-lg shadow-sm",
          isUser
            ? "bg-blue-900 text-right self-end items-end text-white"
            : " text-left self-start items-start text-white"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message}</p>

        {/* เฉพาะข้อความจาก bot เท่านั้นถึงจะแสดงปุ่ม */}
        {!isUser && (
          <div className="flex gap-2 mt-2">
            <Button
              isIconOnly
              aria-label="Like"
              color="danger"
              onClick={() => {
                setLiked(!liked);
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 2000);
              }}
              className="mt-2 self-start"
            >
              <HeartIcon
                filled={liked}
                fill={liked ? "#e00" : "currentColor"}
              />
            </Button>
            <Button
              isIconOnly
              aria-label="Like"
              color="danger"
              onClick={() => {
                setCopy(!copy);
                setShowAlertCopy(true);
                setTimeout(() => setShowAlert(false), 2000);
              }}
              className="mt-2 self-start"
            >
              <CopyIcon />
            </Button>

            {/* Alert เล็ก */}
            {showAlert && (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className=" absolute top-4 flex  items-center justify-center w-[40%] z-50 text-white px-4 py-2 "
              >
                <Alert
                  hideIcon
                  color="secondary"
                  description="Thank you for liking!"
                  title="Liked!"
                  variant="bordered"
                />
              </motion.div>
            )}
            {showAlertCopy && (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className=" absolute top-4 flex  items-center justify-center w-[40%] z-50 text-white px-4 py-2 "
              >
                <Alert
                  hideIcon
                  color="secondary"
                  description="Successfully copied!"
                  title="Copy!"
                  variant="bordered"
                />
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
