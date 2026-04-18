import { Logo } from "@/shared/components/logo";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@repo/ui/components/button";
import { LoginDialog } from "./login-dialog";

export function Header() {
  return (
    <header className="py-2">
      <div className="container flex justify-between items-center">
        <Logo />
        <LoginDialog>
          <Button
            variant="secondary"
            size="sm"
            rightIcon={<HugeiconsIcon icon={ArrowUpRight01Icon} size={16} />}>
            Try NachUI
          </Button>
        </LoginDialog>
      </div>
    </header>
  );
}
