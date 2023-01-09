import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PATHS } from '@core/constants';
import { AddIncomingStudentComponent } from './add-incoming-student/add-incoming-student.component';
import { IncomingStudentStudentComponent } from './incoming-student-student/incoming-student-student.component';
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
    component: AddIncomingStudentComponent,
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
