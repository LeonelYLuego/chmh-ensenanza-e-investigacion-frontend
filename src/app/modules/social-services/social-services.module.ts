import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialServicesPageComponent } from './social-services-page/social-services-page.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AddSocialServicesComponent } from './add-social-services/add-social-services.component';
import { SocialServiceStudentComponent } from './social-service-student/social-service-student.component';
import { SocialServiceGenerateDocumentsComponent } from './social-service-generate-documents/social-service-generate-documents.component';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { SharedModule } from '@shared/shared.module';
import { SocialServiceRoutingModule } from './social-service-routing.module';

/** Social Service module */
@NgModule({
  declarations: [
    SocialServicesPageComponent,
    AddSocialServicesComponent,
    SocialServiceStudentComponent,
    SocialServiceGenerateDocumentsComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    SocialServiceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    MatDatepickerModule,
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
  ],
})
export class SocialServicesModule {}
