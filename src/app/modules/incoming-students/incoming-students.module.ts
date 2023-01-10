import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomingStudentsPageComponent } from './incoming-students-page/incoming-students-page.component';
import { IncomingStudentsRoutingModule } from './incoming-students-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { IncomingStudentStudentComponent } from './incoming-student-student/incoming-student-student.component';
import { SharedModule } from '@shared/shared.module';
import { IncomingStudentInfoComponent } from './incoming-student-info/incoming-student-info.component';
import { AddUpdateIncomingStudentComponent } from './add-update-incoming-student/add-update-incoming-student.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    IncomingStudentsPageComponent,
    IncomingStudentStudentComponent,
    IncomingStudentInfoComponent,
    AddUpdateIncomingStudentComponent,
  ],
  imports: [
    CommonModule,
    IncomingStudentsRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatTableModule,
    MatChipsModule,
    MatCheckboxModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class IncomingStudentsModule {}
