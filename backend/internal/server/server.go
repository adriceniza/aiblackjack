package server

import (
	"encoding/json"
	"log"
	"net/http"

	constants "github.com/adriceniza/aiblackjack/backend/internal"
	"github.com/adriceniza/aiblackjack/backend/internal/game"
	"github.com/adriceniza/aiblackjack/backend/internal/session"
	"github.com/adriceniza/aiblackjack/backend/internal/ws"
	"github.com/gorilla/websocket"
)

var sessionManager = session.NewManager()

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
		sessionManager.Delete(conn)
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

		var req map[string]interface{}
		if err := json.Unmarshal(msg, &req); err != nil {
			log.Println("Error parseando mensaje:", err)
			continue
		}

		if req["type"] == constants.NEW_GAME {
			log.Println("Iniciando nuevo juego")

			game := game.NewGame([]string{req["player"].(string)})
			sessionManager.Create(conn, game)

			writeJSON(conn, game.GetGameStateDTO())

			if err := game.DealInitialCards(conn); err != nil {
				log.Println("Error al repartir cartas:", err)
				continue
			}
			log.Println("Juego iniciado con exito")
		}
		if req["type"] == constants.PLAYER_ACTION {

			game, ok := sessionManager.Get(conn)

			if !ok {
				log.Println("No se encontro el juego")
				break
			}

			handlePlayerAction(conn, game, req["action"].(string))
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

func handlePlayerAction(conn *websocket.Conn, game *game.Game, action string) {
	player := game.Players[game.CurrentPlayerIndex]

	if action == constants.HIT {
		player.Hit(game)

		if player.IsBust() || player.IsBlackjack() {
			endGame := game.PlayDealersTurn()

			writeJSON(conn, endGame)
		}

		gameState := game.GetGameStateDTO()

		writeJSON(conn, gameState)
	}
	if action == constants.STAND {
		endGame := game.PlayDealersTurn()

		writeJSON(conn, endGame)
	}

}
