package session

import (
	"sync"

	"github.com/adriceniza/aiblackjack/backend/internal/game"
	"github.com/gorilla/websocket"
)

type Manager struct {
	sessions map[*websocket.Conn]*game.Game
	mu       sync.RWMutex
}

func NewManager() *Manager {
	return &Manager{
		sessions: make(map[*websocket.Conn]*game.Game),
	}
}

func (sm *Manager) Create(conn *websocket.Conn, game *game.Game) {
	sm.mu.Lock()
	defer sm.mu.Unlock()
	sm.sessions[conn] = game
}

func (sm *Manager) Get(conn *websocket.Conn) (*game.Game, bool) {
	sm.mu.RLock()
	defer sm.mu.RUnlock()
	game, ok := sm.sessions[conn]
	return game, ok
}

func (sm *Manager) Delete(conn *websocket.Conn) {
	sm.mu.Lock()
	defer sm.mu.Unlock()
	delete(sm.sessions, conn)
}

func (sm *Manager) All() map[*websocket.Conn]*game.Game {
	sm.mu.RLock()
	defer sm.mu.RUnlock()
	copy := make(map[*websocket.Conn]*game.Game)
	for conn, g := range sm.sessions {
		copy[conn] = g
	}
	return copy
}
