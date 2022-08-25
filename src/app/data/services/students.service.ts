import { Injectable } from '@angular/core';
import { SERVER_ENDPOINTS } from '@app/core/constants/server-endpoints.constant';
import { ForbiddenErrorInterface } from '@app/core/interfaces/forbidden-error.interface';
import { HttpPetitions } from '@app/core/services/http-petitions.service';
import { Student } from '../interfaces/student';

@Injectable({
  providedIn: 'root',
})
/** @class Students Service */
export class StudentsService {
  err: any;
  forbiddenErrors: ForbiddenErrorInterface[] = [
    {
      errorMessage: 'users specialty not found',
      snackbarMessage: 'Especialidad no encontrada',
    },
    {
      errorMessage: 'student not found',
      snackbarMessage: 'Estudiante no encontrado',
    },
    {
      errorMessage: 'student not modified',
      snackbarMessage: 'Estudiante no modificado',
    },
    {
      errorMessage: 'student not deleted',
      snackbarMessage: 'Estudiante no eliminado',
    },
  ];

  constructor(private http: HttpPetitions) {}

  /**
   * Gets all students from the server bases on the specialty and generation
   * @async
   * @param {string} specialtyId _id of the Specialty
   * @param {number} lastYearGeneration
   * @returns {Promise<Student[]>} the found Students
   */
  async getStudents(
    specialtyId: string,
    lastYearGeneration: number
  ): Promise<Student[]> {
    let params: { name: string; value: string }[] | undefined = undefined;
    if (specialtyId)
      params = [
        { name: 'specialty', value: specialtyId },
        { name: 'lastYearGeneration', value: lastYearGeneration.toString() },
      ];
    let data = await this.http.get<Student[]>(
      SERVER_ENDPOINTS.STUDENTS,
      this.forbiddenErrors,
      params
    );
    return data ?? [];
  }

  /**
   * Adds the Student in the server
   * @async
   * @param {Student} student
   * @returns {Promise<Student | null>} the added Student
   */
  async addStudent(student: Student): Promise<Student | null> {
    let data = await this.http.post<Student>(
      SERVER_ENDPOINTS.STUDENTS,
      student,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  /**
   * Updates the specified Student in the server
   * @param {string} _id _id of the Student
   * @param {Student} student
   * @returns {Promise<Student | null>} the updated Student
   */
  async updateStudent(_id: string, student: Student): Promise<Student | null> {
    let data = await this.http.put<Student>(
      `${SERVER_ENDPOINTS.STUDENTS}/${_id}`,
      student,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  /**
   * Delete the specified Student in the server
   * @async
   * @param _id _id of the Student
   */
  async deleteStudent(_id: string): Promise<void> {
    await this.http.delete<Student>(
      `${SERVER_ENDPOINTS.STUDENTS}/${_id}`,
      this.forbiddenErrors
    );
  }
}
