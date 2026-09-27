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
  title: "Mohammed Suhail | Full-Stack Engineer",
  description:
    "Full-Stack Engineer specialising in AI-assisted development, rapid prototyping, and end-to-end application delivery. IT undergraduate at ISL Engineering College ('28), certified in Data Science by Fullstack Academy.",
  keywords: [
    "Mohammed Suhail",
    "Full-Stack Engineer",
    "AI-assisted development",
    "Rapid prototyping",
    "Application delivery",
    "Information Technology",
    "ISL Engineering College",
    "Fullstack Academy",
    "Data Science",
    "Next.js",
    "React",
    "Python",
    "Portfolio",
  ],
  authors: [{ name: "Mohammed Suhail" }],
  openGraph: {
    title: "Mohammed Suhail | Full-Stack Engineer",
    description:
      "Full-Stack Engineer specialising in AI-assisted development, rapid prototyping, and end-to-end application delivery.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#09090b",
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
