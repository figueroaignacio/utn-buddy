'use client';

import { useArtifactStore } from '@/features/chat/store/artifact.store';
import { SandpackLayout, SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react';
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  CodeIcon,
  Copy01Icon,
  ViewIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';
import { useState } from 'react';
import { CodeBlock } from './code-block';

export function ArtifactPanel() {
  const { isOpen, activeTab, component, closeArtifact, setActiveTab } = useArtifactStore();
  const [copied, setCopied] = useState(false);

  if (!component) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(component.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="contents">
          <div
            onClick={closeArtifact}
            className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-xs"
          />
          <div
            className={cn(
              'fixed inset-y-0 right-0 z-50 flex flex-col bg-secondary shadow-2xl transition-all duration-300',
              'w-full md:relative md:inset-auto md:z-0 md:w-[50%] xl:w-[50%] md:shadow-2xl',
              'rounded-none md:rounded-2xl my-0 md:my-4 mr-0 md:mr-4 ml-0',
              'h-full md:h-[calc(100vh-2rem)] border-l border-white/5 md:border backdrop-blur-xl overflow-hidden',
            )}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-4 h-14 bg-secondary">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 shrink-0">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    TSX
                  </span>
                </div>
                <h3 className="font-heading text-sm font-semibold text-foreground truncate max-w-[120px] md:max-w-[200px]">
                  {component.name}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center rounded-lg bg-background/50 p-1 border border-white/5 ring-1 ring-white/5">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                      activeTab === 'preview'
                        ? 'bg-secondary text-foreground shadow-sm ring-1 ring-white/5'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
                    )}
                  >
                    <HugeiconsIcon icon={ViewIcon} size={14} />
                    <span className="hidden sm:inline">Preview</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                      activeTab === 'code'
                        ? 'bg-secondary text-foreground shadow-sm ring-1 ring-white/5'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
                    )}
                  >
                    <HugeiconsIcon icon={CodeIcon} size={14} />
                    <span className="hidden sm:inline">Code</span>
                  </button>
                </div>

                <div className="h-4 w-px bg-white/10 mx-1.5" />

                <div className="flex items-center gap-1">
                  <button
                    onClick={copyToClipboard}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg transition-all',
                      copied
                        ? 'bg-success/10 text-success'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                    )}
                    title="Copy code"
                  >
                    <HugeiconsIcon icon={copied ? CheckmarkCircle02Icon : Copy01Icon} size={18} />
                  </button>

                  <button
                    onClick={closeArtifact}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                    aria-label="Close"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={20} />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative">
              {activeTab === 'preview' ? (
                <SandpackProvider
                  template="react-ts"
                  theme="dark"
                  files={{
                    '/App.tsx': component.code,
                    '/lib/utils.ts': `
                    import { clsx, type ClassValue } from 'clsx';
                    import { twMerge } from 'tailwind-merge';
                    export function cn(...inputs: ClassValue[]) {
                      return twMerge(clsx(inputs));
                    }
                  `,
                    '/public/index.html': `
                    <!DOCTYPE html>
                    <html lang="en">
                      <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Preview</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                          body { background-color: transparent; color: white; margin: 0; padding: 2rem; display: flex; align-items: flex-start; justify-content: center; min-height: 100vh; }
                        </style>
                      </head>
                      <body>
                        <div id="root"></div>
                      </body>
                    </html>
                  `,
                  }}
                  options={{
                    externalResources: ['https://cdn.tailwindcss.com'],
                  }}
                  customSetup={{
                    dependencies: {
                      next: 'latest',
                      'next-themes': 'latest',
                      'class-variance-authority': 'latest',
                      '@hugeicons/react': 'latest',
                      '@hugeicons/core-free-icons': 'latest',
                      'lucide-react': 'latest',
                      clsx: 'latest',
                      'tailwind-merge': 'latest',
                      'framer-motion': 'latest',
                      motion: 'latest',
                    },
                  }}
                >
                  <SandpackLayout className="border-none! rounded-none! h-full w-full bg-transparent">
                    <SandpackPreview
                      showOpenInCodeSandbox={false}
                      showRefreshButton={true}
                      className="h-full! bg-transparent!"
                    />
                  </SandpackLayout>
                </SandpackProvider>
              ) : (
                <div className="h-full overflow-hidden bg-black/20 ">
                  <CodeBlock
                    language="tsx"
                    value={component.code}
                    hideHeader
                    className="h-full rounded-none border-none"
                    containerClassName="h-full"
                  >
                    {component.code}
                  </CodeBlock>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
