import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  HospitalsService,
  IncomingStudentsService,
  ObligatoryMobilitiesService,
  OptionalMobilitiesService,
  RotationServicesService,
  SocialServicesService,
  SpecialtiesService,
  TemplatesService,
  UsersService,
} from './services';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    UsersService,
    SpecialtiesService,
    HospitalsService,
    SocialServicesService,
    TemplatesService,
    RotationServicesService,
    OptionalMobilitiesService,
    ObligatoryMobilitiesService,
    IncomingStudentsService,
  ],
})
export class DataModule {}
