import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PATHS } from '@core/constants';
import { ObligatoryMobilitiesPageComponent } from './obligatory-mobilities-page/obligatory-mobilities-page.component';

const routes: Routes = [
  {
    path: PATHS.OBLIGATORY_MOBILITIES.BASE,
    title: 'Movilidades Obligatorias',
    component: ObligatoryMobilitiesPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObligatoryMobilitiesRoutingModule {}
