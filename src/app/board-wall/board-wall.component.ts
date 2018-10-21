import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-board-wall',
  templateUrl: './board-wall.component.html',
  styleUrls: ['./board-wall.component.css']
})
export class BoardWallComponent implements OnInit {

  @Input() idx
  @Input() wall
  @Input() orientation

  topDistance: number;
  leftDistance: number;

  constructor() { 
  }

  ngOnInit() {
    if ( this.orientation === "horizontal" ) {
      this.topDistance = 45+50*Math.floor(this.idx/8);
      this.leftDistance = 5+50*(this.idx % 8)
    } else if ( this.orientation === "vertical" ) {
      this.topDistance = 5+50*(this.idx % 8 );
      this.leftDistance = 45+50*Math.floor(this.idx / 8 )
    }
  }

}
