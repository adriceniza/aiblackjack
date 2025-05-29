import type { Metadata } from "next";
import { Jersey_20 } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import PlayerInfo from "@/components/game/PlayerInfo/PlayerInfo";

const jersey = Jersey_20({
  variable: "--font-jersey",
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
      <body className={`${jersey.variable}`}>
        <GameProvider>
          <PlayerInfo>{children}</PlayerInfo>
        </GameProvider>
      </body>
    </html>
  );
}
