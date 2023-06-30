import {Component, OnInit} from '@angular/core';
import {GameService} from "../../services";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-connect4-grid',
  templateUrl: './connect4-grid.component.html',
  styleUrls: ['./connect4-grid.component.css']
})


export class Connect4GridComponent implements OnInit {
  defaultDepth = 6
  waitingTimeAfterAiMoveMs = 0
  connect4Grid: number[][] = [];
  lastAiMove: number = -1;
  history: GameHistory[] = []
  columnScores: number[] = [];
  cellTypes: CellType[] = [new CellType(0, "white", "cell-empty"),
    new CellType(1, '#ffd500', "cell-yellow"),
    new CellType(2, 'red', "cell-red")]
  players: Player[] = [new Player(0, this.cellTypes[1], "yellow", this.defaultDepth),
    new Player(1, this.cellTypes[2], 'red', this.defaultDepth)]
  currentPlayer: Player = this.players[0];
  isWaitingAiResponse = false

  constructor(private service: GameService, private route: ActivatedRoute, private router: Router,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.service.getGrid().subscribe(data => {
        this.connect4Grid = data.Grid;
        this.currentPlayer = this.players[data.CurrentPlayerColor];
      },
      error => {
        console.error('Failed to fetch Connect 4 grid data', error);
      })

    this.route.queryParams.subscribe(params => {
      this.players[1].isAi = params['redIsAi'] == 'true';
      this.players[1].depth = params['redDepth']
      this.players[1].depth ??= this.defaultDepth
      this.players[0].isAi = params['yellowIsAi'] == 'true';
      this.players[0].depth = params['yellowDepth']
      this.players[0].depth ??= this.defaultDepth
    });
    if (this.currentPlayer.isAi) {
      this.aiMove()
    }

    const savedHistory = localStorage.getItem('connect4History');
    if (savedHistory) {
      this.history = JSON.parse(savedHistory);
    }

  }

  humanMove(column: number): void {
    if (this.isWaitingAiResponse) {
      return
    }
    this.addToken(column)
  }


  aiMove() {
    if (this.isWaitingAiResponse) {
      return
    }
    this.isWaitingAiResponse = true
    this.service.minimax(this.currentPlayer.depth).subscribe(response => {
      this.columnScores = response.Scores
      this.addToken(response.BestMove)
      this.lastAiMove = response.BestMove
      this.isWaitingAiResponse = false
    })
  }


  private addToken(column: number): void {

    this.service.postToken(column).subscribe(async response => {
      // Update the grid with the new token
      this.connect4Grid[response.Line][response.Column] = response.AddedCell;
      if (response.PlayerWon) {
        const message = `Player ${this.currentPlayer.name.toUpperCase()} wins!`;
        this.openSnackBar(message)
        this.addToHistory(new GameHistory(this.currentPlayer.name, "Victory"))
      } else if (response.IsGridFull) {
        this.openSnackBar("Draw")
        this.addToHistory(new GameHistory("None", "Draw"))
      } else {
        this.currentPlayer = this.players[response.NextPlayer];
        if (this.currentPlayer.isAi) {
          if (this.waitingTimeAfterAiMoveMs > 0)
            await this.delay(this.waitingTimeAfterAiMoveMs)
          this.aiMove()
        }
      }
    }, error => {
      alert(error.error.Reason)
    });
  }

  getColumnIndex(target: EventTarget | null): number {
    const cell = target as HTMLTableCellElement;
    return cell.cellIndex;
  }

  resetGrid(): void {
    this.service.resetGame().subscribe((response) => {
      this.service.getGrid().subscribe(data => {
          this.columnScores = []
          this.connect4Grid = data.Grid;
          this.currentPlayer = this.players[data.CurrentPlayerColor];
          if (this.currentPlayer.isAi) {
            this.aiMove()
          }
        },
        error => {
          console.error('Failed to fetch Connect 4 grid data', error);
        })
    });
  }

  clearHistory(): void {
    this.history = []
    localStorage.setItem('connect4History', JSON.stringify(this.history));
  }

  toggleGameMode(playerId: number): void {
    this.players[playerId].isAi = !this.players[playerId].isAi
    const queryParams: Params = {
      yellowIsAi: this.players[0].isAi,
      redIsAi: this.players[1].isAi
    };


    // Navigate to the updated URL with the new query parameters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
    if (this.currentPlayer.isAi) {
      this.aiMove()
    }
  }

  updateDepth(newDepth: number, player: Player): void {
    if (newDepth == null) {
      return
    }
    player.depth = newDepth;

    const queryParams: Params = {
      yellowIsAi: this.players[0].isAi,
      redIsAi: this.players[1].isAi,
      yellowDepth: this.players[0].depth,
      redDepth: this.players[1].depth
    };

    // Navigate to the updated URL with the new query parameters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

  private openSnackBar(message: string) {
    const config = {
      duration: 10000,
      panelClass: ['mat-toolbar', 'mat-primary']
    }
    this._snackBar.open(message, "Close", config)
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private addToHistory(historyElem: GameHistory): void {
    // Save the history to local storage
    this.history.push(historyElem)
    localStorage.setItem('connect4History', JSON.stringify(this.history));
  }
}

class GameHistory {
  constructor(public playerName: string, public gameResult: string) {
  }
}

class CellType {
  constructor(public id: number, public color: string, public style: string) {
  }
}

class Player {
  set isAi(value: boolean) {
    console.log(value)
    this._isAi = value;
  }

  get isAi(): boolean {
    return this._isAi;
  }

  constructor(public id: number, public cellType: CellType, public name: string, public depth: number) {
  }

  private _isAi: boolean = false
}

