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


  constructor() {
    this.squares  = Array<number>(81).fill(0);
    // represents the board. 0 if no piece, 1 for player 1, 2 for player2
    this.verticalWalls  = Array<number>(81).fill(0);
    this.horizontalWalls  = Array<number>(81).fill(0);
    this.squares[4] = 1;
    this.squares[76] = 2;
    this.currentTurn = 0;
    this.pieces = [4,76]
    this.walls = [10,10]
    this.lastClicked = null;
    this.readyToMove = false;
    // not using players object but might be best to make an interface for this
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

  get activePiece() { 
    let x = this.pieces[this.currentTurn % 2 ]
    // let y = this.players
    // console.log("active piece",x)
    return x
  }

  get currentPlayer() {
    let x = this.currentTurn % 2
    // console.log("current PLayer", x)
    return x+1
  }

  onSquareClicked(sqIdx: number){
    // If clicked on sqare containing piece of active player
    // If previously clicked on active piece then move to sqare
    if (this.readyToMove) {
      // make current square blank
      this.squares[this.activePiece] = 0
      // move marker for current player to new square
      this.squares[sqIdx] = this.currentPlayer 
      this.readyToMove = false
      this.pieces[this.currentTurn%2] = sqIdx
      // console.log("turn", this.currentTurn, "Idx: ", sqIdx, "last clicked: ", this.lastClicked, "ready?", this.readyToMove, "active piece: ", this.activePiece)
      this.currentTurn++
    }
    if (sqIdx === this.activePiece) {
      this.readyToMove = true
    }
    this.lastClicked = sqIdx
  }

  onHorizontaliClicked(sqIdx: number) {
    this.horizontalWalls[sqIdx] = 1
    this.horizontalWalls[sqIdx+1] = 1
    this.currentTurn++
  }

  onVerticalClicked(sqIdx: number) {
    this.verticalWalls[sqIdx] = 1
    this.verticalWalls[sqIdx+9] = 1
    this.currentTurn++
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

