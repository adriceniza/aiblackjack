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
	}
}

func (lm *LobbyManager) GetGame(code string) (*game.Game, bool) {
	lm.mu.RLock()
	defer lm.mu.RUnlock()

	session, exists := lm.sessions[code]
	if !exists {
		return nil, false
	}

	return session.Game, true
}

func (lm *LobbyManager) GetGameByConn(conn *websocket.Conn) (*game.Game, bool) {
	lm.mu.RLock()
	defer lm.mu.RUnlock()

	for _, gs := range lm.sessions {
		if gs.Game == nil {
			continue
		}
		for _, player := range gs.Game.Players {
			if player.Conn == conn {
				return gs.Game, true
			}
		}
	}

	return nil, false
}

func (lm *LobbyManager) GetByConn(conn *websocket.Conn) (*GameSession, bool) {
	lm.mu.RLock()
	defer lm.mu.RUnlock()

	for _, gs := range lm.sessions {
		if gs.Game == nil {
			continue
		}
		for _, player := range gs.Game.Players {
			if player.Conn == conn {
				return gs, true
			}
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
		if session.Game == nil {
			continue
		}

		for _, player := range session.Game.Players {
			if player.Conn == conn {
				gs = session
				ok = true
				break
			}
		}

		if ok {
			break
		}
	}

	if !ok {
		return
	}

	delete(lm.sessions, gs.Code)
}

func (lm *LobbyManager) GetAvailableGames() []string {
	lm.mu.RLock()
	defer lm.mu.RUnlock()

	var codes []string
	for code := range lm.sessions {
		if lm.sessions[code].Game == nil {
			continue
		}

		if lm.sessions[code].Game.IsStarted {
			continue
		}

		if lm.sessions[code].Game.IsFull() {
			continue
		}

		codes = append(codes, code)
	}
	return codes
}