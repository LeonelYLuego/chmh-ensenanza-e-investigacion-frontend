import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PATHS } from '@core/constants';
import { AddSocialServicesComponent } from './add-social-services';
import { SocialServiceGenerateDocumentsComponent } from './social-service-generate-documents';
import { SocialServiceStudentComponent } from './social-service-student';
import { SocialServicesPageComponent } from './social-services-page';

const routes: Routes = [
  {
    path: PATHS.SOCIAL_SERVICES.BASE,
    title: 'Servicio Social',
    component: SocialServicesPageComponent,
  },
  {
    path: PATHS.SOCIAL_SERVICES.ADD,
    title: 'Agregar Servicio Social',
    component: AddSocialServicesComponent,
  },
  {
    path: PATHS.SOCIAL_SERVICES.DOCUMENTS,
    title: 'Cartas de Presentación para Servicio Social',
    component: SocialServiceGenerateDocumentsComponent,
  },
  {
    path: PATHS.SOCIAL_SERVICES.STUDENT,
    title: 'Servicio Social',
    component: SocialServiceStudentComponent,
  },
];

/** Social Service routing module */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocialServiceRoutingModule {}
