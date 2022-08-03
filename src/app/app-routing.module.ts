import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { URL } from './core/constants/urls.constant';
import { AdministratorGuard } from './core/guards/administrator.guard';
import { AuthGuard, NotAuthGuard } from './core/guards/auth.guard';
import { LogInComponent } from './modules/auth/log-in/log-in.component';
import { NotFoundPageComponent } from './modules/error-pages/not-found-page/not-found-page.component';
import { OthersPageComponent } from './modules/others/others-page/others-page.component';
import { UsersPageComponent } from './modules/others/users-page/users-page.component';

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
    path: URL.OTHERS.BASE,
    title: 'Otros',
    component: OthersPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: URL.OTHERS.USERS,
    title: 'Usuarios',
    component: UsersPageComponent,
    canActivate: [AuthGuard, AdministratorGuard],
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
