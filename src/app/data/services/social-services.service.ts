import { Injectable } from '@angular/core';
import { SERVER_ENDPOINTS } from '@app/core/constants/server-endpoints.constant';
import { ForbiddenErrorInterface } from '@app/core/interfaces/forbidden-error.interface';
import { NameValueInterface } from '@app/core/interfaces/name-value.interface';
import { HttpPetitions } from '@app/core/services/http-petitions.service';

@Injectable({
  providedIn: 'root',
})
export class SocialServicesService {
  err: any;
  forbiddenErrors: ForbiddenErrorInterface[] = [];

  constructor(private http: HttpPetitions) {}

  async getSocialServices() {}

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
        periods.push({
          name: `Marzo ${year} - Junio ${year}`,
          value: {
            year,
            period: 0,
          },
        });
        periods.push({
          name: `Julio ${year} - Octubre ${year}`,
          value: {
            year,
            period: 1,
          },
        });
        periods.push({
          name: `Noviembre ${year} - Febrero ${year + 1}`,
          value: {
            year,
            period: 2,
          },
        });
      }
    }
    return periods;
  }

  async addSocialService() {}

  async updateSocialService() {}

  async deleteSocialService() {}
}
