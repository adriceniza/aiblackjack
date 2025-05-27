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
		log.Println("Connection closed and cleaned up")
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
			log.Println("Invalid JSON:", err)
			continue
		}

		reqType, ok := req["type"].(string)
		if !ok {
			log.Println("Message 'type' missing or invalid")
			continue
		}

		switch reqType {
		case constants.QUICK_JOIN:
			handleQuickJoin(conn, req)

		case constants.PLAYER_ACTION:
			handlePlayerActionMsg(conn, req)

		case constants.PLACE_BET:
			handlePlaceBetMsg(conn, req)

		default:
			log.Println("Unknown message type:", reqType)
		}
	}
}



func handleQuickJoin(conn *websocket.Conn, req map[string]interface{}) {
	name, ok := req["player_name"].(string)
	if !ok {
		log.Println("Missing or invalid 'player_name'")
		return
	}

	log.Println("Handling QUICK_JOIN for:", name)

	g := FindOrCreateGame()

	_, err := g.AddPlayer(name, conn)
	if err {
		log.Println("Could not add player to game")
		return
	}

	lobbyManager.Create(conn, g)
}

func handlePlayerActionMsg(conn *websocket.Conn, req map[string]interface{}) {
	action, ok := req["action"].(string)
	if !ok {
		log.Println("Missing or invalid 'action'")
		return
	}

	gs, ok := lobbyManager.GetByConn(conn)
	if !ok {
		log.Println("Game session not found for connection")
		return
	}

	currentPlayer := gs.Game.Players[gs.Game.CurrentPlayerIndex]
	if currentPlayer.Conn != conn {
		log.Println("Not this player's turn")
		return
	}

	switch action {
	case constants.HIT:
		currentPlayer.Hit(gs.Game)
	case constants.STAND:
		gs.Game.NextTurn()
	default:
		log.Println("Invalid action:", action)
	}
}

func handlePlaceBetMsg(conn *websocket.Conn, req map[string]interface{}) {
	gs, ok := lobbyManager.GetByConn(conn)
	if !ok {
		log.Println("Game session not found for placing bet")
		return
	}

	player, err := gs.Game.GetPlayerByConn(conn)
	if err != nil {
		log.Println("Player not found:", err)
		return
	}

	betAmountFloat, ok := req["bet"].(float64)
	if !ok {
		log.Println("Invalid or missing bet amount")
		return
	}

	betAmount := int(betAmountFloat)
	player.PlaceBet(betAmount)
	log.Printf("Player %s placed bet: %d", player.Name, betAmount)
}




func FindOrCreateGame() (*game.Game) {
	games := lobbyManager.GetAvailableGames()
	if len(games) > 0 {
		log.Println("Un juego disponible encontrado, uniendo al jugador")
		gameCode := games[0]
		if g, exists := lobbyManager.GetGame(gameCode); exists {
			log.Println("Joining existing game: ", gameCode)
			return g
		}
	}

	log.Println("Creating new game")
	return game.NewGame()
}