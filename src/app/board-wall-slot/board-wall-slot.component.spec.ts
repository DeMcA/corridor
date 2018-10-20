import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardWallSlotsComponent } from './board-wall.component';

describe('BoardWallSlotsComponent', () => {
  let component: BoardWallSlotsComponent;
  let fixture: ComponentFixture<BoardWallSlotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardWallSlotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardWallSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
