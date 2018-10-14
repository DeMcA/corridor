import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-board-square',
  templateUrl: './board-square.component.html',
  styleUrls: ['./board-square.component.css']
})
export class BoardSquareComponent implements OnInit {

  @Input() idx: number;
  @Input() location;
  @Input() player;
  @Input() vwall
  @Input() hwall

  @Output() squareClicked = new EventEmitter<number>();
  @Output() horizontalClicked = new EventEmitter<number>();
  @Output() verticalClicked = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  click() {
    console.log("square clicked")
    this.squareClicked.emit(this.idx)
  }

  verticalClick() {
    console.log("vertical click in square")
    this.verticalClicked.emit(this.idx)
  }


  horizontalClick() {
    console.log("horizontal click in square")
    this.horizontalClicked.emit(this.idx)
  }

  // Don't actually need this for anything, will control in board componenet
  pieceClick() {
    console.log("click player ", this.player)
  }

  // getClass() {
  //   return 'square '+Object.keys(this.location).filter(
  //     (key) => this.location[key]
  //   ).join(' ')
  // }



}
