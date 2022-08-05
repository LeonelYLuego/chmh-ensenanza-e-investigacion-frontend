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

/** @class Others Module */
@NgModule({
  declarations: [OthersPageComponent, UsersPageComponent, UserDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
  ],
})
export class OthersModule {}
