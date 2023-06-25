package game

import (
	"fmt"
)

type Cell int
type Player int

const (
	EmptyCell  Cell = 0
	YellowCell Cell = 1
	RedCell    Cell = 2
)

const (
	YellowPlayer Player = 0
	RedPlayer    Player = 1
)

//swagger:model Cell
type Game struct {
	Grid                 [][]Cell
	sizeW                int
	sizeH                int
	PlayerPlaying        Player
	LastAddedTokenLine   int
	LastAddedTokenColumn int
}

func (g *Game) generateGrid() [][]Cell {
	grid := make([][]Cell, g.sizeW)
	for i := range grid {
		grid[i] = make([]Cell, g.sizeH)
	}
	return grid
}

func Init(column int, line int) *Game {
	grid := make([][]Cell, line)
	for i := range grid {
		grid[i] = make([]Cell, column)
	}
	return &Game{Grid: grid, sizeW: line, sizeH: column, PlayerPlaying: YellowPlayer}
}

func (g *Game) CanAddToken(col int) bool {
	if col >= len(g.Grid[0]) || col < 0 {
		return false
	}
	return g.Grid[0][col] == EmptyCell
}

// AddToken Add a token on the given col if possible, else return an error
//
// Return col and line of added token and the player who add the cell
func (g *Game) AddToken(col int) (int, int, Cell, Player, error) {
	player := g.PlayerPlaying
	for i := len(g.Grid) - 1; i >= 0; i-- {
		if g.Grid[i][col] == EmptyCell {
			cell, _ := getCellForPlayer(player)
			g.Grid[i][col] = cell
			g.NextPlayer()
			g.LastAddedTokenLine = i
			g.LastAddedTokenColumn = col
			return col, i, cell, player, nil
		}
	}
	return -1, -1, -1, -1, fmt.Errorf("no room on the line")
}

func (g *Game) Reset() {
	g.Grid = g.generateGrid()
}

func (g *Game) NextPlayer() {
	if g.PlayerPlaying == RedPlayer {
		g.PlayerPlaying = YellowPlayer
	} else {
		g.PlayerPlaying = RedPlayer
	}
}

func (g *Game) IsGridFull() bool {
	full := true
	for _, e := range g.Grid {
		if e[len(e)-1] == EmptyCell {
			full = false
		}
	}
	return full
}
func (g *Game) CheckWin(line, col int) bool {
	// Get the player's token at the given coordinates
	grid := g.Grid
	player := grid[line][col]

	// Check horizontal
	for c := 0; c <= len(grid[0])-4; c++ {
		if grid[line][c] == player && grid[line][c+1] == player && grid[line][c+2] == player && grid[line][c+3] == player {
			return true
		}
	}

	// Check vertical
	for r := 0; r <= len(grid)-4; r++ {
		if grid[r][col] == player && grid[r+1][col] == player && grid[r+2][col] == player && grid[r+3][col] == player {
			return true
		}
	}

	// Check diagonal (top-left to bottom-right)
	for r := 0; r <= len(grid)-4; r++ {
		for c := 0; c <= len(grid[0])-4; c++ {
			if grid[r][c] == player && grid[r+1][c+1] == player && grid[r+2][c+2] == player && grid[r+3][c+3] == player {
				return true
			}
		}
	}

	// Check diagonal (bottom-left to top-right)
	for r := len(grid) - 1; r >= 3; r-- {
		for c := 0; c <= len(grid[0])-4; c++ {
			if grid[r][c] == player && grid[r-1][c+1] == player && grid[r-2][c+2] == player && grid[r-3][c+3] == player {
				return true
			}
		}
	}
	return false
}

func getCellForPlayer(player Player) (Cell, error) {
	if player == YellowPlayer {
		return YellowCell, nil
	} else if player == RedPlayer {
		return RedCell, nil
	}
	return -1, fmt.Errorf("no matching celle for play %d", player)
}

func getOtherCell(cell Cell) Cell {
	if cell == RedCell {
		return YellowCell
	} else if cell == YellowCell {
		return RedCell
	}
	return EmptyCell
}
