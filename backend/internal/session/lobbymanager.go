package session

import (
	"sync"

	"github.com/adriceniza/aiblackjack/backend/internal/game"
	"github.com/adriceniza/aiblackjack/backend/internal/helpers"
	"github.com/gorilla/websocket"
)

type LobbyManager struct {
	sessions map[string]*GameSession
	mu       sync.RWMutex
}

type GameSession struct {
	Code string
	Game *game.Game
	conn *websocket.Conn
}

func NewLobbyManager() *LobbyManager {
	return &LobbyManager{
		sessions: make(map[string]*GameSession),
	}
}

func (lm *LobbyManager) Create(conn *websocket.Conn, game *game.Game) {
	lm.mu.Lock()
	defer lm.mu.Unlock()

	code := ""

	for {
		code := helpers.GenerateCode()
		_, exists := lm.sessions[code]
		if !exists {
			break
		}
	}

	lm.sessions[code] = &GameSession{
		Code: code,
		Game: game,
		conn: conn,
	}
}

func (lm *LobbyManager) GetGameByConn(conn *websocket.Conn) (*game.Game, bool) {
	lm.mu.RLock()
	defer lm.mu.RUnlock()

	for _, gs := range lm.sessions {
		if gs.conn == conn {
			return gs.Game, true
		}
	}

	return nil, false
}

func (lm *LobbyManager) GetByConn(conn *websocket.Conn) (*GameSession, bool) {
	lm.mu.RLock()
	defer lm.mu.RUnlock()

	for _, gs := range lm.sessions {
		if gs.conn == conn {
			return gs, true
		}
	}
	return nil, false
}

func (lm *LobbyManager) Delete(conn *websocket.Conn) {
	lm.mu.Lock()
	defer lm.mu.Unlock()

	var gs *GameSession
	var ok bool
	for _, session := range lm.sessions {
		if session.conn == conn {
			gs = session
			ok = true
			break
		}
	}

	if !ok {
		return
	}

	delete(lm.sessions, gs.Code)
}
