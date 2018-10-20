import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  squares: Array<number>; // represents the board. 0 if no piece, 1 for player 1, 2 for player2
  currentTurn: number
  verticalWalls: Array<number> // 0 for no wall, > 0 wall. idx equals if same wall
  horizontalWalls: Array<number>
  horizontalWallSlots: Array<number>
  players

  selectedPiece: null|string

  constructor() {
    this.squares  = Array<number>(81).fill(0);
    this.verticalWalls  = Array<number>(81).fill(0);
    this.horizontalWalls  = Array<number>(64).fill(0);
    this.horizontalWallSlots = Array<number>(72).fill(0);
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
    if (this.selectedPiece === "player")  {
      this.moveCurrentPlayer(sqIdx)
    }
    else if (sqIdx === this.player.position) {
      this.selectedPiece = "player"
    }
  }
  
  // TODO: DRY: Should I use a single emitter for wallClick and pass type?
  onHorizontalClicked(sqIdx: number) {
      console.log("horizontal wall clicked and received by board", sqIdx)
      if(sqIdx % 9 === 8 ) { sqIdx-- }
      let idx = sqIdx - Math.floor(sqIdx/9)
      console.log(idx)
      this.horizontalWalls[idx] = 1; // or wallLabel (or anything truthy)
    // if (this.selectedPiece === "wall") {
      // this.horizontalWalls[sqIdx] = this.wallLabel
      // this.horizontalWalls[sqIdx+1] = this.wallLabel
      this.player.walls-- ;
      this.currentTurn++ ;
      // this.completeTurn();
    // }
  }

  onVerticalClicked(sqIdx: number) {
    if (this.selectedPiece === "wall") {
      if(sqIdx > 71){ sqIdx = sqIdx - 9 }
      if(this.legalVerticalWallMove(sqIdx) ){
        this.verticalWalls[sqIdx] = this.wallLabel
        this.verticalWalls[sqIdx+9] = this.wallLabel
        this.player.walls--;
        this.completeTurn();
      }
      else(window.alert("can't go there"))
    }
  }

  // ensure unique index for each wall in wall arrays
  // Not needed if using separate len 64 wall arrays.
  get wallLabel() {
    return this.player.walls*this.player.key
  }

  legalVerticalWallMove(idx){
    return this.player.walls > 0
      && !this.verticalWalls[idx]
      && !this.verticalWalls[idx+9]
      && !this.horizontalWalls[idx+9]
      || this.horizontalWalls[idx+9] !== this.horizontalWalls[idx+8]
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

