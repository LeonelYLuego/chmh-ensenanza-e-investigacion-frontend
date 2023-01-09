import { Injectable } from '@angular/core';
import { SERVER_ENDPOINTS } from '@core/constants';
import {
  lastDayOfTheMonth,
  monthToString,
} from '@core/functions/date.function';
import { ForbiddenErrorInterface } from '@core/interfaces';
import { HttpPetitions } from '@core/services';
import {
  IncomingStudent,
  IncomingStudentsInterval,
} from '@data/interfaces/incoming-student';

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

  async interval(): Promise<IncomingStudentsInterval> {
    let data = await this.http.get<{
      initialYear: number;
      finalYear: number;
    }>(SERVER_ENDPOINTS.INCOMING_STUDENTS.INTERVAL, this.forbiddenErrors);
    const initialMonths: { name: string; value: Date }[] = [];
    const finalMonths: { name: string; value: Date }[] = [];
    if (data) {
      for (let year = data.initialYear; year <= data.finalYear; year++) {
        for (let month = 0; month < 12; month++) {
          initialMonths.push({
            name: `1 de ${monthToString(month)} de ${year}`,
            value: new Date(year, month, 1),
          });
          finalMonths.push({
            name: `${lastDayOfTheMonth(year, month)} de ${monthToString(
              month
            )} de ${year}`,
            value: new Date(year, month + 1, 0),
          });
        }
      }
    }
    return { initialMonths, finalMonths };
  }

  getPeriod(initialDate: Date, finalDate: Date): string {
    let initialMonthString = monthToString(initialDate.getMonth());
    initialMonthString =
      initialMonthString.charAt(0).toUpperCase() + initialMonthString.slice(1);
    let finalMonthString = monthToString(finalDate.getMonth());
    finalMonthString =
      finalMonthString.charAt(0).toUpperCase() + finalMonthString.slice(1);
    return `${initialMonthString} de ${initialDate.getFullYear()} - ${finalMonthString} de ${finalDate.getFullYear()}`;
  }
}