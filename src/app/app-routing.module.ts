import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { URL } from './core/constants/urls.constant';
import { AuthGuard, NotAuthGuard } from './core/guards/auth-guard.guard';
import { LogInComponent } from './modules/auth/log-in/log-in.component';
import { NotFoundPageComponent } from './modules/error-pages/not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: URL.LOG_IN,
    title: 'Iniciar Sesión',
    component: LogInComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: URL.PAGE_NOT_FOUND,
    title: 'Página No Encontrada',
    component: NotFoundPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: URL.PAGE_NOT_FOUND,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
