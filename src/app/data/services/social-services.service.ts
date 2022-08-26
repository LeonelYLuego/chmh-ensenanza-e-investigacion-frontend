import { Injectable } from '@angular/core';
import {
  SERVER_ENDPOINTS,
  SERVER_RESOURCES,
} from '@app/core/constants/server-endpoints.constant';
import { ForbiddenErrorInterface } from '@app/core/interfaces/forbidden-error.interface';
import { NameValueInterface } from '@app/core/interfaces/name-value.interface';
import { HttpPetitions } from '@app/core/services/http-petitions.service';
import {
  SocialService,
  SocialServiceBySpecialty,
} from '../interfaces/social-service';

@Injectable({
  providedIn: 'root',
})
export class SocialServicesService {
  err: any;
  forbiddenErrors: ForbiddenErrorInterface[] = [];

  constructor(private http: HttpPetitions) {}

  async getSocialServices(
    initialYear: number,
    initialPeriod: number,
    finalYear: number,
    finalPeriod: number
  ): Promise<SocialServiceBySpecialty[]> {
    const params: NameValueInterface<string>[] = [
      {
        name: 'initialPeriod',
        value: initialPeriod.toString(),
      },
      {
        name: 'initialYear',
        value: initialYear.toString(),
      },
      {
        name: 'finalPeriod',
        value: finalPeriod.toString(),
      },
      {
        name: 'finalYear',
        value: finalYear.toString(),
      },
    ];
    let data = await this.http.get<SocialServiceBySpecialty[] | null>(
      SERVER_RESOURCES.SOCIAL_SERVICES,
      this.forbiddenErrors,
      params
    );
    return data ?? [];
  }

  async getPeriods(): Promise<
    NameValueInterface<{ year: number; period: number }>[]
  > {
    const periods: NameValueInterface<{ year: number; period: number }>[] = [];
    let data = await this.http.get<{
      initialYear: number;
      finalYear: number;
    } | null>(SERVER_ENDPOINTS.SOCIAL_SERVICES.PERIODS, this.forbiddenErrors);
    if (data) {
      for (let year = data.initialYear; year <= data.finalYear; year++) {
        for (let p = 0; p < 3; p++) {
          periods.push({
            name: this.getPeriod(p, year),
            value: {
              year,
              period: p,
            },
          });
        }
      }
    }
    return periods;
  }

  getPeriod(period: number, year: number): string {
    switch (period) {
      case 0:
        return `Marzo ${year} - Junio ${year}`;
      case 1:
        return `Julio ${year} - Octubre ${year}`;
      case 2:
        return `Noviembre ${year} - Febrero ${year + 1}`;
      default:
        return '';
    }
  }

  async addSocialService() {}

  async updateSocialService() {}

  async deleteSocialService() {}
}
