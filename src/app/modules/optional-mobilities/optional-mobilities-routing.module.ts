import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PATHS } from '@core/constants';
import { AddOptionalMobilityComponent } from './add-optional-mobility';
import { OptionalMobilitiesPageComponent } from './optional-mobilities-page';
import { OptionalMobilityStudentComponent } from './optional-mobility-student/optional-mobility-student.component';

const routes: Routes = [
  {
    path: PATHS.OPTIONAL_MOBILITIES.BASE,
    title: 'Movilidades Optativas',
    component: OptionalMobilitiesPageComponent,
  },
  {
    path: PATHS.OPTIONAL_MOBILITIES.ADD,
    title: 'Agregar Movilidad Optativa',
    component: AddOptionalMobilityComponent,
  },
  {
    path: PATHS.OPTIONAL_MOBILITIES.STUDENT,
    title: 'Movilidad Optativa',
    component: OptionalMobilityStudentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OptionalMobilitiesRoutingModule {}
