import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObligatoryMobilitiesPageComponent } from './obligatory-mobilities-page/obligatory-mobilities-page.component';
import { ObligatoryMobilitiesRoutingModule } from './obligatory-mobilities-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [ObligatoryMobilitiesPageComponent],
  imports: [
    CommonModule,
    ObligatoryMobilitiesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressBarModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
  ],
})
export class ObligatoryMobilitiesModule {}
