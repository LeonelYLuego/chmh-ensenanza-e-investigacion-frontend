import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SERVER_ENDPOINTS, SERVER_RESOURCES } from '@core/constants';
import { ForbiddenErrorInterface, NameValueInterface } from '@core/interfaces';
import { HttpPetitions } from '@core/services';
import { SocialServiceDocumentTypes } from '@data/types/social-service-document.type';
import {
  SocialService,
  SocialServiceBySpecialty,
} from '../interfaces/social-service';

/** Social Services service */
@Injectable({
  providedIn: 'root',
})
export class SocialServicesService {
  err: any;
  forbiddenErrors: ForbiddenErrorInterface[] = [
    {
      errorMessage: 'social service not updated',
      snackbarMessage: 'Servicio Social no editado',
    },
    {
      errorMessage: 'invalid period',
      snackbarMessage: 'Period no válido',
    },
    {
      errorMessage: 'social service not found',
      snackbarMessage: 'Servicio Social no encontrado',
    },
    {
      errorMessage: 'social service not deleted',
      snackbarMessage: 'Servicio Social no eliminado',
    },
    {
      errorMessage: 'document not found',
      snackbarMessage: 'Document no encontrado',
    },
    {
      errorMessage: 'file must be a pdf',
      snackbarMessage: 'El archivo debe ser un PDF',
    },
    {
      errorMessage: 'not template found',
      snackbarMessage: 'No se encontró la plantilla',
    },
  ];

  constructor(private http: HttpPetitions) {}

  /**
   * Gets a single Social Service from the server
   * @param _id Social Service primary key
   * @returns the found Social Service
   */
  async get(_id: string): Promise<SocialService | null> {
    const data = await this.http.get<SocialService | null>(
      SERVER_ENDPOINTS.SOCIAL_SERVICES.BY_ID(_id),
      this.forbiddenErrors
    );
    return data ?? null;
  }

  /**
   * Gets all Social Services from the server in the specified period
   * @param initialYear
   * @param initialPeriod
   * @param finalYear
   * @param finalPeriod
   * @returns the found Social Services
   */
  async getAll(
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
      SERVER_ENDPOINTS.SOCIAL_SERVICES.BASE_ENDPOINT,
      this.forbiddenErrors,
      params
    );
    return data ?? [];
  }

  /**
   * Gets the first and last registered period years
   * @returns
   */
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

  /**
   * Gets initial and final periods as `{initial: {name: 'Marzo 2020', value: {year: 2020, period: 1}}, final: {name: 'Junio 2020', value: {year: 2020, period: 1}}}`
   * @returns
   */
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

  /**
   * Gets a single periods without year as `{name: 'Julio - Octubre', value: 1}`
   * @returns
   */
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

  /**
   * Gets a period as string as `Marzo 2020 - Junio 2020`
   * @param period
   * @param year
   * @returns
   */
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

  /**
   * Gets initial period as string as `Marzo 2020`
   * @param period
   * @param year
   * @returns
   */
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

  /**
   * Gets final period as string as `Junio 2020`
   * @param period
   * @param year
   * @returns
   */
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

  /**
   * Adds a Social Service to the server
   * @param socialService
   * @returns the added Social Service
   */
  async add(socialService: SocialService): Promise<SocialService | null> {
    let data = await this.http.post<SocialService>(
      SERVER_ENDPOINTS.SOCIAL_SERVICES.BASE_ENDPOINT,
      socialService,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  /**
   * Upates a Social Service in the server
   * @param _id Social Service primary key
   * @param socialService
   * @returns the updated Social Service
   */
  async update(
    _id: string,
    socialService: SocialService
  ): Promise<SocialService | null> {
    let data = await this.http.put<SocialService | null>(
      SERVER_ENDPOINTS.SOCIAL_SERVICES.BY_ID(_id),
      socialService,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  /**
   * Deletes a Social Service in the server
   * @param _id Social Service primary key
   */
  async delete(_id: string): Promise<void> {
    await this.http.delete<void>(
      SERVER_ENDPOINTS.SOCIAL_SERVICES.BY_ID(_id),
      this.forbiddenErrors
    );
  }

  /**
   * Gets a Social Service document from the server
   * @param _id Social Service primary key
   * @param type document type
   * @returns the found document as blob url
   */
  async getDocument(
    _id: string,
    type: SocialServiceDocumentTypes
  ): Promise<SafeResourceUrl | null> {
    let data = await this.http.getFileUrl(
      SERVER_ENDPOINTS.SOCIAL_SERVICES.BY_DOCUMENT_ID(_id),
      this.forbiddenErrors,
      [{ name: 'type', value: type }]
    );
    return data ?? null;
  }

  /**
   * Updates a Social Service document in the server
   * @param _id Social Service primary key
   * @param type document type
   * @param formData the document
   * @returns the Social Service updated
   */
  async updateDocument(
    _id: string,
    type: SocialServiceDocumentTypes,
    formData: FormData
  ): Promise<SocialService | null> {
    let data = await this.http.put<SocialService | null>(
      SERVER_ENDPOINTS.SOCIAL_SERVICES.BY_DOCUMENT_ID(_id),
      formData,
      this.forbiddenErrors,
      [{ name: 'type', value: type }]
    );
    return data ?? null;
  }

  /**
   * Deletes a Social Service document in ther server
   * @param _id Social Service primary key
   * @param type document type
   */
  async deleteDocument(
    _id: string,
    type: SocialServiceDocumentTypes
  ): Promise<void> {
    await this.http.delete<void>(
      SERVER_ENDPOINTS.SOCIAL_SERVICES.BY_DOCUMENT_ID(_id),
      this.forbiddenErrors,
      [{ name: 'type', value: type }]
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
        value: dateOfDocuments.toISOString(),
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
}
