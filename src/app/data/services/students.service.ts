import { Injectable } from '@angular/core';
import { SERVER_ENDPOINTS } from '@core/constants';
import { ForbiddenErrorInterface } from '@core/interfaces';
import { HttpPetitions } from '@core/services';
import { Student } from '../interfaces/student';

/** Students service */
@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  err: any;
  forbiddenErrors: ForbiddenErrorInterface[] = [
    {
      errorMessage: 'users specialty not found',
      snackbarMessage: 'Especialidad no encontrada',
    },
    {
      errorMessage: 'student not found',
      snackbarMessage: 'Alumno no encontrado',
    },
    {
      errorMessage: 'student not modified',
      snackbarMessage: 'Alumno no modificado',
    },
    {
      errorMessage: 'student not deleted',
      snackbarMessage: 'Alumno no eliminado',
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
  async getAll(
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
      SERVER_ENDPOINTS.STUDENTS.BASE_PATH,
      this.forbiddenErrors,
      params
    );
    return data ?? [];
  }

  async get(_id: string): Promise<Student | null> {
    const data = await this.http.get<Student>(
      SERVER_ENDPOINTS.STUDENTS.BY_ID(_id),
      this.forbiddenErrors
    );
    return data ?? null;
  }

  /**
   * Adds the Student in the server
   * @async
   * @param {Student} student
   * @returns {Promise<Student | null>} the added Student
   */
  async add(student: Student): Promise<Student | null> {
    let data = await this.http.post<Student>(
      SERVER_ENDPOINTS.STUDENTS.BASE_PATH,
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
  async update(_id: string, student: Student): Promise<Student | null> {
    let data = await this.http.put<Student>(
      SERVER_ENDPOINTS.STUDENTS.BY_ID(_id),
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
  async delete(_id: string): Promise<void> {
    await this.http.delete<Student>(
      SERVER_ENDPOINTS.STUDENTS.BY_ID(_id),
      this.forbiddenErrors
    );
  }
}
