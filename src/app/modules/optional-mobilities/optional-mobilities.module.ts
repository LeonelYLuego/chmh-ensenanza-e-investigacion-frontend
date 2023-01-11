import { NgModule } from '@angular/core';
import { OptionalMobilitiesRoutingModule } from './optional-mobilities-routing.module';
import { OptionalMobilitiesPageComponent } from './optional-mobilities-page/optional-mobilities-page.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AddOptionalMobilityComponent } from './add-optional-mobility/add-optional-mobility.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { OptionalMobilityStudentComponent } from './optional-mobility-student/optional-mobility-student.component';
import { SharedModule } from '@shared/shared.module';
import { OptionalMobilityGeneratePresentationOfficeDocumentsComponent } from './optional-mobility-generate-presentation-office-documents/optional-mobility-generate-presentation-office-documents.component';

/** Optional Mobilities module */
@NgModule({
  declarations: [
    OptionalMobilitiesPageComponent,
    AddOptionalMobilityComponent,
    OptionalMobilityStudentComponent,
    OptionalMobilityGeneratePresentationOfficeDocumentsComponent,
  ],
  imports: [
    CommonModule,
    OptionalMobilitiesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatProgressBarModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    SharedModule,
  ],
})
export class OptionalMobilitiesModule {}
