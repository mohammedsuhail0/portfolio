import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollHandler } from "@/components/ScrollHandler";
import { Preloader } from "@/components/Preloader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mohammed Suhail | AI/ML Engineer & Full-Stack Developer",
  description:
    "IT undergrad specializing in Data Science & Google Virtual Intern (AI/ML). Focused on engineering intelligent systems and full-stack web applications.",
  keywords: [
    "Mohammed Suhail",
    "AI/ML Engineer",
    "Data Science",
    "Full-Stack Developer",
    "Next.js",
    "React",
    "Python",
    "Portfolio",
  ],
  authors: [{ name: "Mohammed Suhail" }],
  openGraph: {
    title: "Mohammed Suhail | AI/ML Engineer & Full-Stack Developer",
    description:
      "IT undergrad specializing in Data Science & Google Virtual Intern (AI/ML).",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ScrollHandler />
          <Preloader />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
