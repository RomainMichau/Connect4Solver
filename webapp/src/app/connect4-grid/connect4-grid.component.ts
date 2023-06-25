import {Component, OnInit} from '@angular/core';
import {GameService} from "../../services";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-connect4-grid',
  templateUrl: './connect4-grid.component.html',
  styleUrls: ['./connect4-grid.component.css']
})


export class Connect4GridComponent implements OnInit {
  connect4Grid: number[][] = [];
  miniMaxBestMove: number = -1;
  cellTypes: CellType[] = [new CellType(0, "white", "cell-empty"),
    new CellType(1, '#ffd500', "cell-yellow"),
    new CellType(2, 'red', "cell-red")]
  players: Player[] = [new Player(0, this.cellTypes[1], "yellow"),
    new Player(1, this.cellTypes[2], 'red')]
  currentPlayer: Player = this.players[0];

  constructor(private service: GameService, private route: ActivatedRoute, private router: Router,
              private toastr: ToastrService) {
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
      this.players[0].isAi = params['yellowIsAi'] == 'true';
    });
  }


  addToken(column: number): void {
    this.service.postToken(column).subscribe(async response => {
      // Update the grid with the new token
      this.connect4Grid[response.Line][response.Column] = response.AddedCell;
      if (response.PlayerWon) {
        const message = `Player ${this.currentPlayer.name.toUpperCase()} wins!`;
        this.toastr.success(message, `Player ${this.currentPlayer.name} win`, {
          toastClass: 'toast-' + this.currentPlayer.name + '-win',
          positionClass: 'toast-center'
        });
      } else if (response.IsGridFull) {
        this.toastr.success("Draw", 'Draw', {
          positionClass: 'toast-center'
        });
      } else {
        this.currentPlayer = this.players[response.NextPlayer];
        if (this.currentPlayer.isAi) {
          await this.delay(200)
          this.aiMove()
        }
      }
    }, error => {
      alert(error.error.Reason)
    });
  }

  aiMove() {
    this.service.minimax().subscribe(response => {
      this.addToken(response.BestMove)
    })
  }

  minimax() {
    this.service.minimax().subscribe(response => {
      this.miniMaxBestMove = response.BestMove
    })
  }


  getColumnIndex(target: EventTarget | null): number {
    const cell = target as HTMLTableCellElement;
    return cell.cellIndex;
  }

  resetGrid(): void {
    this.service.resetGame().subscribe((response) => {
      this.service.getGrid().subscribe(data => {
          this.connect4Grid = data.Grid;
          this.currentPlayer = this.players[data.CurrentPlayerColor];
        },
        error => {
          console.error('Failed to fetch Connect 4 grid data', error);
        })
    });
  }

  toggleGameMode(playerId: number): void {
    this.players[playerId].isAi = !this.players[playerId].isAi
    const queryParams: Params = {
      yellowIsAi: this.players[0].isAi,
      redIsAi: this.players[1].isAi
    };

    console.log(this.players[playerId].isAi)

    // Navigate to the updated URL with the new query parameters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
  constructor(public id: number, public cellType: CellType, public name: string) {
  }

  private _isAi: boolean = false
}

