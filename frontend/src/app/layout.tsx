import type { Metadata } from "next";
import { Rowdies } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import PlayerInfo from "@/components/game/PlayerInfo/PlayerInfo";

const rowdies = Rowdies({
  variable: "--font-rowdies",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "21 Blackjack",
  keywords: ["blackjack", "21", "AI", "game", "websocket"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rowdies.variable}`}>
        <GameProvider>
          <PlayerInfo>{children}</PlayerInfo>
        </GameProvider>
      </body>
    </html>
  );
}
