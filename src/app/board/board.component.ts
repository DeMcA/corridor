import { Component, OnInit, Input } from '@angular/core';
import { GraphService } from '../graph.service';

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
  players;
  selectedPiece: null | string;

  constructor(
    private graph: GraphService
  ) {
    this.squares = Array(81).fill(0);
    this.horizontalWalls = <WallArray>Array(64).fill(0);
    // When storing/transferring board state, something like len 10 array
    // or .fill(None) and use coordinate tuples? TODO: document a communication format
    this.verticalWalls = <WallArray>Array(64).fill(0);
    this.squares[4] = 1;
    this.squares[76] = 2;
    this.currentTurn = 0;
    this.selectedPiece = null;
    this.players = [
      {
        key: 1,
        walls: 10,
        position: 4
      },
      {
        key: 2,
        walls: 10,
        position: 76
      }
    ];
  }

  ngOnInit() {}

  trackByWalls(index: number, wall) {
    return index;
  }

  get player() {
    return this.players[this.currentTurn % 2];
  }

  // ensure unique index for each wall in wall arrays
  // Not needed if using separate len 64 wall arrays.
  get wallLabel() {
    return this.player.walls * this.player.key;
  }

  // Using "onXClicked()" to refer to events from child component
  onSquareClicked(sqIdx: number) {
    if (this.selectedPiece === 'player') {
      this.moveCurrentPlayer(sqIdx);
    } else if (sqIdx === this.player.position) {
      this.selectedPiece = 'player';
    }
  }

  // TODO don't need this as using this.selectedPiece to determine course of action on onSquareClicked
  onPieceClicked(playerSqIdx) {
  }

  onWallClicked(idx: number, orientation: 'vertical'|'horizontal') {
    if (this.player.walls < 1) {
      window.alert('no more walls');
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
        this.player.walls--;
        this.currentTurn++;
      } else {
        window.alert('can\'t go there');
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

  // TODO (injecrt as a service - construct graphs etc.)
  isPathToEnd() {
    return true;
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
    if (this.isLegalPlayerMove) {
      // Update sqaures array with new position:
      this.squares[this.player.position] = 0;
      this.squares[idx] = this.player.key;
      // Update player information:
      this.player.position =  idx;
      // TODO: player reference should work same in service and this componenet
      if (this.player.key === 1) {
        this.graph.player.position = idx;
      } else {
        this.graph.opponent.position = idx;
      }
      this.completeTurn();
    }
  }

  // TODO (inject as service)
  isLegalPlayerMove() {
    return true;
  }

  getSquareLocation(idx) {
    const location = { top: false, bottom: false, left: false, right: false };
    if (idx % 9 === 0) {
      location.left = true;
    }
    if (idx % 8 === 0) {
      location.right = true;
    }
    if (idx < 9) {
      location.top = true;
      return location;
    }
    if (idx > 71) {
      location.bottom = true;
      return location;
    }
    return location;
  }

  completeTurn() {
    this.currentTurn++;
    this.selectedPiece = null;
    // Might remove piece Selection -> automatically play wall if click on wall and piece if click on square
  }

}
