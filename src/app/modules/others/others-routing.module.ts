import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PATHS } from '@core/constants';
import { AdministratorGuard } from '@core/guards';
import { HospitalsPageComponent } from './pages/hospitals-page';
import { OthersPageComponent } from './pages/others-page';
import { SpecialtiesPageComponent } from './pages/specialties-page';
import { StudentsPageComponent } from './pages/students-page';
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OthersRoutingModule {}
