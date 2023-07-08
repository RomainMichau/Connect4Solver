package main

import (
	"connect4solver/game"
	_ "encoding/json"
)

// swagger:response AddTokenResponse
type AddTokenResponse struct {
	// in: body
	Body *AddTokenResponseBody
}

type AddTokenResponseBody struct {
	// Required: true
	Line int `json:"line"`
	// Required: true
	Column int `json:"column"`
	// Required: true
	AddedCell game.Cell `json:"added_cell"`
	// Required: true
	NextPlayer game.Player `json:"next_player"`
	// Required: true
	PlayerWon bool `json:"player_won"`
	// Required: true
	IsGridFull bool `json:"is_grid_full"`
	// Required: true
	CurrentPlayer game.Player `json:"current_player"`
}

// swagger:response BadRequestError
type BadRequestError struct {
	// in: body
	body *BadRequestErrorBody
}

type BadRequestErrorBody struct {
	// Required: true
	Reason string `json:"reason"`
}

// swagger:response GetGridResponse
type GetGridResponse struct {
	// in: body
	body *GetGridResponseBody
}

type GetGridResponseBody struct {
	// Required: true
	Grid [][]game.Cell `json:"grid"`
	// Required: true
	CurrentPlayerColor game.Player `json:"current_player_color"`
}

// swagger:response MiniMaxiResponse
type MiniMaxiResponse struct {
	// in: body
	body *MiniMaxiResponseBody
}

type MiniMaxiResponseBody struct {
	// Required: true
	BestMove int `json:"best_move"`
	// Required: true
	Scores []int `json:"scores"`
}
