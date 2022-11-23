import { Injectable } from '@angular/core';
import { SERVER_ENDPOINTS } from '@core/constants';
import { ForbiddenErrorInterface } from '@core/interfaces';
import { HttpPetitions } from '@core/services';
import { OptionalMobility } from '@data/interfaces';

@Injectable()
export class OptionalMobilitiesService {
  err: any;
  forbiddenErrors: ForbiddenErrorInterface[] = [];

  constructor(private http: HttpPetitions) {}

  async get(_id: string): Promise<OptionalMobility | null> {
    const data = await this.http.get<OptionalMobility>(
      SERVER_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID(_id),
      this.forbiddenErrors
    );
    return data ?? null;
  }

  async getAll(
    initialDate: Date,
    finalDate: Date
  ): Promise<OptionalMobility[]> {
    const data = await this.http.get<OptionalMobility[]>(
      SERVER_ENDPOINTS.OPTIONAL_MOBILITIES.BASE_ENDPOINT,
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

  async add(
    optionalMobility: OptionalMobility
  ): Promise<OptionalMobility | null> {
    const data = await this.http.post<OptionalMobility>(
      SERVER_ENDPOINTS.OPTIONAL_MOBILITIES.BASE_ENDPOINT,
      optionalMobility,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  async update(
    _id: string,
    optionalMobility: OptionalMobility
  ): Promise<OptionalMobility | null> {
    let data = await this.http.put<OptionalMobility>(
      SERVER_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID(_id),
      optionalMobility,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  async delete(_id: string): Promise<void> {
    await this.http.delete<void>(
      SERVER_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID(_id),
      this.forbiddenErrors
    );
  }

  lastDayOfTheMonth(year: number, month: number): number {
    switch (month + 1) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        return 31;
      case 4:
      case 6:
      case 9:
      case 11:
        return 30;
      case 2:
        return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0 ? 29 : 28;
      default:
        return NaN;
    }
  }

  readonly months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  async interval(): Promise<{
    initialMonths: { name: string; value: Date }[];
    finalMonths: { name: string; value: Date }[];
  }> {
    let data = await this.http.get<{ initialYear: number; finalYear: number }>(
      SERVER_ENDPOINTS.OPTIONAL_MOBILITIES.INTERVAL,
      this.forbiddenErrors
    );
    const initialMonths: { name: string; value: Date }[] = [];
    const finalMonths: { name: string; value: Date }[] = [];
    if (data) {
      for (let year = data.initialYear; year <= data.finalYear; year++) {
        for (let month = 0; month < 12; month++) {
          initialMonths.push({
            name: `1 de ${this.months[month]} de ${year}`,
            value: new Date(year, month, 1),
          });
          finalMonths.push({
            name: `${this.lastDayOfTheMonth(year, month)} de ${
              this.months[month]
            } de ${year}`,
            value: new Date(year, month + 1, 0),
          });
        }
      }
    }
    return { initialMonths, finalMonths };
  }
}
