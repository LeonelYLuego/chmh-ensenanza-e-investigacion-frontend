import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SERVER_ENDPOINTS } from '@core/constants';
import { ForbiddenErrorInterface } from '@core/interfaces';
import { HttpPetitions } from '@core/services';
import {
  OptionalMobility,
  OptionalMobilityBySpecialtyDto,
} from '@data/interfaces';
import { OptionalMobilityDocumentTypes } from '@data/types/optional-mobility-document.type';

/** Optional Mobilities service */
@Injectable()
export class OptionalMobilitiesService {
  forbiddenErrors: ForbiddenErrorInterface[] = [
    {
      errorMessage: 'optional mobility not found',
      snackbarMessage: 'Movilidad Optativa no encontrada',
    },
    {
      errorMessage: 'optional mobility not modified',
      snackbarMessage: 'Movilidad Optativa no editada',
    },
    {
      errorMessage: 'optional mobility not deleted',
      snackbarMessage: 'Movilidad Optativa no eliminada',
    },
    {
      errorMessage: 'document not found',
      snackbarMessage: 'Documento no encontrado',
    },
    {
      errorMessage: 'file must be a pdf',
      snackbarMessage: 'El archivo debe ser un PDF',
    },
  ];

  constructor(private http: HttpPetitions) {}

  /**
   * Gets a Optional Mobility from the server by Id
   * @param _id Optional Mobility primary key
   * @returns The found Optional Mobility
   */
  async get(_id: string): Promise<OptionalMobility | null> {
    const data = await this.http.get<OptionalMobility>(
      SERVER_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID(_id),
      this.forbiddenErrors
    );
    return data ?? null;
  }

  /**
   * Gets all Optional Mobilities by Date from the server
   * @param initialDate
   * @param finalDate
   * @returns The found Optional Mobilities
   */
  async getAll(
    initialDate: Date,
    finalDate: Date
  ): Promise<OptionalMobilityBySpecialtyDto[]> {
    const data = await this.http.get<OptionalMobilityBySpecialtyDto[]>(
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

  /**
   * Adds a Optional Mobility in the server
   * @param optionalMobility
   * @returns The created Optional Mobility
   */
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

  /**
   * Updates a Optional Mobility in the server by Id
   * @param _id Optional Mobility primary key
   * @param optionalMobility
   * @returns The updated Optional Mobility
   */
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

  /**
   * Deletes a Optional Mobility in the server by Id
   * @param _id Optional Mobility primary key
   */
  async delete(_id: string): Promise<void> {
    await this.http.delete<void>(
      SERVER_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID(_id),
      this.forbiddenErrors
    );
  }

  /** Returns the last day of the specified month and year */
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

  /** Months as String */
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

  /**
   * Gets the intervals for search
   * @returns The intervals
   */
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

  /**
   * Gets a period as String
   * @param initialDate
   * @param finalDate
   * @returns The period as String
   */
  getPeriod(initialDate: Date, finalDate: Date): string {
    return `${initialDate.getDate()} de ${
      this.months[initialDate.getMonth()]
    } de ${initialDate.getFullYear()} - ${finalDate.getDate()} de ${
      this.months[finalDate.getMonth()]
    } de ${finalDate.getFullYear()}`;
  }

  /**
   * Gets a Document from the server by the Optional Mobility Id and document type
   * @param _id Optional Mobility primary key
   * @param type Document type
   * @returns The found document
   */
  async getDocument(
    _id: string,
    type: OptionalMobilityDocumentTypes
  ): Promise<SafeResourceUrl | null> {
    let data = await this.http.getFileUrl(
      SERVER_ENDPOINTS.OPTIONAL_MOBILITIES.BY_DOCUMENT_ID(_id),
      this.forbiddenErrors,
      [{ name: 'type', value: type }]
    );
    return data ?? null;
  }

  /**
   * Updates a Document in the server by the Optional Mobility Id and document type
   * @param _id Optional Mobility primary key
   * @param type Document type
   * @param formData Document
   * @returns The modified Optional Mobility
   */
  async updateDocument(
    _id: string,
    type: OptionalMobilityDocumentTypes,
    formData: FormData
  ): Promise<OptionalMobility | null> {
    let data = await this.http.put<OptionalMobility | null>(
      SERVER_ENDPOINTS.OPTIONAL_MOBILITIES.BY_DOCUMENT_ID(_id),
      formData,
      this.forbiddenErrors,
      [{ name: 'type', value: type }]
    );
    return data ?? null;
  }

  /**
   * Deletes a Document in the server by deh Optional Mobility Id and document type
   * @param _id Optional Mobility primary key
   * @param type Document type
   */
  async deleteDocument(
    _id: string,
    type: OptionalMobilityDocumentTypes
  ): Promise<void> {
    await this.http.delete<void>(
      SERVER_ENDPOINTS.OPTIONAL_MOBILITIES.BY_DOCUMENT_ID(_id),
      this.forbiddenErrors,
      [{ name: 'type', value: type }]
    );
  }
}
