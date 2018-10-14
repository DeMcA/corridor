import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  squares: Array<number>;
  currentTurn: number
  lastClicked: null|number
  readyToMove: boolean
  verticalWalls: Array<number>
  horizontalWalls: Array<number>
  pieces
  players
  player
  playerIdx: number

  selectedPiece: null|string

  constructor() {
    this.squares  = Array<number>(81).fill(0);
    // represents the board. 0 if no piece, 1 for player 1, 2 for player2
    this.verticalWalls  = Array<number>(81).fill(0);
    this.horizontalWalls  = Array<number>(81).fill(0);
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
    ]


  }


  ngOnInit() {
  }


  get player() {
    return (this.players[this.currentTurn%2])
  } 

  wallSelectorClicked() {
    this.selectedPiece = "wall";
  }

  // Using "onXXXClicked()" to refer to events from child componenet
  onSquareClicked(sqIdx: number) {
    console.log("idx:",sqIdx, "player", this.player, "selected", this.selectedPiece)
    if (this.selectedPiece === "player"  {
      this.moveCurrentPlayer(sqIdx)
    }
    else if (sqIdx === this.player.position) {
      this.selectedPiece = "player"
    }
  }
  
  // TODO: DRY: Should I use a single emitter for wallClick and pass type?
  onHorizontaliClicked(sqIdx: number) {
    if (this.selectedPiece === "wall") {
      if(sqIdx % 9 === 8 ) { sqIdx-- }
      this.horizontalWalls[sqIdx] = 1
      this.horizontalWalls[sqIdx+1] = 1
      this.player.walls--;
      this.completeTurn();
    }
  }

  onVerticalClicked(sqIdx: number) {
    if (this.selectedPiece === "wall") {
      if(sqIdx > 71){ sqIdx = sqIdx - 9 }
      this.verticalWalls[sqIdx] = 1
      this.verticalWalls[sqIdx+9] = 1
      this.player.walls--;
      this.completeTurn();
    }
  }

  moveCurrentPlayer(idx) {
    if (this.isLegalPlayerMove) {
      // Update sqaures array with new position:
      this.squares[this.player.position] = 0;
      this.squares[idx] = this.player.key;
      // Update player information:
      this.player.position = idx
      this.completeTurn();

    }
  }

  completeTurn() {
    this.currentTurn++
    this.selectedPiece = null
  }

  // TODO
  get isLegalPlayerMove(){
    return true
  }

  // TODO
  get isLegalWallMove(){
    return true
  }

  getSquareLocation(idx) {
    let location = {top:false, bottom:false, left:false, right:false}
    if (idx % 9 === 0) { location.left = true }
    if (idx % 8 === 0) { location.right = true }
    if (idx < 9 ) {
      location.top = true;
      return location
    }
    if (idx > 71 ) {
      location.bottom = true;
      return location
    }
    return location
  }
}

