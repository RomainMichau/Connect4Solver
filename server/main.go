package main

import (
	"connect4solver/game"
	"flag"
)

func main() {
	apiPort := flag.Int("port", 8081, "port Used by the app")
	lineNb := flag.Int("line_nb", 6, "number of lines on the grid")
	colNb := flag.Int("col_nb", 7, "number of columns on the grids")
	flag.Parse()
	gameInstance := game.Init(*colNb, *lineNb)
	InitController(gameInstance, *apiPort)
}
