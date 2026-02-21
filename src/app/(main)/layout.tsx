import { Header } from "@/components/common/header";
import { CompareProvider } from "@/components/compare/compare-context";
import { CompareBar } from "@/components/compare/compare-bar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CompareProvider>
      <Header />
      <main>{children}</main>
      <CompareBar />
    </CompareProvider>
  );
}
