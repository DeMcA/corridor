import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-board-square',
  templateUrl: './board-square.component.html',
  styleUrls: ['./board-square.component.css']
})
export class BoardSquareComponent implements OnInit {
  @Input() idx: number;
  @Input() location;
  @Input() player: number;

  @Output() squareClicked = new EventEmitter<number>();
  @Output() pieceClicked = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {}

  click() {
    console.log('square clicked', this.idx);
    this.squareClicked.emit(this.idx);
  }

  // Don't actually need this for anything, can deduce in board component
  pieceClick() {
    console.log(`player ${this.player} clicked`);
    this.pieceClicked.emit(this.player);
  }
}
