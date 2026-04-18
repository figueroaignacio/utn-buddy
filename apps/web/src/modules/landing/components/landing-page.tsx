"use client";

import { Header } from "@/modules/landing/components/header";
import { HeroSection } from "./hero-section";

export function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <HeroSection />
    </div>
  );
}
