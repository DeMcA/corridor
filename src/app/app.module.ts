import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { BoardSquareComponent } from './board-square/board-square.component';
import { BoardWallComponent } from './board-wall/board-wall.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    BoardSquareComponent,
    BoardWallComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
