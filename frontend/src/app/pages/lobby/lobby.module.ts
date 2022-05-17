import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LobbyRoutingModule } from './lobby-routing.module';
import {LobbyComponent} from './lobby/lobby.component';
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzInputModule} from "ng-zorro-antd/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzModalModule} from "ng-zorro-antd/modal";

@NgModule({
  declarations: [
    LobbyComponent,
  ],
  imports: [
    CommonModule,
    LobbyRoutingModule,
    NzGridModule,
    NzInputModule,
    FormsModule,
    NzFormModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzModalModule
  ],
  exports: [
  ]
})
export class LobbyModule { }
