package solver

import (
	"connect4solver/game"
	"math/rand"
)

// 0 lose
// 1 nothing happen
// 2 win

const (
	ImpossibleMove int = -1
	Lost           int = 0
	Neutral        int = 1
	Win            int = 2
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
	var bestMoveIds []int
	if maximizingPlayer {
		miniMaxScore = -1
		for i, e := range scores {
			if e > miniMaxScore && e != ImpossibleMove {
				bestMoveIds = []int{i}
				miniMaxScore = e
			} else if e == miniMaxScore && e != ImpossibleMove {
				bestMoveIds = append(bestMoveIds, i)
			}
		}
	} else {
		miniMaxScore = 10000
		for i, e := range scores {
			if e < miniMaxScore && e != ImpossibleMove {
				bestMoveIds = []int{i}
				miniMaxScore = e
			} else if e == miniMaxScore && e != ImpossibleMove {
				bestMoveIds = append(bestMoveIds, i)
			}
		}
	}
	//fmt.Printf("Player: %t  %d\n", maximizingPlayer, miniMaxScore)
	var bestMoveId int
	if len(bestMoveIds) == 0 {
		bestMoveId = -1
	} else {
		bestMoveId = bestMoveIds[rand.Intn(len(bestMoveIds))]
	}
	return bestMoveId, miniMaxScore, scores
}
