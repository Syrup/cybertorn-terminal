import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next"
import { TornProvider } from "@/lib/torn-context";
import { FeatureFlagProvider } from "@/lib/configcat-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberTorn Terminal",
  description: "Advanced Cyberpunk-styled Torn City API Interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FeatureFlagProvider>
            <TornProvider>
              {children}
              <Analytics />
            </TornProvider>
          </FeatureFlagProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
