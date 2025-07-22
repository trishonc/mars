import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import '@/app/globals.css'
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Deep Research",
  description: "Multi Agent Deep Research",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="h-screen bg-background text-foreground flex flex-col">
              <Header />
              <main className="flex-1 flex flex-col w-full min-h-0">
                {children}
              </main>
            </div>
          </ThemeProvider>
      </body>
    </html>
  );
}