import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpPetitions } from './services/http-petitions.service';

/** Core module */
@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [HttpPetitions]
})
export class CoreModule {}
