import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Matrice de Risques Online | Créez et Exportez",
  description: "Application pour créer rapidement des matrices de risques 5x5 et les exporter en PNG ou PDF.",
  keywords: ["matrice de risques", "gestion des risques", "risk matrix", "export PDF", "export PNG"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
