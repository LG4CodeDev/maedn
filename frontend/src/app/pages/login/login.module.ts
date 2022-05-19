import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page/login-page.component';
import {SharedModule} from "../../shared/shared.module";
import {LoginRoutingModule} from "./login-routing.module";
import { HttpClientModule } from '@angular/common/http';
import {FormControl, FormGroupDirective, NgForm, ReactiveFormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzTabsModule} from "ng-zorro-antd/tabs";



@NgModule({
  declarations: [
    LoginPageComponent
  ],
    imports: [
        SharedModule,
        CommonModule,
        HttpClientModule,
        LoginRoutingModule,
        ReactiveFormsModule,
        NzInputModule,
        NzButtonModule,
        NzGridModule,
        NzCheckboxModule,
        NzFormModule,
        NzTabsModule,
    ]
})
export class LoginModule { }

interface ErrorStateMatcher {
}
