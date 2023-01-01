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
import { AddIncomingStudentComponent } from './add-incoming-student/add-incoming-student.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [IncomingStudentsPageComponent, AddIncomingStudentComponent],
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
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class IncomingStudentsModule {}
