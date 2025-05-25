"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface PlayerContextValue {
  playerName: string | null;
  setPlayerName: (name: string) => void;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function PlayerProvider({ children }: Props) {
  const [playerName, setPlayerName] = useState<string | null>(null);

return <PlayerContext.Provider value={{ playerName, setPlayerName }}>
    {children}
</PlayerContext.Provider>
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
