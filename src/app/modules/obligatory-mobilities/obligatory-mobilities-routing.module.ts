import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PATHS } from '@core/constants';
import { AddObligatoryMobilityComponent } from './add-obligatory-mobility/add-obligatory-mobility.component';
import { ObligatoryMobilitiesPageComponent } from './obligatory-mobilities-page/obligatory-mobilities-page.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObligatoryMobilitiesRoutingModule {}
