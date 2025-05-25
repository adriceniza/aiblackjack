package helpers

import "math/rand"

func GenerateCode() string {
	code := ""

	var charset = []rune("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
	for i := 0; i < 5; i++ {
		randIndex := rand.Intn(len(charset))
		code += string(charset[randIndex])
	}

	return code
}
