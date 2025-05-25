package game

import (
	"log"
	"strconv"

	"github.com/gorilla/websocket"
)

type Player struct {
	ID           int
	Name         string
	Hand         []Card
	IsDealer     bool
	IsBusted     bool
	Conn         *websocket.Conn
	IsTurn       bool
	HasBlackjack bool
}

func NewPlayer(id int, name string, isDealer bool) *Player {
	return &Player{
		ID:       id,
		Name:     name,
		Hand:     []Card{},
		IsDealer: isDealer,
	}
}

func (p *Player) IsBust() bool {
	return p.HandValue() > 21
}

func (p *Player) IsBlackjack() bool {
	return p.HandValue() == 21 && len(p.Hand) == 2
}

func (p *Player) Is21() bool {
	return p.HandValue() == 21
}

func (p *Player) HandValue() int {
	value := 0
	aces := 0

	for _, card := range p.Hand {
		rank := card.Value[:len(card.Value)-1]
		switch rank {
		case "A":
			aces++
			value += 11
		case "K", "Q", "J":
			value += 10
		default:
			num, err := strconv.Atoi(rank)
			if err != nil {
				log.Println("Error converting rank to int:", err)
				continue
			}
			value += num
		}
	}

	// Adjust for aces if value exceeds 21 (aces can be 1 or 11)
	for value > 21 && aces > 0 {
		value -= 10
		aces--
	}

	return value
}

func (p *Player) Hit(g *Game) {
	p.Hand = append(p.Hand, PickCardsFromDeck(&g.Deck, 1)...)

	if p.IsBust() || p.Is21() {
		g.NextTurn()
		return
	}

	g.broadcast(g.GetGameStateDTO())
}
