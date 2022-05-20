import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: PageNotFoundComponent
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'lobby',
    loadChildren: () => import('./pages/lobby/lobby.module').then(m => m.LobbyModule)
  },
  {
    path: 'game',
    loadChildren: () => import('./pages/game-board/game-board.module').then(m => m.GameBoardModule)
  },
  {
    path: 'impressum',
    loadChildren: () => import('./pages/impressum/impressum.module').then(m => m.ImpressumModule)
  },
  {
    path: 'dsgvo',
    loadChildren: () => import('./pages/dsgvo/dsgvo.module').then(m => m.DsgvoModule)
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
