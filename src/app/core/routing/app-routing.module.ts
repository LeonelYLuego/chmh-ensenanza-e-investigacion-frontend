import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, NotAuthGuard } from '../guards/auth.guard';
import { PATHS, RESOURCE_PATHS } from '../constants/paths.constant';

/** Routes */
const routes: Routes = [
  {
    path: '',
    redirectTo: `${PATHS.SOCIAL_SERVICES.BASE_PATH}`,
    pathMatch: 'full',
  },
  {
    path: RESOURCE_PATHS.AUTH,
    canActivate: [NotAuthGuard],
    loadChildren: () => import('@auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: RESOURCE_PATHS.ERROR,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('@error-pages/error-pages.module').then((m) => m.ErrorPagesModule),
  },
  {
    path: RESOURCE_PATHS.OTHERS,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('@others/others.module').then((m) => m.OthersModule),
  },
  {
    path: RESOURCE_PATHS.SOCIAL_SERVICES,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('@social-services/social-services.module').then(
        (m) => m.SocialServicesModule
      ),
  },
  {
    path: '**',
    redirectTo: `${PATHS.ERROR.BASE_PATH}/${PATHS.ERROR.PAGE_NOT_FOUND}`,
  },
];

/** Application Routing module */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
