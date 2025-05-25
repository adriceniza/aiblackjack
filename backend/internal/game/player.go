package game

type Player struct {
	ID       int
	Name     string
	Hand     []Card
	IsDealer bool
	IsBusted bool
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
			value += int(card.Value[0] - '0')
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
}
