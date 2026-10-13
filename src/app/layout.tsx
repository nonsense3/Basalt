import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Basalt — Freelancer command bar powered by Gemma",
  description:
    "Turn messy client notes into invoices, proposals, and follow-ups with open-weight Gemma. Side hustle AI that freelancers would actually pay for.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
