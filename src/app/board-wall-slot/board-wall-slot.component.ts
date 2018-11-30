import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-board-wall-slot',
  templateUrl: './board-wall-slot.component.html',
  styleUrls: ['./board-wall-slot.component.css']
})
export class BoardWallSlotComponent implements OnInit {
  @Input() idx;
  // @Output() horizontalClicked = new EventEmitter<number>();
  @Input() wall;

  topDistance: number;
  leftDistance: number;
  @Input() orientation: string;

  constructor() {}

  ngOnInit() {
    if (this.orientation === 'horizontal') {
      this.topDistance = 45 + 50 * Math.floor(this.idx / 9);
      this.leftDistance = 5 + 50 * (this.idx % 9);
    } else if (this.orientation === 'vertical') {
      this.topDistance = 5 + 50 * (this.idx % 9);
      this.leftDistance = 45 + 50 * Math.floor(this.idx / 9);
    }
  }
}
