import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CommonModule} from "@angular/common";
import {LobbyComponent} from "./lobby/lobby.component";

const routes: Routes = [
  {path: '', component: LobbyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule]
})
export class LobbyRoutingModule { }
