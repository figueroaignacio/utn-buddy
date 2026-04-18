import { loginWithGithub, loginWithGoogle } from "@/modules/auth/api/auth.api";
import { Logo } from "@/shared/components/logo";
import { GitHubIcon, GoogleIcon } from "@/shared/components/tech-icons";
import { Button } from "@repo/ui/components/button";
import { Dialog } from "@repo/ui/components/dialog";
import { Separator } from "@repo/ui/components/separator";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

type ProviderId = "github" | "google";

const AUTH_PROVIDERS = [
  {
    id: "github" as ProviderId,
    label: "Continue with GitHub",
    icon: <GitHubIcon />,
    action: loginWithGithub,
  },
  {
    id: "google" as ProviderId,
    label: "Continue with Google",
    icon: <GoogleIcon />,
    action: loginWithGoogle,
  },
] as const;

interface LoginDialogProps {
  children: React.ReactNode;
}

export function LoginDialog({ children }: LoginDialogProps) {
  const [loadingProvider, setLoadingProvider] = useState<ProviderId | null>(
    null,
  );

  async function handleLogin(
    id: ProviderId,
    authAction: () => Promise<string>,
  ) {
    try {
      setLoadingProvider(id);
      const url = await authAction();
      window.location.assign(url);
    } catch (error) {
      console.error(error);
      setLoadingProvider(null);
    }
  }

  return (
    <Dialog>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content className="w-md">
        <Dialog.Header className="space-y-5">
          <Dialog.Title>
            <Logo />
          </Dialog.Title>
          <Dialog.Description>
            Start building the future of the user interface
          </Dialog.Description>
        </Dialog.Header>
        <div className="flex flex-col gap-y-3 mt-5">
          {AUTH_PROVIDERS.map((provider) => (
            <Button
              key={provider.id}
              onClick={() => handleLogin(provider.id, provider.action)}
              variant="outline"
              leftIcon={provider.icon}
              loading={loadingProvider === provider.id}
              disabled={
                loadingProvider !== null && loadingProvider !== provider.id
              }>
              {provider.label}
            </Button>
          ))}
        </div>
        <Separator className="my-4" />
        <p className="text-xs text-muted-foreground text-center">
          To continue you accept our
          <Link to="/" className="underline">
            Terms of Service
          </Link>
          and Privacy Policy
        </p>
      </Dialog.Content>
    </Dialog>
  );
}
