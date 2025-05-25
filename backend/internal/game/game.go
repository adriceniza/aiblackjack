package game

import (
	"time"

	constants "github.com/adriceniza/aiblackjack/backend/internal"
	"github.com/gorilla/websocket"
)

type Game struct {
	Deck               []string
	Players            []*Player
	CurrentPlayerIndex int
	Dealer             *Player
}

func NewGame(playerNames []string) *Game {
	deck := Shuffle(Deck)
	players := make([]*Player, len(playerNames))
	for i, name := range playerNames {
		players[i] = NewPlayer(i, name, false)
	}

	dealer := NewPlayer(players[:1][0].ID+1, "Dealer", true)

	return &Game{
		Deck:               deck,
		Players:            players,
		Dealer:             dealer,
		CurrentPlayerIndex: players[0].ID,
	}
}

func (g *Game) PlayDealersTurn() GameStateDTO {
	for i := range g.Dealer.Hand {
		g.Dealer.Hand[i].Visible = true
	}

	for g.Dealer.HandValue() < 17 {
		g.Dealer.Hand = append(g.Dealer.Hand, PickCardsFromDeck(&g.Deck, 1)...)
	}

	winners, pushes := g.DetermineWinners()

	gameState := g.GetGameStateDTO()

	gameState.Type = constants.GAME_STATE
	gameState.State = constants.END_GAME
	gameState.Winners = convertPlayersToDTO(winners)
	gameState.Pushes = convertPlayersToDTO(pushes)

	return gameState

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

	return
}

func (g *Game) DealInitialCards(conn *websocket.Conn) error {
	// Ronda 1
	for _, p := range g.Players {
		p.Hand = append(p.Hand, PickCardsFromDeck(&g.Deck, 1)...)
		if err := conn.WriteJSON(g.GetGameStateDTO()); err != nil {
			return err
		}
		time.Sleep(200 * time.Millisecond)
	}
	g.Dealer.Hand = append(g.Dealer.Hand, PickCardsFromDeck(&g.Deck, 1)...)
	if err := conn.WriteJSON(g.GetGameStateDTO()); err != nil {
		return err
	}
	time.Sleep(200 * time.Millisecond)

	// Ronda 2
	for _, p := range g.Players {
		p.Hand = append(p.Hand, PickCardsFromDeck(&g.Deck, 1)...)
		if err := conn.WriteJSON(g.GetGameStateDTO()); err != nil {
			return err
		}
		time.Sleep(200 * time.Millisecond)
	}
	g.Dealer.Hand = append(g.Dealer.Hand, PickCardsFromDeck(&g.Deck, 1)...)
	g.Dealer.Hand[1].Visible = false
	if err := conn.WriteJSON(g.GetGameStateDTO()); err != nil {
		return err
	}

	return nil
}
