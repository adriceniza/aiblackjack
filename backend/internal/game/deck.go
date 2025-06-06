package game

import (
	"math/rand"
)

var NumDecks = 5

var Deck = []string{
	"2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH", "AH",
	"2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD", "AD",
	"2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC", "AC",
	"2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS", "AS",
}

func Shuffle(deck []string) []string {
	shuffled := make([]string, len(deck))
	copy(shuffled, deck)
	rand.Shuffle(len(shuffled), func(i, j int) {
		shuffled[i], shuffled[j] = shuffled[j], shuffled[i]
	})
	return shuffled
}

func NewShuffledDeck(deck []string) []string {
	var newDeck []string

	for range NumDecks {
		newDeck = append(newDeck, Shuffle(Deck)...)
	}

	return newDeck
}
