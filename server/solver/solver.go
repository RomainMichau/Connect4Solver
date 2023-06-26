package solver

import (
	"connect4solver/game"
)

// 0 lose
// 1 nothing happen
// 2 win

const (
	ImpossibleMove int = -1
	Lost           int = 0
	Neutral        int = 1
	Win            int = 2
	MaxDepth           = 2
)

func MiniMax(gameInstance *game.Game, depth int, maximizingPlayer bool) (int, int, []int) {
	size := len(gameInstance.Grid[0])
	scores := make([]int, size)
	for i := range scores {
		scores[i] = -1
	}
	for i := 0; i < size; i++ {
		if gameInstance.CanAddToken(i) {
			col, line, _, _, _ := gameInstance.AddToken(i)
			if gameInstance.CheckWin(line, col) {
				if maximizingPlayer {
					scores[i] = Win
				} else {
					scores[i] = Lost
				}
			} else if depth > 0 {
				_, score, _ := MiniMax(gameInstance, depth-1, !maximizingPlayer)
				scores[i] = score
			} else {
				scores[i] = Neutral
			}
			gameInstance.Grid[line][col] = game.EmptyCell
			gameInstance.NextPlayer()
		} else {
			scores[i] = ImpossibleMove
		}
	}
	//fmt.Printf("Player: %t  %v\n", maximizingPlayer, scores)
	var miniMaxScore int
	moveId := -1
	if maximizingPlayer {
		miniMaxScore = -1
		for i, e := range scores {
			if e > miniMaxScore && e != ImpossibleMove {
				moveId = i
				miniMaxScore = e
			}
		}
	} else {
		miniMaxScore = 10000
		for i, e := range scores {
			if e < miniMaxScore && e != ImpossibleMove {
				moveId = i
				miniMaxScore = e
			}
		}
	}
	//fmt.Printf("Player: %t  %d\n", maximizingPlayer, miniMaxScore)

	return moveId, miniMaxScore, scores
}
