import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DsgvoRoutingModule } from './dsgvo-routing.module';
import { DsgvoComponent } from './dsgvo/dsgvo.component';


@NgModule({
  declarations: [
    DsgvoComponent
  ],
  imports: [
    CommonModule,
    DsgvoRoutingModule
  ]
})
export class DsgvoModule { }
