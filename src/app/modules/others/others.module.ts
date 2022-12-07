import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OthersPageComponent } from './pages/others-page/others-page.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { MatTableModule } from '@angular/material/table';
import { UserDialogComponent } from './dialogs/user-dialog/user-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SpecialtiesPageComponent } from './pages/specialties-page/specialties-page.component';
import { SpecialtyDialogComponent } from './dialogs/specialty-dialog/specialty-dialog.component';
import { StudentsPageComponent } from './pages/students-page/students-page.component';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HospitalsPageComponent } from './pages/hospitals-page/hospitals-page.component';
import { OthersRoutingModule } from './others-routing.module';
import { TemplatesPageComponent } from './pages/templates-page/templates-page.component';
import { RotationServicesPageComponent } from './pages/rotation-services-page/rotation-services-page.component';
import { RotationServiceDialogComponent } from '../../shared/rotation-service-dialog/rotation-service-dialog.component';

/** @class Others Module */
@NgModule({
  declarations: [
    OthersPageComponent,
    UsersPageComponent,
    UserDialogComponent,
    SpecialtiesPageComponent,
    SpecialtyDialogComponent,
    StudentsPageComponent,
    HospitalsPageComponent,
    TemplatesPageComponent,
    RotationServicesPageComponent,
    RotationServiceDialogComponent,
  ],
  imports: [
    CommonModule,
    OthersRoutingModule,
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
