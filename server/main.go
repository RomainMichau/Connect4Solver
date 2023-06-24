package main

import (
	"connect4solver/game"
)

func main() {
	gameInstance := game.Init(7, 6)
	InitController(gameInstance)
}
