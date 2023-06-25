package main

import "connect4solver/game"

// swagger:response AddTokenResponse
type AddTokenResponse struct {
	// in: body
	Body *AddTokenResponseBody
}

type AddTokenResponseBody struct {
	// Required: true
	Line int
	// Required: true
	Column int
	// Required: true
	AddedCell game.Cell
	// Required: true
	NextPlayer game.Player
	// Required: true
	PlayerWon bool
	// Required: true
	IsGridFull bool
	// Required: true
	CurrentPlayer game.Player
}

// swagger:response BadRequestError
type BadRequestError struct {
	// in: body
	body *BadRequestErrorBody
}

type BadRequestErrorBody struct {
	// Required: true
	Reason string
}

// swagger:response GetGridResponse
type GetGridResponse struct {
	// in: body
	body *GetGridResponseBody
}

type GetGridResponseBody struct {
	// Required: true
	Grid [][]game.Cell
	// Required: true
	CurrentPlayerColor game.Player
}

// swagger:response MiniMaxiResponse
type MiniMaxiResponse struct {
	// in: body
	body *MiniMaxiResponseBody
}

type MiniMaxiResponseBody struct {
	// Required: true
	BestMove int
}
