import { Injectable } from '@angular/core';
import { SERVER_ENDPOINTS } from '@core/constants';
import {
  lastDayOfTheMonth,
  monthToString,
} from '@core/functions/date.function';
import { ForbiddenErrorInterface } from '@core/interfaces';
import { HttpPetitions } from '@core/services';
import {
  ObligatoryMobility,
  ObligatoryMobilityByHospital,
  ObligatoryMobilityByStudent,
  ObligatoryMobilityInterval,
} from '@data/interfaces';

@Injectable()
export class ObligatoryMobilitiesService {
  forbiddenErrors: ForbiddenErrorInterface[] = [
    {
      errorMessage: 'obligatory mobility interval not found',
      snackbarMessage: 'Intervalo de Movilidades Obligatorias no encontrado',
    },
  ];

  constructor(private http: HttpPetitions) {}

  async get(_id: string): Promise<ObligatoryMobility | null> {
    const data = await this.http.get<ObligatoryMobility>(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID(_id),
      this.forbiddenErrors
    );
    return data ?? null;
  }

  async getAllByHospital(
    specialty: string,
    initialDate: Date,
    finalDate: Date
  ): Promise<ObligatoryMobilityByHospital[]> {
    const data = await this.http.get<ObligatoryMobilityByHospital[]>(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_HOSPITAL,
      this.forbiddenErrors,
      [
        {
          name: 'specialty',
          value: specialty,
        },
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

  async getAllByStudent(
    specialty: string,
    initialDate: Date,
    finalDate: Date
  ): Promise<ObligatoryMobilityByStudent[]> {
    const data = await this.http.get<ObligatoryMobilityByStudent[]>(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_STUDENT,
      this.forbiddenErrors,
      [
        {
          name: 'specialty',
          value: specialty,
        },
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
    obligatoryMobility: ObligatoryMobility
  ): Promise<ObligatoryMobility | null> {
    const data = await this.http.post<ObligatoryMobility>(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.BASE_ENDPOINT,
      obligatoryMobility,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  async update(
    _id: string,
    obligatoryMobility: ObligatoryMobility
  ): Promise<ObligatoryMobility | null> {
    let data = await this.http.put<ObligatoryMobility>(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID(_id),
      obligatoryMobility,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  async delete(_id: string): Promise<void> {
    await this.http.delete(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID(_id),
      this.forbiddenErrors
    );
  }

  async interval(): Promise<ObligatoryMobilityInterval> {
    let data = await this.http.get<{
      initialYear: number;
      finalYear: number;
    }>(SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.INTERVAL, this.forbiddenErrors);
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

  getPeriod(date: Date): string {
    let monthString = monthToString(date.getMonth());
    monthString = monthString.charAt(0).toUpperCase() + monthString.slice(1);
    return `${monthString} de ${date.getFullYear()}`;
  }
}
