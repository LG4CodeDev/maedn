import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CommonModule} from "@angular/common";
import {GameBoardComponent} from "./game-board/game-board.component";

const routes: Routes = [
  {path: '', component: GameBoardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule]
})
export class GameBoardRoutingModule { }
