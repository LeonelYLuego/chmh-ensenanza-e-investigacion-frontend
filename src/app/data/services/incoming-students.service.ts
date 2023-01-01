import { Injectable } from '@angular/core';
import { SERVER_ENDPOINTS } from '@core/constants';
import { ForbiddenErrorInterface } from '@core/interfaces';
import { HttpPetitions } from '@core/services';
import { IncomingStudent } from '@data/interfaces/incoming-student';

@Injectable()
export class IncomingStudentsService {
  forbiddenErrors: ForbiddenErrorInterface[] = [];

  constructor(private http: HttpPetitions) {}

  async get(_id: string): Promise<IncomingStudent | null> {
    const data = await this.http.get<IncomingStudent>(
      SERVER_ENDPOINTS.INCOMING_STUDENTS.BY_ID(_id),
      this.forbiddenErrors
    );
    return data ?? null;
  }

  async getAll(initialDate: Date, finalDate: Date): Promise<IncomingStudent[]> {
    const data = await this.http.get<IncomingStudent[]>(
      SERVER_ENDPOINTS.INCOMING_STUDENTS.BASE_ENDPOINT,
      this.forbiddenErrors,
      [
        {
          name: 'initialDate',
          value: initialDate.toISOString(),
        },
        {
          name: 'finalDate',
          value: finalDate.toISOString(),
        },
      ]
    );
    return data ?? [];
  }

  async add(incomingStudent: IncomingStudent): Promise<IncomingStudent | null> {
    const data = await this.http.post<IncomingStudent>(
      SERVER_ENDPOINTS.INCOMING_STUDENTS.BASE_ENDPOINT,
      incomingStudent,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  async update(
    _id: string,
    incomingStudent: IncomingStudent
  ): Promise<IncomingStudent | null> {
    const data = await this.http.put<IncomingStudent>(
      SERVER_ENDPOINTS.INCOMING_STUDENTS.BY_ID(_id),
      incomingStudent,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  async delete(_id: string): Promise<void> {
    await this.http.delete<IncomingStudent>(
      SERVER_ENDPOINTS.INCOMING_STUDENTS.BY_ID(_id),
      this.forbiddenErrors
    );
  }
}
