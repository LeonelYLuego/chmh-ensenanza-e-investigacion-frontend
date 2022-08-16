import { Injectable } from '@angular/core';
import { SERVER_ENDPOINTS } from '@app/core/constants/server-endpoints.constant';
import { HttpPetitions } from '@app/core/services/http-petitions.service';
import { Student } from '../interfaces/student';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  err: any;
  forbiddenErrors = [
    {
      errorMessage: 'users specialty not found',
      snackbarMessage: 'Especialidad no encontrada',
    },
  ];

  constructor(private http: HttpPetitions) {}

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

  async addStudent(student: Student): Promise<Student | null> {
    let data = await this.http.post<Student>(
      SERVER_ENDPOINTS.STUDENTS,
      student,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  async updateStudent(_id: string, student: Student): Promise<Student | null> {
    let data = await this.http.put<Student>(
      `${SERVER_ENDPOINTS.STUDENTS}/${_id}`,
      student,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  async deleteStudent(_id: string): Promise<void> {
    await this.http.delete<Student>(
      `${SERVER_ENDPOINTS.STUDENTS}/${_id}`,
      this.forbiddenErrors
    );
  }
}
