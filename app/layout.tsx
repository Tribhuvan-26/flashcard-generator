import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Flashcard Generator",
  description: "Turn technical notes into interview flashcards.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
