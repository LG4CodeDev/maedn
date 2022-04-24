import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameBoardRoutingModule } from './game-board-routing.module';
import {GameBoardComponent} from "./game-board/game-board.component";
import {NzGridModule} from "ng-zorro-antd/grid";


@NgModule({
  declarations: [
    GameBoardComponent
  ],
  imports: [
    CommonModule,
    GameBoardRoutingModule,
    NzGridModule
  ]
})
export class GameBoardModule { }
