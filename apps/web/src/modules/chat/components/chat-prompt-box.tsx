import { ArrowUp02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

export function ChatPromptBox() {
  const [value, setValue] = useState("");

  return (
    <div className="w-full rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col p-4 gap-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask anything..."
          rows={3}
          className="w-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none"
        />
        <div className="flex items-center justify-end">
          <button
            disabled={!value.trim()}
            className="flex items-center justify-center size-8 rounded-full bg-foreground text-background disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80 transition-opacity">
            <HugeiconsIcon icon={ArrowUp02Icon} size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
