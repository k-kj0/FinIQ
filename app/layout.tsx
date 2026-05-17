import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finiq - AI Investment Advisor",
  description: "India's first AI that builds your personal investment roadmap in 60 seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
