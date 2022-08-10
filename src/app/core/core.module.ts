import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpPetitions } from './services/http-petitions.service';

/** @class Core Module */
@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [HttpPetitions]
})
export class CoreModule {}
