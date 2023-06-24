// Package classification connect4 API.
//
// Documentation of our connect4 API.
//
//	Version: 1.0.0
//	Consumes:
//	- application/json
//
//	Produces:
//	- application/json
//
//	Schemes: http, https
//
// swagger:meta
package main

import (
	"connect4solver/game"
	"encoding/json"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"strconv"
)

type Controller struct {
	game *game.Game
}

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
	Cell game.Cell
	// Required: true
	CurrentPlayerColor game.Player
	// Required: true
	PlayerWon bool
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

func InitController(game *game.Game) {
	controller := Controller{game: game}
	r := mux.NewRouter()
	r.HandleFunc("/api/grid", controller.getGrid)
	r.HandleFunc("/api/token", controller.addTokenHandler)
	r.HandleFunc("/api/grid/reset", controller.resetHandler)
	log.Println("starting server")
	log.Fatal(http.ListenAndServe(":8081", r))
}

// swagger:route GET /api/grid game getGrid
// Return the current grid the game
// Responses:
//
//	200: GetGridResponse
func (c *Controller) getGrid(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(GetGridResponseBody{Grid: c.game.Grid, CurrentPlayerColor: c.game.PlayerPlaying})
}

// swagger:route POST /api/token game postToken
//
//	   Produces:
//	   	  - application/json
//		Parameters:
//		  + name: column
//		    in: query
//		    description: Column to add the token
//		    required: true
//		    type: integer
//
//		Responses:
//		  200: AddTokenResponse
//		  400: BadRequestError
func (c *Controller) addTokenHandler(w http.ResponseWriter, r *http.Request) {
	columnSt := r.URL.Query().Get("column")
	if columnSt == "" {
		http.Error(w, "Missing 'column' parameter", http.StatusBadRequest)
		return
	}
	column, err := strconv.Atoi(columnSt)
	if err != nil {
		http.Error(w, "Cannot parse colum to int", http.StatusInternalServerError)
	}

	if !c.game.CanAddToken(column) {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(BadRequestErrorBody{
			Reason: "No room left on the column",
		})
		return
	}
	column, line, cell, err := c.game.AddToken(column)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	json.NewEncoder(w).Encode(AddTokenResponseBody{
		Column:             column,
		Line:               line,
		Cell:               cell,
		CurrentPlayerColor: c.game.PlayerPlaying,
		PlayerWon:          c.game.CheckWin(line, column),
	})

}

// swagger:route POST /api/grid/reset game resetGame
//
//	Responses:
//	  200:
func (c *Controller) resetHandler(w http.ResponseWriter, r *http.Request) {
	c.game.Reset()
}
