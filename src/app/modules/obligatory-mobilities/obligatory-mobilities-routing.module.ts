import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PATHS } from '@core/constants';
import { AddAttachmentsObligatoryMobilityComponent } from './add-attachments-obligatory-mobility/add-attachments-obligatory-mobility.component';
import { AddObligatoryMobilityComponent } from './add-obligatory-mobility/add-obligatory-mobility.component';
import { AttachmentsObligatoryMobilitiesPageComponent } from './attachments-obligatory-mobilities-page/attachments-obligatory-mobilities-page.component';
import { AttachmentsObligatoryMobilityComponent } from './attachments-obligatory-mobility/attachments-obligatory-mobility.component';
import { ObligatoryMobilitiesPageComponent } from './obligatory-mobilities-page/obligatory-mobilities-page.component';
import { ObligatoryMobilityStudentComponent } from './obligatory-mobility-student/obligatory-mobility-student.component';

const routes: Routes = [
  {
    path: PATHS.OBLIGATORY_MOBILITIES.BASE,
    title: 'Movilidades Obligatorias',
    component: ObligatoryMobilitiesPageComponent,
  },
  {
    path: PATHS.OBLIGATORY_MOBILITIES.ADD,
    title: 'Agregar Movilidad Obligatoria',
    component: AddObligatoryMobilityComponent,
  },
  {
    path: PATHS.OBLIGATORY_MOBILITIES.ATTACHMENTS,
    title: 'Movilidades Obligatorias Solicitudes y Aceptaciones',
    component: AttachmentsObligatoryMobilitiesPageComponent,
  },
  {
    path: `${PATHS.OBLIGATORY_MOBILITIES.ATTACHMENTS}/${PATHS.OBLIGATORY_MOBILITIES.ADD}`,
    title: 'Agregar Solicitud y Aceptación',
    component: AddAttachmentsObligatoryMobilityComponent,
  },
  {
    path: `${PATHS.OBLIGATORY_MOBILITIES.ATTACHMENTS}/${PATHS.OBLIGATORY_MOBILITIES.STUDENT}`,
    title: 'Solicitud y Aceptación',
    component: AttachmentsObligatoryMobilityComponent,
  },
  {
    path: PATHS.OBLIGATORY_MOBILITIES.STUDENT,
    title: 'Movilidad Obligatoria',
    component: ObligatoryMobilityStudentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObligatoryMobilitiesRoutingModule {}
