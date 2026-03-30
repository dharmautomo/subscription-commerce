import { Header } from "@/components/layout/Header";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      {children}
    </div>
  );
}
