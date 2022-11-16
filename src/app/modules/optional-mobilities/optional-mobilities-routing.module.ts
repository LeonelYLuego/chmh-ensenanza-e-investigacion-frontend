import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PATHS } from '@core/constants';
import { AddOptionalMobilityComponent } from './add-optional-mobility';
import { OptionalMobilitiesPageComponent } from './optional-mobilities-page';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OptionalMobilitiesRoutingModule {}
