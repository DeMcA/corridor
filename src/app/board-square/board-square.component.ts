import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-board-square',
  templateUrl: './board-square.component.html',
  styleUrls: ['./board-square.component.css']
})
export class BoardSquareComponent {
  @Input() idx: number;
  @Input() connectivity: number[];
  @Input() player: number;
  @Input() pawnToMove: number;
  debug = true;

  @Output() squareClicked = new EventEmitter<number>();

  constructor() {}

  click() {
    console.log('square clicked', this.idx);
    this.squareClicked.emit(this.idx);
  }

}
