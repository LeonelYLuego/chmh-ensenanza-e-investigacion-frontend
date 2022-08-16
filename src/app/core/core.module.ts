import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpPetitions } from './services/http-petitions.service';
import { generationService } from './services/generation.service';

/** @class Core Module */
@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [HttpPetitions, generationService]
})
export class CoreModule {}
