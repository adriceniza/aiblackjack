package game

import (
	"log"
	"sync"
	"time"

	"github.com/adriceniza/aiblackjack/backend/internal/constants"
	"github.com/gorilla/websocket"
)

type Game struct {
	Deck                []string
	Players             []*Player
	CurrentPlayerIndex  int
	Dealer              *Player
	WriteMutex          sync.Mutex
	State               string
	IsStarted           bool
	WaitingCountdownEnd int64
}

func NewGame() *Game {
	deck := NewShuffledDeck(Deck)

	dealer := NewPlayer(999, "Dealer", true)

	game := &Game{
		Deck:                deck,
		Players:             []*Player{},
		Dealer:              dealer,
		CurrentPlayerIndex:  0,
		WriteMutex:          sync.Mutex{},
		WaitingCountdownEnd: time.Now().UnixMilli() + constants.WAITING_FOR_PLAYERS_TIME_MS,
		State:               constants.STATE_WAITING_FOR_PLAYERS,
	}

	go func() {
		log.Println("Esperando 15 segundos para iniciar el juego")
		time.Sleep(constants.WAITING_FOR_PLAYERS_TIME_MS * time.Millisecond)
		game.IsStarted = true
		log.Println("Iniciando fase de apuestas")
		game.StartBettingPhase()
	}()

	return game
}

func (g *Game) AddPlayer(name string, conn *websocket.Conn) (player *Player, err bool) {
	if g.IsFull() {
		return nil, true
	}

	player = NewPlayer(len(g.Players), name, false)
	player.Conn = conn
	g.Players = append(g.Players, player)

	log.Printf("Player %s added to the game", name)

	gameState := g.GetGameStateDTO()
	gameState.Type = constants.JOINED_SESSION
	g.broadcast(gameState)
	return player, false
}

func (g *Game) PlayDealersTurn() {
	for i := range g.Dealer.Hand {
		g.Dealer.Hand[i].Visible = true
	}

	for g.Dealer.HandValue() < 17 {
		card := PickCardsFromDeck(&g.Deck, 1)[0]
		g.Dealer.Hand = append(g.Dealer.Hand, card)
		g.broadcast(g.GetGameStateDTO())
		time.Sleep(400 * time.Millisecond)
	}

	winners, pushes := g.DetermineWinners()

	gameState := g.GetGameStateDTO()

	g.SettleBets(winners, pushes)

	gameState.Type = constants.GAME_STATE
	gameState.State = constants.STATE_ROUND_ENDED
	gameState.Winners = convertPlayersToDTO(winners)
	gameState.Pushes = convertPlayersToDTO(pushes)

	log.Println("Broadcasting game state WINNERS")
	log.Println(gameState.Winners)
	g.broadcast(gameState)

	go func() {
		time.Sleep(5 * time.Second)
		g.NextRound()
	}()
}

func (g *Game) SettleBets(winners []*Player, pushes []*Player) {
	for _, player := range winners {
		if player.HasBlackjack {
			balanceWon := int(float64(player.CurrentBet) * 2.5)
			player.Balance += balanceWon
			continue
		}
		player.Balance += player.CurrentBet * 2
	}

	for _, player := range pushes {
		player.Balance += player.CurrentBet
	}
}

func (g *Game) DetermineWinners() (winners []*Player, pushes []*Player) {
	dealerValue := g.Dealer.HandValue()
	dealerBust := g.Dealer.IsBust()

	for _, player := range g.Players {
		playerValue := player.HandValue()
		if player.IsBust() {
			continue
		}

		if dealerBust {
			winners = append(winners, player)
		} else if playerValue > dealerValue {
			winners = append(winners, player)
		} else if playerValue == dealerValue {
			pushes = append(pushes, player)
		}
	}

	return winners, pushes
}

