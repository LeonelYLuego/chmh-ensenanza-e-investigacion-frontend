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
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { AddObligatoryMobilityComponent } from './add-obligatory-mobility/add-obligatory-mobility.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ObligatoryMobilityStudentComponent } from './obligatory-mobility-student/obligatory-mobility-student.component';
import { SharedModule } from '@shared/shared.module';
import { AttachmentsObligatoryMobilitiesPageComponent } from './attachments-obligatory-mobilities-page/attachments-obligatory-mobilities-page.component';
import { AddAttachmentsObligatoryMobilityComponent } from './add-attachments-obligatory-mobility/add-attachments-obligatory-mobility.component';
import { AttachmentsObligatoryMobilityComponent } from './attachments-obligatory-mobility/attachments-obligatory-mobility.component';

@NgModule({
  declarations: [
    ObligatoryMobilitiesPageComponent,
    AddObligatoryMobilityComponent,
    ObligatoryMobilityStudentComponent,
    AttachmentsObligatoryMobilitiesPageComponent,
    AddAttachmentsObligatoryMobilityComponent,
    AttachmentsObligatoryMobilityComponent,
  ],
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
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatDatepickerModule,
    SharedModule,
  ],
})
export class ObligatoryMobilitiesModule {}
