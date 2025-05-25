"use client";

import { usePlayer } from "@/context/PlayerContext";
import React, { useState } from "react";

const WS_URL = "ws://localhost:8080/ws";

export default function Entry() {
    const [newPlayerName, setNewPlayerName] = useState("");
    const { playerName, setPlayerName } = usePlayer();

    if (playerName) {
        console.log('rarito')
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newPlayerName.trim()) {
            console.log("Conectando con nombre:", newPlayerName.trim());
            setPlayerName(newPlayerName.trim());
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
        >
            <label>
                Nombre jugador:
                <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    required
                    autoFocus
                />
            </label>
            <button type="submit">Entrar</button>
        </form>
    );
}
