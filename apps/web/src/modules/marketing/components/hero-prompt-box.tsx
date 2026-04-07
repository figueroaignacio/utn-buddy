"use client";

import { LoginDialog } from "@/modules/landing/components/login-dialog";
import { ArrowUp02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const PLACEHOLDER_LINES = [
  "Generate a table component with sorting...",
  "Create a responsive navbar with dark mode...",
  "Build a callout component with variants...",
  "Create a button component with variants...",
  "Help me with this tailwind class...",
] as const;

const CYCLE_INTERVAL_MS = 3500;

const TEXT_VARIANTS = {
  initial: { opacity: 0, y: 8, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -8, filter: "blur(4px)" },
} as const;

const TEXT_TRANSITION = {
  duration: 0.4,
  ease: [0.25, 0.46, 0.45, 0.94],
} as const;

const TEXT_STYLE = { willChange: "opacity, transform, filter" } as const;

function AnimatedPlaceholder({ index }: { index: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={index}
        variants={TEXT_VARIANTS}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={TEXT_TRANSITION}
        style={TEXT_STYLE}
        className="text-muted-foreground/50 text-base leading-relaxed select-none pointer-events-none block">
        {PLACEHOLDER_LINES[index]}
      </motion.span>
    </AnimatePresence>
  );
}

// --- Main component ---

export function HeroPromptBox() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const advanceIndex = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % PLACEHOLDER_LINES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(advanceIndex, CYCLE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [advanceIndex]);

  return (
    <LoginDialog>
      <div
        role="button"
        tabIndex={0}
        className="group w-full max-w-[720px] mx-auto cursor-pointer rounded-2xl border border-border/60 bg-card backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/80 hover:shadow-lg hover:shadow-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
        <div className="relative flex flex-col p-4 min-h-[100px]">
          <AnimatedPlaceholder index={currentIndex} />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded-full bg-secondary/60 text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground/70">
              <HugeiconsIcon icon={ArrowUp02Icon} />
            </div>
          </div>
        </div>
      </div>
    </LoginDialog>
  );
}
