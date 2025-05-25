export const WS_URL = "ws://localhost:8080/ws";

export enum WSIncomingMessageType {
    JOINED_SESSION = "joined_session",
    GAME_STATE = "game_state",
    END_GAME = "end_game",
    ERROR = "error",
}