import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { MatCardModule } from '@angular/material/card';
import { ErrorPagesRoutingModule } from './error-pages-routing.module';

/** Error Pages Module */
@NgModule({
  declarations: [NotFoundPageComponent],
  imports: [CommonModule, ErrorPagesRoutingModule, MatCardModule],
})
export class ErrorPagesModule {}
