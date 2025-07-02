import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

export function ChatInput({ value, onChange, onSubmit, loading }: ChatInputProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="w-full bg-black fixed bottom-0 py-6 px-4 flex justify-center"
    >
      <div className="w-full relative flex max-w-3xl gap-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          disableAnimation
          disableAutosize
          classNames={{
            base: "max-w-xxl w-full",
            input: "resize-y min-h-[80px]",
          }}
          label="Description"
          placeholder="Type your question here..."
          variant="bordered"
        />
        <div className="flex absolute top-10 right-0">
          <Button color="primary" variant="light" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </form>
  );
}
