import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LobbyRoutingModule } from './lobby-routing.module';
import { LobbyComponent } from './lobby/lobby.component';
import {NzGridModule} from "ng-zorro-antd/grid";


@NgModule({
  declarations: [
    LobbyComponent
  ],
  imports: [
    CommonModule,
    LobbyRoutingModule,
    NzGridModule
  ]
})
export class LobbyModule { }
