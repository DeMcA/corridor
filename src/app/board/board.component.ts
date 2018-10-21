import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  squares: Array<number>; // represents the board. 0 if no piece, 1 for player 1, 2 for player2
  currentTurn: number
  horizontalWalls: Array<number>
  horizontalWallSlots: Array<number>
  verticalWalls: Array<number>
  verticalWallSlots: Array<number>
  players

  selectedPiece: null|string

  constructor() {
    this.squares  = Array<number>(81).fill(0);
    this.horizontalWalls  = Array<number>(64).fill(0);
    this.horizontalWallSlots = Array<number>(72).fill(0);
    this.verticalWalls  = Array<number>(64).fill(0);
    this.verticalWallSlots = Array<number>(72).fill(0);
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

  trackByWalls( index: number, wall) {
    return index
  }

  get player() {
    return (this.players[this.currentTurn%2])
  } 

  wallSelectorClicked() {
    this.selectedPiece = "wall";
  }

  // Using "onXXXClicked()" to refer to events from child componenet
  onSquareClicked(sqIdx: number) {
    if (this.selectedPiece === "player")  {
      this.moveCurrentPlayer(sqIdx)
    }
    else if (sqIdx === this.player.position) {
      this.selectedPiece = "player"
    }
  }
  
  onHorizontalClicked(sqIdx: number) {
      if(sqIdx % 9 === 8 ) { sqIdx-- }
      let idx = sqIdx - Math.floor(sqIdx/9)
      this.horizontalWalls[idx] = 1; // or wallLabel (or anything truthy)
      this.player.walls-- ;
      this.currentTurn++ ;
  }

  // TODO: DRY
  onVerticalClicked(sqIdx: number) {
      if(sqIdx % 9 === 8 ) { sqIdx-- }
      let idx = sqIdx - Math.floor(sqIdx/9)
      if(this.legalVerticalWallMove(sqIdx) ){
        this.verticalWalls[idx] = 1
        this.player.walls--;
	this.currentTurn++ ;
      }
      else(window.alert("can't go there"))
  }

  // ensure unique index for each wall in wall arrays
  // Not needed if using separate len 64 wall arrays.
  get wallLabel() {
    return this.player.walls*this.player.key
  }

  legalVerticalWallMove(idx){
  	return true
  //return this.player.walls > 0
  //     && !this.verticalWalls[idx]
  //     && !this.verticalWalls[idx+9]
  //     && !this.horizontalWalls[idx+9]
  //     || this.horizontalWalls[idx+9] !== this.horizontalWalls[idx+8]
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
  // Might remove piece Selection -> automatically play wall if click on wall and piece if click on square
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