func (g *Game) DealInitialCards() error {
	// Ronda 1
	for _, p := range g.Players {
		p.Hand = append(p.Hand, PickCardsFromDeck(&g.Deck, 1)...)
		g.broadcast(g.GetGameStateDTO())
		time.Sleep(200 * time.Millisecond)
	}
	g.Dealer.Hand = append(g.Dealer.Hand, PickCardsFromDeck(&g.Deck, 1)...)
	g.broadcast(g.GetGameStateDTO())
	time.Sleep(200 * time.Millisecond)

	// Ronda 2
	for _, p := range g.Players {
		p.Hand = append(p.Hand, PickCardsFromDeck(&g.Deck, 1)...)
		g.broadcast(g.GetGameStateDTO())
		time.Sleep(200 * time.Millisecond)
	}
	g.Dealer.Hand = append(g.Dealer.Hand, PickCardsFromDeck(&g.Deck, 1)...)
	g.Dealer.Hand[1].Visible = false
	g.broadcast(g.GetGameStateDTO())

	return nil
}

func (g *Game) StartBettingPhase() {
	g.State = constants.STATE_BETTING

	g.broadcast(g.GetGameStateDTO())

	timer := time.NewTimer(30 * time.Second)
	done := make(chan struct{})

	go func() {
		for {
			if g.AllPlayersPlacedBet() {
				break
			}

			time.Sleep(100 * time.Millisecond)
		}

		close(done)
	}()

	select {
	case <-done:
		log.Println("Todos los jugadores han realizado sus apuestas, iniciando ronda")
	case <-timer.C:
		log.Println("Tiempo de apuestas agotado, iniciando ronda")
	}
	g.StartRound()
}

func (g *Game) StartRound() {
	log.Println("start round")
	g.State = constants.STATE_PLAYING
	if err := g.DealInitialCards(); err != nil {
		log.Println("Error al repartir cartas:", err)
	}

	for _, p := range g.Players {
		if p.IsBlackjack() {
			p.HasBlackjack = true
		}
	}

	for i, p := range g.Players {
		if !p.HasBlackjack {
			p.IsTurn = true
			g.CurrentPlayerIndex = i
			break
		}
	}

	if g.AllPlayersBlackjack() {
		g.PlayDealersTurn()
		return
	}

	g.broadcast(g.GetGameStateDTO())
}

func (g *Game) NextRound() {
	if len(g.Deck) < len(Deck) {
		g.Deck = NewShuffledDeck(Deck)
	}
	g.ResetGameForNextRound()
	g.StartBettingPhase()
}

func (g *Game) ResetGameForNextRound() {
	for _, p := range g.Players {
		p.Hand = []Card{}
		p.IsBusted = false
		p.HasBlackjack = false
		p.IsTurn = false
		p.CurrentBet = 0
		p.HasPlacedBet = false
	}

	g.Dealer.Hand = []Card{}
	g.Dealer.IsBusted = false

	g.CurrentPlayerIndex = 0
}

func (g *Game) broadcast(state GameStateDTO) {
	g.WriteMutex.Lock()
	defer g.WriteMutex.Unlock()

	state.Timestamp = time.Now().UnixMilli()

	for _, p := range g.Players {
		if p.Conn != nil {
			stateCopy := state
			stateCopy.Player = p.ConvertToDTO()

			if err := p.Conn.WriteJSON(stateCopy); err != nil {
				log.Println("Error sending game state:", err)

				p.Conn.Close()
				p.Conn = nil
			}
		}
	}
}

func (g *Game) NextTurn() {
	if g.CurrentPlayerIndex < len(g.Players) {
		g.Players[g.CurrentPlayerIndex].IsTurn = false
	}

	for i := g.CurrentPlayerIndex + 1; i < len(g.Players); i++ {
		if !g.Players[i].IsBusted {
			g.CurrentPlayerIndex = i
			g.Players[i].IsTurn = true
			g.broadcast(g.GetGameStateDTO())
			return
		}
	}

	log.Println("No player left to play")
	g.PlayDealersTurn()
}

func (g *Game) AllPlayersBlackjack() bool {
	for _, p := range g.Players {
		if !p.HasBlackjack {
			return false
		}
	}

	return true
}

func (g *Game) AllPlayersPlacedBet() bool {
	for _, p := range g.Players {
		if !p.HasPlacedBet {
			return false
		}
	}

	return true
}

func (g *Game) IsFull() bool {
	return len(g.Players) >= constants.MAX_PLAYERS
}
