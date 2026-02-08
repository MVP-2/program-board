import type { ReactNode } from "react";
import { MainHeader } from "./_components/main-header";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-card px-4 py-3">
        <MainHeader />
      </header>
      <main className="container mx-auto max-w-4xl p-4">{children}</main>
    </div>
  );
}
