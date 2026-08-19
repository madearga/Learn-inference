import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Learn Inference",
  description:
    "An interactive guide to inference engineering: how generative AI models are served in production, from attention kernels to multi-cloud capacity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
