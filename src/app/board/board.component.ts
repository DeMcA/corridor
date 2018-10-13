import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  squares: Array<number>;
  player1
  player2

  constructor() {
    this.squares  = Array<number>(81).fill(0);
    this.squares[4] = 1;
    this.squares[76] = 2;
  }

  ngOnInit() {
  }

  onSquareClicked(sqIdx: number){
    console.log("square passed to board")
    console.log(sqIdx)
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

