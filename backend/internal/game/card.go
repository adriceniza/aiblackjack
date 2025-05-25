package game

type Card struct {
	Value   string
	Visible bool
}

func PickCardsFromDeck(deck *[]string, num int) []Card {
	pickedCards := make([]Card, num)
	for i := 0; i < num; i++ {
		pickedCards[i] = Card{
			Value:   (*deck)[i],
			Visible: true,
		}
	}

	*deck = (*deck)[num:]

	return pickedCards
}
