import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LobbyRoutingModule } from './lobby-routing.module';
import {DialogueTemplateComponent, LobbyComponent} from './lobby/lobby.component';
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzInputModule} from "ng-zorro-antd/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzButtonModule} from "ng-zorro-antd/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    LobbyComponent,
    DialogueTemplateComponent,
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
  ],
  exports: [
  ]
})
export class LobbyModule { }
