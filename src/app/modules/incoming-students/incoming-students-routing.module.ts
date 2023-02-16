import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PATHS } from '@core/constants';
import { AddUpdateIncomingStudentComponent } from './add-update-incoming-student/add-update-incoming-student.component';
import { IncomingStudentStudentComponent } from './incoming-student-student/incoming-student-student.component';
import { IncomingStudentsGenerateDocumentsComponent } from './incoming-students-generate-documents/incoming-students-generate-documents.component';
import { IncomingStudentsPageComponent } from './incoming-students-page/incoming-students-page.component';

const routes: Routes = [
  {
    path: PATHS.INCOMING_STUDENTS.BASE,
    title: 'Rotantes',
    component: IncomingStudentsPageComponent,
  },
  {
    path: PATHS.INCOMING_STUDENTS.ADD,
    title: 'Agregar Rotante',
    component: AddUpdateIncomingStudentComponent,
  },
  {
    path: `${PATHS.INCOMING_STUDENTS.UPDATE}/${PATHS.INCOMING_STUDENTS.STUDENT}`,
    title: 'Editar Rotante',
    component: AddUpdateIncomingStudentComponent,
  },
  {
    path: PATHS.INCOMING_STUDENTS.DOCUMENTS,
    title: 'Generar Solicitudes para Rotantes',
    component: IncomingStudentsGenerateDocumentsComponent,
  },
  {
    path: PATHS.INCOMING_STUDENTS.STUDENT,
    title: 'Rotante',
    component: IncomingStudentStudentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncomingStudentsRoutingModule {}
