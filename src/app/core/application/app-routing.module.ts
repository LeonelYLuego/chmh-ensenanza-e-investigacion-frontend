import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministratorGuard } from '../guards/administrator.guard';
import { AuthGuard, NotAuthGuard } from '../guards/auth.guard';
import { LogInComponent } from '../../modules/auth/log-in/log-in.component';
import { NotFoundPageComponent } from '../../modules/error-pages/not-found-page/not-found-page.component';
import { OthersPageComponent } from '../../modules/others/pages/others-page/others-page.component';
import { UsersPageComponent } from '../../modules/others/pages/users-page/users-page.component';
import { PATHS } from '../constants/paths.constant';
import { SpecialtiesPageComponent } from '@app/modules/others/pages/specialties-page/specialties-page.component';
import { StudentsPageComponent } from '@app/modules/others/pages/students-page/students-page.component';
import { HospitalsPageComponent } from '@app/modules/others/pages/hospitals-page/hospitals-page.component';
import { SocialServicesPageComponent } from '@app/modules/social-services/social-services-page/social-services-page.component';
import { AddSocialServicesComponent } from '@app/modules/social-services/add-social-services/add-social-services.component';
import { SocialServiceStudentComponent } from '@app/modules/social-services/social-service-student/social-service-student.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: PATHS.SOCIAL_SERVICES.BASE,
    pathMatch: 'full',
  },
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
    path: PATHS.OTHERS.STUDENTS,
    title: 'Alumnos',
    component: StudentsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: PATHS.OTHERS.HOSPITALS,
    title: 'Hospitales',
    component: HospitalsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: PATHS.SOCIAL_SERVICES.BASE,
    title: 'Servicio Social',
    component: SocialServicesPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: PATHS.SOCIAL_SERVICES.ADD,
    title: 'Agregar Servicio Social',
    component: AddSocialServicesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: PATHS.SOCIAL_SERVICES.STUDENT,
    title: 'Servicio Social',
    component: SocialServiceStudentComponent,
    canActivate: [AuthGuard]
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
