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
  IncomingStudent,
  IncomingStudentsBySpecialty,
  IncomingStudentsInterval,
} from '@data/interfaces/incoming-student';
import { IncomingStudentDocumentTypes } from '@data/types/incoming-student-document.type';

/**  */
@Injectable()
export class IncomingStudentsService {
  forbiddenErrors: ForbiddenErrorInterface[] = [
    {
      errorMessage: 'incoming student not found',
      snackbarMessage: 'Rotante no encontrado',
    },
    {
      errorMessage: 'incoming student not modified',
      snackbarMessage: 'Rotante no editado',
    },
    {
      errorMessage: 'incoming student not deleted',
      snackbarMessage: 'Rotante no eliminado',
    },
    {
      errorMessage: 'document not found',
      snackbarMessage: 'Documento no encontrado',
    },
    {
      errorMessage: 'file must be a pdf',
      snackbarMessage: 'El archivo debe ser un PDF',
    },
    {
      errorMessage: 'incoming student interval not found',
      snackbarMessage: 'Intervalo de Rotantes no encontrado',
    },
    {
      errorMessage: 'specialty not found',
      snackbarMessage: 'Especialidad no encontrada',
    },
    {
      errorMessage: 'rotation service not found',
      snackbarMessage: 'Servicio a Rotar no encontrado',
    },
  ];

  constructor(private http: HttpPetitions) {}

  /** Gets an Incoming Student based on the provided _id */
  async get(_id: string): Promise<IncomingStudent | null> {
    const data = await this.http.get<IncomingStudent>(
      SERVER_ENDPOINTS.INCOMING_STUDENTS.BY_ID(_id),
      this.forbiddenErrors
    );
    return data ?? null;
  }

  /** Gets all Incoming Students between the dates */
  async getAll(
    initialDate: Date,
    finalDate: Date
  ): Promise<IncomingStudentsBySpecialty[]> {
    const data = await this.http.get<IncomingStudentsBySpecialty[]>(
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

  /** Adds a new Incoming Student */
  async add(incomingStudent: IncomingStudent): Promise<IncomingStudent | null> {
    const data = await this.http.post<IncomingStudent>(
      SERVER_ENDPOINTS.INCOMING_STUDENTS.BASE_ENDPOINT,
      incomingStudent,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  /** Updates an Incoming Student based on the provided _id */
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

  /** Deletes an Incoming Student based on the provided _id */
  async delete(_id: string): Promise<void> {
    await this.http.delete<IncomingStudent>(
      SERVER_ENDPOINTS.INCOMING_STUDENTS.BY_ID(_id),
      this.forbiddenErrors
    );
  }

  /** Gets the interval to find Incoming Students */
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

  /** Gets a period of the dates */
  getPeriod(initialDate: Date, finalDate: Date): string {
    let initialMonthString = monthToString(initialDate.getMonth());
    initialMonthString =
      initialMonthString.charAt(0).toUpperCase() + initialMonthString.slice(1);
    let finalMonthString = monthToString(finalDate.getMonth());
    finalMonthString =
      finalMonthString.charAt(0).toUpperCase() + finalMonthString.slice(1);
    return `${initialMonthString} de ${initialDate.getFullYear()} - ${finalMonthString} de ${finalDate.getFullYear()}`;
  }

  /** Gets the specified document */
  async getDocument(
    _id: string,
    type: IncomingStudentDocumentTypes
  ): Promise<SafeResourceUrl | null> {
    let data = await this.http.getFileUrl(
      SERVER_ENDPOINTS.INCOMING_STUDENTS.BY_DOCUMENT_ID(_id),
      this.forbiddenErrors,
      [{ name: 'type', value: type }]
    );
    return data ?? null;
  }

  /** Updates the specified document */
  async updateDocument(
    _id: string,
    type: IncomingStudentDocumentTypes,
    formData: FormData
  ): Promise<IncomingStudent | null> {
    let data = await this.http.put<IncomingStudent | null>(
      SERVER_ENDPOINTS.INCOMING_STUDENTS.BY_DOCUMENT_ID(_id),
      formData,
      this.forbiddenErrors,
      [{ name: 'type', value: type }]
    );
    return data ?? null;
  }

  /** Deleted the specified document */
  async deleteDocument(
    _id: string,
    type: IncomingStudentDocumentTypes
  ): Promise<void> {
    await this.http.delete<void>(
      SERVER_ENDPOINTS.INCOMING_STUDENTS.BY_DOCUMENT_ID(_id),
      this.forbiddenErrors,
      [{ name: 'type', value: type }]
    );
  }

  /** Cancels an Incoming Student based on the provided _id */
  async cancel(_id: string): Promise<IncomingStudent | null> {
    const data = await this.http.put<IncomingStudent>(
      SERVER_ENDPOINTS.INCOMING_STUDENTS.CANCEL_ID(_id),
      this.forbiddenErrors
    );
    return data ?? null;
  }

  /** Uncancels an Incoming Student based on the provided _id */
  async uncancel(_id: string): Promise<IncomingStudent | null> {
    const data = await this.http.put<IncomingStudent>(
      SERVER_ENDPOINTS.INCOMING_STUDENTS.UNCANCEL_ID(_id),
      this.forbiddenErrors
    );
    return data ?? null;
  }

  /** Toggle the VoBo of the Incoming Student  */
  async VoBo(_id: string): Promise<IncomingStudent | null> {
    const data = await this.http.put<IncomingStudent>(
      SERVER_ENDPOINTS.INCOMING_STUDENTS.VOBO_ID(_id),
      this.forbiddenErrors
    );
    return data ?? null;
  }

  /** Generates the acceptances documents */
  async generateDocuments(
    initialNumberOfDocuments: number,
    numberOfDocument: number,
    dateOfDocuments: Date,
    dateToPresent: Date,
    initialDate: Date,
    finalDate: Date,
    hospital?: string,
    specialty?: string
  ): Promise<Blob | null> {
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
        name: 'initialDate',
        value: initialDate.toISOString(),
      },
      {
        name: 'finalDate',
        value: finalDate.toISOString(),
      },
      {
        name: 'numberOfDocument',
        value: numberOfDocument.toString(),
      },
      {
        name: 'dateToPresent',
        value: dateToPresent.toISOString(),
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
      SERVER_ENDPOINTS.INCOMING_STUDENTS.GENERATE,
      this.forbiddenErrors,
      params
    );

    return data ?? null;
  }
}
