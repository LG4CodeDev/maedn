import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  //other modules insert here
  {
    //TODO: 404 page
    path: '**',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  }
  ];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

//ng g m subfolder/module-name --route route/to/page --module app
