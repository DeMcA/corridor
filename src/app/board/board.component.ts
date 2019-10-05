import { Component, OnInit, Input, NgZone  } from '@angular/core';
import { GraphService, Player} from '../graph.service';

interface WallArray extends Array<number> {
  length: 64;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  squares: Array<number>; // represents the board. 0 if no piece, 1 for player 1, 2 for player2
  currentTurn: number;
  horizontalWalls: WallArray;
  verticalWalls: WallArray;
  players: Player[];
  infoMessage: string | null;
  history: Array<Array<number>|string> = []; // Either [fromIdx, toIdx] or 'v'Idx / 'h'Idx
  gameOver = false;

  constructor(
    private graph: GraphService,
    private zone: NgZone
  ) {
    this.squares = Array(81).fill(0);
    this.horizontalWalls = <WallArray>Array(64).fill(0);
    // When storing/transferring board state, something like len 10 array
    // or .fill(None) and use coordinate tuples? TODO: document a communication format
    this.verticalWalls = <WallArray>Array(64).fill(0);
    this.squares[4] = 1;
    this.squares[76] = 2;
    this.currentTurn = 0;
    this.players = [
      {
        key: 1,
        walls: 10,
        position: 4,
        hasWon: (pos: number) => pos > 70
      },
      {
        key: 2,
        walls: 10,
        position: 76,
        hasWon: (pos: number) => pos < 9,
      }
    ];
  }

  ngOnInit() {}

  trackByWalls(index: number, wall) {
    return index;
  }

  get player(): Player {
    return this.players[this.currentTurn % 2];
  }

  get opponent(): Player {
    return this.players[this.currentTurn % 2 ^ 1];
  }

  // ensure unique index for each wall in wall arrays
  // Not needed if using separate len 64 wall arrays.
  get wallLabel() {
    return this.player.walls * this.player.key;
  }

  get pawnToMove() {
    return this.players[this.currentTurn % 2].position;
  }

  // Using "onXClicked()" to refer to events from child component
  onSquareClicked(sqIdx: number) {
    this.gameOver || this.moveCurrentPlayer(sqIdx);
  }

  onWallClicked(idx: number, orientation: 'vertical'|'horizontal') {
    if (this.gameOver) return;
    if (this.player.walls < 1) {
      this.illegalMoveAction('no more walls');
    } else {
      let walls, orthWalls;
      if (orientation === 'vertical') {
        walls = this.verticalWalls;
        orthWalls = this.horizontalWalls;
      } else {
        orthWalls = this.verticalWalls;
        walls = this.horizontalWalls;
      }
      if (this.legalWallMove(idx, walls, orthWalls, orientation)) {
        walls[idx] = 1;
        this.history.push(orientation[0]+idx)
        this.player.walls--;
        this.currentTurn++;
      } else {
        this.illegalMoveAction('can\'t go there');
      }
    }
  }

  isBlockingOrthWall(i, walls) {
    const p = i % 8;
    const q = Math.floor(i / 8);
    return walls[p * 8 + q];
  }

  isBlockingSameWall(i, walls: WallArray) {
    return walls[i] // already has a wall
      || ( i % 8 !== 0 && walls[i - 1] ) // wall in slot in front
      || ( i % 8 !== 7 && walls[i + 1] ); // wall in slot behind
  }

  legalWallMove(idx, walls, orthWalls, orientation) {
    return !this.isBlockingOrthWall(idx, orthWalls)
      && !this.isBlockingSameWall(idx, walls)
      && this.pathExistsForPawns(idx, orientation)
  }

  pathExistsForPawns(idx, orientation) {
    if (orientation === 'vertical') {
      return this.graph.placeVerticalWall(idx)
    }
    return this.graph.placeHorizontalWall(idx);
  }

  moveCurrentPlayer(idx) {
    if (this.isLegalPlayerMove(idx)) {
      this.history.push([this.player.position, idx]);
      if (this.player.hasWon(idx)) {
        this.gameOver = true;
        this.infoMessage = `Player ${this.player.key} has won`;
      }
      // Update sqaures array with new position:
      this.squares[this.player.position] = 0;
      this.squares[idx] = this.player.key;
      // Update player information:
      this.player.position =  idx;
      // TODO: player reference should work same in service and this componenet
      if (this.player.key === 1) {
        this.graph.player = this.player;
      } else {
        // TODO: make this nicer
        this.graph.opponent = this.player
      }
      this.currentTurn++;
    } else {
      this.illegalMoveAction('Can\'t move player there');
    }
  }

  isLegalPlayerMove(newSquareIdx: number) {
    if (this.graph.edges[this.player.position].indexOf(newSquareIdx) > -1) {
      return true;
    }
    return false;
  }

  // for debugging
  getSquareConnections(idx) {
    const arr = this.graph.edges[idx];
    if (arr.length > 3) {
      return JSON.stringify(arr.slice(0,2))+'\n'+JSON.stringify(arr.slice(2,arr.length));
    }
    return JSON.stringify(arr)
  }

  illegalMoveAction(message: string) {
    this.infoMessage = message;
    setTimeout(() => this.infoMessage = null, 1000);
  }

  undoLastMove() {
    if (this.gameOver) {
      this.gameOver = false;
      this.infoMessage = null;
    }
    const lastMove = this.history.pop();
    // currently adding array ofr [from, to] or wallplacement string to history. Might change
    if (typeof lastMove === 'object') {
      const [prevSqIdx, lastMoveSqIdx] = lastMove;
      this.opponent.position = prevSqIdx; // set player from previous turn to previous position
      this.squares[prevSqIdx] = this.opponent.key; // go back to previous square
      this.squares[lastMoveSqIdx] = 0; // remove the player from the square it moved to
    } else {
      this.player.walls++;
      if (lastMove[0] === 'v') {
        this.verticalWalls[lastMove.slice(1)] = 0;
      } else if (lastMove[0] === 'h') {
        this.horizontalWalls[lastMove.slice(1)] = 0;
      }
    }
    this.graph.undoLastMove();
    this.currentTurn--;
  }

  // TODO: should be a cleaner way of Refreshing without hard reload
  resetPage() {
    this.zone.runOutsideAngular(() => {
      location.reload();
    });
  }

}
