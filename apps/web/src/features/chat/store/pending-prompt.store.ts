'use client';

import { create } from 'zustand';

interface PendingPromptState {
  pendingPrompt: string | null;
  setPendingPrompt: (prompt: string) => void;
  consumePendingPrompt: () => string | null;
}

export const usePendingPromptStore = create<PendingPromptState>((set, get) => ({
  pendingPrompt: null,
  setPendingPrompt: prompt => set({ pendingPrompt: prompt }),
  consumePendingPrompt: () => {
    const prompt = get().pendingPrompt;
    set({ pendingPrompt: null });
    return prompt;
  },
}));
