import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DsgvoComponent} from "./dsgvo/dsgvo.component";

const routes: Routes = [
  {path: '', component: DsgvoComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DsgvoRoutingModule { }
