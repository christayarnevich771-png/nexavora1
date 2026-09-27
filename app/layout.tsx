import type { Metadata } from "next";

// Self-hosted variable fonts (via @fontsource) instead of next/font/google:
// these ship the actual woff2 files inside the npm package, so the build
// never depends on reaching fonts.googleapis.com. Swap to next/font/google
// freely once you have a dev/CI environment with open internet access.
import "@fontsource-variable/fraunces/opsz-italic.css";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: {
    default: "NEXAVORA — Buy. Sell. Trade. Securely.",
    template: "%s · NEXAVORA",
  },
  description:
    "Buy and sell digital products and services on NEXAVORA with clear order records and dispute support.",
  openGraph: {
    title: "NEXAVORA — Buy. Sell. Trade. Securely.",
    description:
      "Buy and sell digital products and services on NEXAVORA with clear order records and dispute support.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans")}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
