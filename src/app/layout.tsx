import { BuildingsProvider } from "@/state/buildings";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rivningskartan",
  description: "En karta med rivningshotade hus",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <div id="portal"></div>
      </body>
    </html>
  );
}
