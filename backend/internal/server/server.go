package server

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/adriceniza/aiblackjack/backend/internal/constants"
	"github.com/adriceniza/aiblackjack/backend/internal/game"
	"github.com/adriceniza/aiblackjack/backend/internal/session"
	"github.com/adriceniza/aiblackjack/backend/internal/ws"
	"github.com/gorilla/websocket"
)

var lobbyManager = session.NewLobbyManager()

func Start() {
	http.HandleFunc("/ws", handleWSConnection)

	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("Server error:", err)
	}

	log.Println("Server closed")
}

func handleWSConnection(w http.ResponseWriter, r *http.Request) {
	conn, err := ws.HandleWS(w, r)
	if err != nil {
		log.Println("WS Upgrade error:", err)
		return
	}

	defer func() {
		lobbyManager.Delete(conn)
		conn.Close()
	}()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		log.Printf("Mensaje recibido: %s", msg)

		var req map[string]any
		if err := json.Unmarshal(msg, &req); err != nil {
			log.Println("Error parseando mensaje:", err)
			continue
		}

		switch req["type"] {
		case constants.QUICK_JOIN:
			log.Println("Iniciando nuevo juego")
			game := game.NewGame([]string{req["player_name"].(string)})
			game.Players[0].Conn = conn

			lobbyManager.Create(conn, game)

			writeJSON(conn, &map[string]any{
				"type": constants.JOINED_SESSION,
				"id":   game.Players[0].ID,
			})

			writeJSON(conn, game.GetGameStateDTO())

			game.StartRound()

		case constants.PLAYER_ACTION:
			gs, ok := lobbyManager.GetByConn(conn)

			if !ok {
				log.Println("No se encontro el juego")
				break
			}

			handlePlayerAction(gs.Game, req["action"].(string))
		}
	}
}

func writeJSON(conn *websocket.Conn, v any) bool {
	if err := conn.WriteJSON(v); err != nil {
		log.Println("Error sending message:", err)
		return false
	}
	return true
}

func handlePlayerAction(game *game.Game, action string) {
	player := game.Players[game.CurrentPlayerIndex]

	if action == constants.HIT {
		player.Hit(game)
		return
	}
	if action == constants.STAND {
		game.NextTurn()
		return
	}

}
