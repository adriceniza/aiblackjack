package game

import "github.com/adriceniza/aiblackjack/backend/internal/constants"

type PlayerDTO struct {
	ID           int      `json:"id"`
	Name         string   `json:"name"`
	Hand         []string `json:"hand"`
	IsDealer     bool     `json:"is_dealer"`
	IsBusted     bool     `json:"is_busted"`
	IsTurn       bool     `json:"is_turn"`
	HasBlackjack bool     `json:"has_blackjack"`
	Balance      int      `json:"balance"`
	CurrentBet   int      `json:"current_bet"`
	HasPlacedBet bool     `json:"has_placed_bet"`
}

type GameStateDTO struct {
	Players            []PlayerDTO `json:"players"`
	Dealer             PlayerDTO   `json:"dealer"`
	CurrentPlayerIndex int         `json:"current_player_index"`
	Type               string      `json:"type"`
	State              string      `json:"state"`
	Winners            []PlayerDTO `json:"winners"`
	Pushes             []PlayerDTO `json:"pushes"`
	RemainingCards     int         `json:"remaining_cards"`
	Timestamp          int64       `json:"timestamp"`
	Player             PlayerDTO   `json:"player"`
}

func (g *Game) GetGameStateDTO() GameStateDTO {
	playerStates := make([]PlayerDTO, len(g.Players))
	for i, p := range g.Players {
		playerStates[i] = PlayerDTO{
			ID:           p.ID,
			Name:         p.Name,
			Hand:         convertHandToDTO(p.Hand),
			IsDealer:     p.IsDealer,
			IsBusted:     p.IsBust(),
			IsTurn:       p.IsTurn,
			Balance:      p.Balance,
			CurrentBet:   p.CurrentBet,
			HasPlacedBet: p.HasPlacedBet,
		}
	}

	dealerState := PlayerDTO{
		ID:       g.Dealer.ID,
		Name:     g.Dealer.Name,
		Hand:     convertHandToDTO(g.Dealer.Hand),
		IsDealer: true,
		IsBusted: g.Dealer.IsBust(),
		IsTurn:   g.Dealer.IsTurn,
	}

	return GameStateDTO{
		Players:            playerStates,
		Dealer:             dealerState,
		CurrentPlayerIndex: g.CurrentPlayerIndex,
		Type:               constants.GAME_STATE,
		State:              g.State,
		RemainingCards:     len(g.Deck),
	}
}

func convertHandToDTO(hand []Card) []string {
	convertedHand := make([]string, len(hand))
	for i, c := range hand {
		if !c.Visible {
			convertedHand[i] = "??"
			continue
		}
		convertedHand[i] = c.Value
	}

	return convertedHand
}

func (p *Player) ConvertToDTO() PlayerDTO {
	return PlayerDTO{
		ID:           p.ID,
		Name:         p.Name,
		Hand:         convertHandToDTO(p.Hand),
		IsDealer:     p.IsDealer,
		IsTurn:       p.IsTurn,
		HasBlackjack: p.HasBlackjack,
		Balance:      p.Balance,
	}
}

func convertPlayersToDTO(players []*Player) []PlayerDTO {
	convertedPlayers := make([]PlayerDTO, len(players))
	for i, p := range players {
		convertedPlayers[i] = p.ConvertToDTO()
	}
	return convertedPlayers
}
