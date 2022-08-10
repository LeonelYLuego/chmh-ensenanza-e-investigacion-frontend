import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from './services/users.service';
import { SpecialtiesService } from './services/specialties.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [UsersService, SpecialtiesService],
})
export class DataModule {}
