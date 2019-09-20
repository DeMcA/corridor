import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Input, Output, EventEmitter, Component } from '@angular/core';

import { BoardComponent } from './board.component';

@Component({selector: 'app-board-square', template: ''})
class BoardSquareStubComponent {
  @Input() idx: number;
  @Input() location;
  @Input() player: number;
  @Output() squareClicked = new EventEmitter<number>();
}

@Component({selector: 'app-board-wall', template: ''})
class BoardWallStubComponent {
  @Input() idx;
  @Input() wall;
  @Input() orientation;
}

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BoardComponent,
        BoardSquareStubComponent,
        BoardWallStubComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
