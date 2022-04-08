import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page/login-page.component';
import {SharedModule} from "../../shared/shared.module";
import {LoginRoutingModule} from "./login-routing.module";
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    LoginPageComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    HttpClientModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
