import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from './services/users.service';
import { SpecialtiesService } from './services/specialties.service';
import { HospitalsService } from './services/hospitals.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [UsersService, SpecialtiesService, HospitalsService],
})
export class DataModule {}
