import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PATHS } from '@core/constants';
import { AdministratorGuard } from '@core/guards';
import { HospitalsPageComponent } from './pages/hospitals-page';
import { OthersPageComponent } from './pages/others-page';
import { RotationServicesPageComponent } from './pages/rotation-services-page';
import { SpecialtiesPageComponent } from './pages/specialties-page';
import { StudentsPageComponent } from './pages/students-page';
import { TemplatesPageComponent } from './pages/templates-page';
import { UsersPageComponent } from './pages/users-page';

const routes: Routes = [
  {
    path: PATHS.OTHERS.BASE,
    title: 'Otros',
    component: OthersPageComponent,
  },
  {
    path: PATHS.OTHERS.USERS,
    title: 'Usuarios',
    component: UsersPageComponent,
    canActivate: [AdministratorGuard],
  },
  {
    path: PATHS.OTHERS.SPECIALTIES,
    title: 'Especialidades',
    component: SpecialtiesPageComponent,
  },
  {
    path: PATHS.OTHERS.STUDENTS,
    title: 'Alumnos',
    component: StudentsPageComponent,
  },
  {
    path: PATHS.OTHERS.HOSPITALS,
    title: 'Hospitales',
    component: HospitalsPageComponent,
  },
  {
    path: PATHS.OTHERS.TEMPLATES,
    title: 'Plantillas',
    component: TemplatesPageComponent,
  },
  {
    path: PATHS.OTHERS.ROTATION_SERVICES,
    title: 'Servicios a Rotar',
    component: RotationServicesPageComponent,
  },
  {
    path: PATHS.OTHERS.INCOMING_SPECIALTIES,
    title: 'Especialidades Externas',
    component: SpecialtiesPageComponent,
    data: { incoming: true },
  },
  {
    path: PATHS.OTHERS.INCOMING_ROTATION_SERVICES,
    title: 'Servicios a Rotar Externos',
    component: RotationServicesPageComponent,
    data: { incoming: true },
  },
];

/** Others routing module */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OthersRoutingModule {}
