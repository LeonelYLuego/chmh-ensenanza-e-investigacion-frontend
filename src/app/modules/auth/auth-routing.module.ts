import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PATHS } from '@core/constants';
import { AuthGuard } from '@core/guards';
import { LogInComponent } from './log-in';

const routes: Routes = [
  {
    path: '',
    redirectTo: `/${PATHS.AUTH.BASE_PATH}/${PATHS.AUTH.LOG_IN}`,
    pathMatch: 'full',
  },
  {
    path: PATHS.AUTH.LOG_IN,
    component: LogInComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
