import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { MatCardModule } from '@angular/material/card';

/** Error Pages Module */
@NgModule({
  declarations: [NotFoundPageComponent],
  imports: [CommonModule, MatCardModule],
})
export class ErrorPagesModule {}
