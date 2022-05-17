import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";

import {
  DialogOverviewExampleComponent,
  DialogOverviewExampleDialogComponent
} from './dialogue/dialogue.component';
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";


@NgModule({
  declarations: [
    DialogOverviewExampleComponent,
    DialogOverviewExampleDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    CommonModule,
    FormsModule
  ]
})
export class SharedModule {
}
