import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SERVER_ENDPOINTS, SERVER_RESOURCES } from '@core/constants';
import { ForbiddenErrorInterface, NameValueInterface } from '@core/interfaces';
import { HttpPetitions } from '@core/services';
import {
  SocialService,
  SocialServiceBySpecialty,
} from '../interfaces/social-service';

@Injectable({
  providedIn: 'root',
})
export class SocialServicesService {
  err: any;
  forbiddenErrors: ForbiddenErrorInterface[] = [
    {
      errorMessage: 'social service not updated',
      snackbarMessage: 'Servicio social no editado',
    },
  ];

  constructor(private http: HttpPetitions) {}

  async getSocialService(_id: string): Promise<SocialService | null> {
    const data = await this.http.get<SocialService | null>(
      SERVER_RESOURCES.SOCIAL_SERVICES + `/${_id}`,
      this.forbiddenErrors
    );
    return data ?? null;
  }

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

  async getInitialFinalPeriods(): Promise<
    {
      initial: NameValueInterface<{ year: number; period: number }>;
      final: NameValueInterface<{ year: number; period: number }>;
    }[]
  > {
    const periods: {
      initial: NameValueInterface<{ year: number; period: number }>;
      final: NameValueInterface<{ year: number; period: number }>;
    }[] = [];
    let data = await this.http.get<{
      initialYear: number;
      finalYear: number;
    } | null>(SERVER_ENDPOINTS.SOCIAL_SERVICES.PERIODS, this.forbiddenErrors);
    if (data) {
      for (let year = data.initialYear; year <= data.finalYear; year++) {
        for (let p = 0; p < 3; p++) {
          periods.push({
            initial: {
              name: this.getInitialPeriod(p, year),
              value: {
                year,
                period: p,
              },
            },
            final: {
              name: this.getFinalPeriod(p, year),
              value: {
                year,
                period: p,
              },
            },
          });
        }
      }
    }
    return periods;
  }

  getSinglePeriods(): NameValueInterface<number>[] {
    const singlePeriods: NameValueInterface<number>[] = [];
    singlePeriods.push({
      name: 'Marzo - Junio',
      value: 0,
    });
    singlePeriods.push({
      name: 'Julio - Octubre',
      value: 1,
    });
    singlePeriods.push({
      name: 'Noviembre - Febrero',
      value: 2,
    });
    return singlePeriods;
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

  getInitialPeriod(period: number, year: number): string {
    switch (period) {
      case 0:
        return `Marzo ${year}`;
      case 1:
        return `Julio ${year}`;
      case 2:
        return `Noviembre ${year}`;
      default:
        return '';
    }
  }

  getFinalPeriod(period: number, year: number): string {
    switch (period) {
      case 0:
        return `Junio ${year}`;
      case 1:
        return `Octubre ${year}`;
      case 2:
        return `Febrero ${year + 1}`;
      default:
        return '';
    }
  }

  async addSocialService(
    socialService: SocialService
  ): Promise<SocialService | null> {
    let data = await this.http.post<SocialService>(
      SERVER_RESOURCES.SOCIAL_SERVICES,
      socialService,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  async updateSocialService(
    _id: string,
    socialService: SocialService
  ): Promise<SocialService | null> {
    let data = await this.http.put<SocialService | null>(
      SERVER_RESOURCES.SOCIAL_SERVICES + `/${_id}`,
      socialService,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  async deleteSocialService(_id: string): Promise<void> {
    await this.http.delete<void>(
      SERVER_RESOURCES.SOCIAL_SERVICES + `/${_id}`,
      this.forbiddenErrors
    );
  }

  async generateDocuments(
    initialNumberOfDocuments: number,
    dateOfDocuments: Date,
    initialPeriod: number,
    initialYear: number,
    finalPeriod: number,
    finalYear: number,
    hospital?: string,
    specialty?: string
  ): Promise<null | Blob> {
    const params: { name: string; value: string }[] = [
      {
        name: 'initialNumberOfDocuments',
        value: initialNumberOfDocuments.toString(),
      },
      {
        name: 'dateOfDocuments',
        value: `${
          dateOfDocuments.getMonth() + 1
        }/${dateOfDocuments.getDate()}/${dateOfDocuments.getFullYear()}`,
      },
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

    if (hospital)
      params.push({
        name: 'hospital',
        value: hospital,
      });
    if (specialty)
      params.push({
        name: 'specialty',
        value: specialty,
      });

    let data = await this.http.getBlob(
      SERVER_ENDPOINTS.SOCIAL_SERVICES.GENERATE,
      this.forbiddenErrors,
      params
    );

    return data ?? null;
  }

  async getDocument(
    _id: string,
    type: 'presentationOfficeDocument' | 'reportDocument' | 'constancyDocument'
  ): Promise<SafeResourceUrl | null> {
    let data = await this.http.getFileUrl(
      SERVER_ENDPOINTS.SOCIAL_SERVICES.DOCUMENT + `/${_id}`,
      this.forbiddenErrors,
      [{ name: 'type', value: type }]
    );
    return data ?? null;
  }

  async updateDocument(
    _id: string,
    type: 'presentationOfficeDocument' | 'reportDocument' | 'constancyDocument',
    formData: FormData
  ): Promise<SocialService | null> {
    let data = await this.http.put<SocialService | null>(
      SERVER_ENDPOINTS.SOCIAL_SERVICES.DOCUMENT + `/${_id}`,
      formData,
      this.forbiddenErrors,
      [{ name: 'type', value: type }]
    );
    return data ?? null;
  }

  async deleteDocument(
    _id: string,
    type: 'presentationOfficeDocument' | 'reportDocument' | 'constancyDocument'
  ): Promise<void> {
    await this.http.delete<void>(
      SERVER_ENDPOINTS.SOCIAL_SERVICES.DOCUMENT + `/${_id}`,
      this.forbiddenErrors,
      [{ name: 'type', value: type }]
    );
  }
}
