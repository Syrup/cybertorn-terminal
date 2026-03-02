import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { TornProvider } from "@/lib/torn-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "TORN DASHBOARD",
  description: "Advanced Torn City API Interface",
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
          <TornProvider>
            {children}
          </TornProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
