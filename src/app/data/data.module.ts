import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from './services/users.service';
import { SpecialtiesService } from './services/specialties.service';
import { HospitalsService } from './services/hospitals.service';
import { SocialServicesService } from './services/social-services.service';
import { TemplatesService } from './services/templates.service';
import { RotationServicesService } from './services';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    UsersService,
    SpecialtiesService,
    HospitalsService,
    SocialServicesService,
    TemplatesService,
    RotationServicesService
  ],
})
export class DataModule {}
