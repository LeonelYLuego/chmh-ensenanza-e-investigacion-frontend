import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentDialogComponent } from './student-dialog/student-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HospitalDialogComponent } from './hospital-dialog/hospital-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StudentInfoComponent } from './student-info/student-info.component';
import { MatCardModule } from '@angular/material/card';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { HospitalInfoComponent } from './hospital-info/hospital-info.component';
import { IncomingSpecialtyDialogComponent } from './incoming-specialty-dialog';

/** @class Shared Module */
@NgModule({
  declarations: [
    StudentDialogComponent,
    HospitalDialogComponent,
    StudentInfoComponent,
    DeleteDialogComponent,
    HospitalInfoComponent,
    IncomingSpecialtyDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
  ],
  exports: [StudentInfoComponent, HospitalInfoComponent],
})
export class SharedModule {}
