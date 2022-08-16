import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OthersPageComponent } from './others-page/others-page.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { UsersPageComponent } from './users-page/users-page.component';
import { MatTableModule } from '@angular/material/table';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SpecialtiesPageComponent } from './specialties-page/specialties-page.component';
import { SpecialtyDialogComponent } from './specialty-dialog/specialty-dialog.component';
import { StudentsPageComponent } from './students-page/students-page.component';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';

/** @class Others Module */
@NgModule({
  declarations: [OthersPageComponent, UsersPageComponent, UserDialogComponent, SpecialtiesPageComponent, SpecialtyDialogComponent, StudentsPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatProgressBarModule,
  ],
})
export class OthersModule {}
