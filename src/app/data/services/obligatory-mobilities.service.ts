import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SERVER_ENDPOINTS } from '@core/constants';
import {
  lastDayOfTheMonth,
  monthToString,
} from '@core/functions/date.function';
import { ForbiddenErrorInterface } from '@core/interfaces';
import { HttpPetitions } from '@core/services';
import {
  AttachmentsObligatoryMobility,
  AttachmentsObligatoryMobilityByHospital,
  AttachmentsObligatoryMobilityResponse,
  ObligatoryMobility,
  ObligatoryMobilityByHospital,
  ObligatoryMobilityByStudent,
  ObligatoryMobilityInterval,
  ObligatoryMobilityResponse,
} from '@data/interfaces';
import {
  AttachmentsObligatoryMobilityDocumentTypes,
  ObligatoryMobilityDocumentTypes,
} from '@data/types/obligatory-mobility-document.type';

@Injectable()
export class ObligatoryMobilitiesService {
  forbiddenErrors: ForbiddenErrorInterface[] = [
    {
      errorMessage: 'obligatory mobility interval not found',
      snackbarMessage: 'Intervalo de Movilidades Obligatorias no encontrado',
    },
  ];

  constructor(private http: HttpPetitions) {}

  async get(_id: string): Promise<ObligatoryMobilityResponse | null> {
    const data = await this.http.get<ObligatoryMobilityResponse>(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID(_id),
      this.forbiddenErrors
    );
    return data ?? null;
  }

  async getAll(
    specialty: string,
    hospital: string,
    initialDate: Date,
    finalDate: Date
  ): Promise<ObligatoryMobility[]> {
    const data = await this.http.get<ObligatoryMobility[]>(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.BASE_ENDPOINT,
      this.forbiddenErrors,
      [
        { name: 'specialty', value: specialty },
        { name: 'hospital', value: hospital },
        { name: 'initialDate', value: initialDate.toISOString() },
        { name: 'finalDate', value: finalDate.toISOString() },
      ]
    );

    return data ?? [];
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
        { name: 'specialty', value: specialty },
        { name: 'initialDate', value: initialDate.toISOString() },
        { name: 'finalDate', value: finalDate.toISOString() },
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
        { name: 'specialty', value: specialty },
        { name: 'initialDate', value: initialDate.toISOString() },
        { name: 'finalDate', value: finalDate.toISOString() },
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

  async cancel(_id: string): Promise<ObligatoryMobility | null> {
    const data = await this.http.put<ObligatoryMobility>(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.CANCEL_ID(_id),
      this.forbiddenErrors
    );
    return data ?? null;
  }

  async uncancel(_id: string): Promise<ObligatoryMobility | null> {
    const data = await this.http.put<ObligatoryMobility>(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.UNCANCEL_ID(_id),
      this.forbiddenErrors
    );
    return data ?? null;
  }

  getPeriod(date: Date): string {
    let monthString = monthToString(date.getMonth());
    monthString = monthString.charAt(0).toUpperCase() + monthString.slice(1);
    return `${monthString} de ${date.getFullYear()}`;
  }

  async getDocument(
    _id: string,
    type: ObligatoryMobilityDocumentTypes
  ): Promise<SafeResourceUrl | null> {
    const data = await this.http.getFileUrl(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_DOCUMENT_ID(_id),
      this.forbiddenErrors,
      [{ name: 'type', value: type }]
    );
    return data ?? null;
  }

  async updateDocument(
    _id: string,
    type: ObligatoryMobilityDocumentTypes,
    formData: FormData
  ): Promise<ObligatoryMobility | null> {
    const data = await this.http.put<ObligatoryMobility>(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_DOCUMENT_ID(_id),
      formData,
      this.forbiddenErrors,
      [{ name: 'type', value: type }]
    );
    return data ?? null;
  }

  async deleteDocument(
    _id: string,
    type: ObligatoryMobilityDocumentTypes
  ): Promise<void> {
    await this.http.delete<void>(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_DOCUMENT_ID(_id),
      this.forbiddenErrors,
      [{ name: 'type', value: type }]
    );
  }

  async getAllAttachments(
    specialty: string,
    initialDate: Date,
    finalDate: Date
  ): Promise<AttachmentsObligatoryMobilityByHospital[]> {
    const data = await this.http.get<AttachmentsObligatoryMobilityByHospital[]>(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.ATTACHMENTS,
      this.forbiddenErrors,
      [
        { name: 'specialty', value: specialty },
        { name: 'initialDate', value: initialDate.toISOString() },
        { name: 'finalDate', value: finalDate.toISOString() },
      ]
    );

    return data ?? [];
  }

  async getAttachments(
    _id: string
  ): Promise<AttachmentsObligatoryMobilityResponse | null> {
    const data = await this.http.get<AttachmentsObligatoryMobilityResponse>(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.ATTACHMENTS_BY_ID(_id),
      this.forbiddenErrors
    );

    return data ?? null;
  }

  async addAttachments(
    attachmentsObligatoryMobility: AttachmentsObligatoryMobility
  ): Promise<AttachmentsObligatoryMobility | null> {
    const data = await this.http.post<AttachmentsObligatoryMobility>(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.ATTACHMENTS,
      attachmentsObligatoryMobility,
      this.forbiddenErrors
    );

    return data ?? null;
  }

  async updateAttachments(
    _id: string,
    attachmentsObligatoryMobility: AttachmentsObligatoryMobility
  ): Promise<AttachmentsObligatoryMobility | null> {
    const data = await this.http.put<AttachmentsObligatoryMobility>(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.ATTACHMENTS_BY_ID(_id),
      attachmentsObligatoryMobility,
      this.forbiddenErrors
    );

    return data ?? null;
  }

  async deleteAttachments(_id: string): Promise<void> {
    await this.http.delete(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.ATTACHMENTS_BY_ID(_id),
      this.forbiddenErrors
    );
  }

  async getAttachmentsDocument(
    _id: string,
    type: AttachmentsObligatoryMobilityDocumentTypes
  ): Promise<SafeResourceUrl | null> {
    const data = await this.http.getFileUrl(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ATTACHMENTS_DOCUMENT_ID(_id),
      this.forbiddenErrors,
      [{ name: 'type', value: type }]
    );

    return data ?? null;
  }

  async updateAttachmentsDocument(
    _id: string,
    type: AttachmentsObligatoryMobilityDocumentTypes,
    formData: FormData
  ): Promise<ObligatoryMobility | null> {
    const data = await this.http.put<ObligatoryMobility>(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ATTACHMENTS_DOCUMENT_ID(_id),
      formData,
      this.forbiddenErrors,
      [{ name: 'type', value: type }]
    );
    return data ?? null;
  }

  async deleteAttachmentsDocument(
    _id: string,
    type: AttachmentsObligatoryMobilityDocumentTypes
  ): Promise<void> {
    await this.http.delete<void>(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ATTACHMENTS_DOCUMENT_ID(_id),
      this.forbiddenErrors,
      [{ name: 'type', value: type }]
    );
  }

  async generateSolicitude(
    _id: string,
    numberOfDocument: number,
    dateOfDocument: Date
  ): Promise<Blob | null> {
    const data = await this.http.getBlob(
      SERVER_ENDPOINTS.OBLIGATORY_MOBILITIES.ATTACHMENTS_GENERATE_BY_ID(_id),
      this.forbiddenErrors,
      [
        {
          name: 'numberOfDocument',
          value: numberOfDocument.toString(),
        },
        {
          name: 'date',
          value: dateOfDocument.toISOString(),
        },
      ]
    );

    return data ?? null;
  }
}
