import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginPageComponent} from "./login-page/login-page.component";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {path: '', component: LoginPageComponent}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class LoginRoutingModule {
}
