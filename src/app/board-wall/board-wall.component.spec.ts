import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardWallComponent } from './board-wall.component';

describe('BoardWallComponent', () => {
  let component: BoardWallComponent;
  let fixture: ComponentFixture<BoardWallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardWallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardWallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
