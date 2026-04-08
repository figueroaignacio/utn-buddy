import { Logo } from "@/shared/components/logo";
import { Button } from "@repo/ui/components/button";
import { LoginDialog } from "./login-dialog";

export function Header() {
  return (
    <header className="py-2 bg-card">
      <div className="container flex justify-between items-center">
        <Logo />
        <LoginDialog>
          <Button variant="secondary">Try NachUI</Button>
        </LoginDialog>
      </div>
    </header>
  );
}
