import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PATHS } from '@core/constants';
import { AddOptionalMobilityComponent } from './add-optional-mobility';
import { OptionalMobilitiesPageComponent } from './optional-mobilities-page';
import { OptionalMobilityGeneratePresentationOfficeDocumentsComponent } from './optional-mobility-generate-presentation-office-documents/optional-mobility-generate-presentation-office-documents.component';
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
  {
    path: PATHS.OPTIONAL_MOBILITIES.DOCUMENTS_PRESENTATION_OFFICE,
    title: 'Cartas de Presentación para Movilidades Optativas',
    component: OptionalMobilityGeneratePresentationOfficeDocumentsComponent,
  },
];

/** Optional Mobilities routing module */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OptionalMobilitiesRoutingModule {}
