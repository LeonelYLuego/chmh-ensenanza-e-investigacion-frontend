import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PATHS } from '@core/constants';
import { NotFoundPageComponent } from './not-found-page';

const routes: Routes = [
  {
    path: PATHS.ERROR.PAGE_NOT_FOUND,
    title: 'Página No Encontrada',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorPagesRoutingModule {}
