import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministratorGuard } from '../guards/administrator.guard';
import { AuthGuard, NotAuthGuard } from '../guards/auth.guard';
import { LogInComponent } from '../../modules/auth/log-in/log-in.component';
import { NotFoundPageComponent } from '../../modules/error-pages/not-found-page/not-found-page.component';
import { OthersPageComponent } from '../../modules/others/others-page/others-page.component';
import { UsersPageComponent } from '../../modules/others/users-page/users-page.component';
import { PATHS } from '../constants/paths.constant';
import { SpecialtiesPageComponent } from '@app/modules/others/specialties-page/specialties-page.component';

const routes: Routes = [
  {
    path: PATHS.LOG_IN,
    component: LogInComponent,
    canActivate: [NotAuthGuard],
  },
  {
    path: PATHS.PAGE_NOT_FOUND,
    title: 'Página No Encontrada',
    component: NotFoundPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: PATHS.OTHERS.BASE,
    title: 'Otros',
    component: OthersPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: PATHS.OTHERS.USERS,
    title: 'Usuarios',
    component: UsersPageComponent,
    canActivate: [AuthGuard, AdministratorGuard],
  },
  {
    path: PATHS.OTHERS.SPECIALTIES,
    title: 'Especialidades',
    component: SpecialtiesPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: PATHS.PAGE_NOT_FOUND,
  },
];

/** @class Application Routing Module */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
