import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameBoardRoutingModule } from './game-board-routing.module';
import {GameBoardComponent} from "./game-board/game-board.component";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzOverflowModule} from "ng-zorro-antd/cdk/overflow";


@NgModule({
  declarations: [
    GameBoardComponent
  ],
  imports: [
    CommonModule,
    GameBoardRoutingModule,
    NzGridModule,
    NzSpaceModule,
    NzOverflowModule,
  ]
})
export class GameBoardModule { }
