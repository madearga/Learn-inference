import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ReadingProgress } from "@/components/ReadingProgress";

export const metadata: Metadata = {
  title: "Learn Inference",
  description:
    "An interactive guide to inference engineering: how generative AI models are served in production, from attention kernels to multi-cloud capacity.",
};

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = stored || (prefersDark ? "dark" : "light");
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
  } catch(e) {
    document.documentElement.classList.add("dark");
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ReadingProgress />
        <Header />
        {children}
      </body>
    </html>
  );
}
