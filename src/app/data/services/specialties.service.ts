import { Injectable } from '@angular/core';
import { SERVER_ENDPOINTS } from '@core/constants';
import { ForbiddenErrorInterface } from '@core/interfaces';
import { HttpPetitions } from '@core/services';
import { Specialty } from '../interfaces/specialty';

/** Specialties service */
@Injectable({
  providedIn: 'root',
})
export class SpecialtiesService {
  err: any;
  forbiddenErrors: ForbiddenErrorInterface[] = [
    {
      errorMessage: 'specialty not modified',
      snackbarMessage: 'Especialidad no modificada',
    },
    {
      errorMessage: 'specialty already exists',
      snackbarMessage: 'La Especialidad ya existe',
    },
    {
      errorMessage: 'specialty not found',
      snackbarMessage: 'Especialidad no encontrada',
    },
    {
      errorMessage: 'specialty not deleted',
      snackbarMessage: 'Especialidad no eliminada',
    },
  ];

  constructor(private http: HttpPetitions) {}

  /**
   * Finds all Specialties
   * @param incoming
   * @returns
   */
  async findAll(incoming = false): Promise<Specialty[]> {
    let data = await this.http.get<Specialty[]>(
      incoming
        ? SERVER_ENDPOINTS.SPECIALTIES.INCOMING
        : SERVER_ENDPOINTS.SPECIALTIES.BASE_ENDPOINT,
      this.forbiddenErrors
    );
    return data ?? [];
  }

  /**
   * Adds the Specialty in the server
   * @async
   * @param {Specialty} specialty
   * @returns {Promise<Specialty | null>} the added Specialty
   */
  async add(specialty: Specialty, incoming = false): Promise<Specialty | null> {
    let data = await this.http.post<Specialty>(
      incoming
        ? SERVER_ENDPOINTS.SPECIALTIES.INCOMING
        : SERVER_ENDPOINTS.SPECIALTIES.BASE_ENDPOINT,
      specialty,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  /**
   * Updates the specified Specialty in the server
   * @async
   * @param {string} _id _id of the Specialty
   * @param {Specialty} specialty
   * @returns {Promise<Specialty | null>} the updated Specialty
   */
  async update(
    _id: string,
    specialty: Specialty,
    incoming = false
  ): Promise<Specialty | null> {
    let data = await this.http.put<Specialty>(
      incoming
        ? SERVER_ENDPOINTS.SPECIALTIES.INCOMING_BY_ID(_id)
        : SERVER_ENDPOINTS.SPECIALTIES.BY_ID(_id),
      specialty,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  /**
   * Deletes the specified Specialty in the server
   * @async
   * @param {string} _id
   */
  async delete(_id: string, incoming = false): Promise<void> {
    await this.http.delete(
      incoming
        ? SERVER_ENDPOINTS.SPECIALTIES.INCOMING_BY_ID(_id)
        : SERVER_ENDPOINTS.SPECIALTIES.BY_ID(_id),
      this.forbiddenErrors
    );
  }

  /**
   * Gets generations as array of names and values
   * @param _id Specialty primary key
   * @returns last year generation as `value` and the string as `name`
   */
  async getGenerations(
    _id: string
  ): Promise<{ name: string; value: number }[]> {
    //Gets the specialty
    let specialty = await this.http.get<Specialty>(
      SERVER_ENDPOINTS.SPECIALTIES.BY_ID(_id),
      this.forbiddenErrors
    );
    const generations: { name: string; value: number }[] = [];
    if (specialty) {
      //Gets the month and year now
      const today = new Date();
      let month = today.getMonth() + 1,
        year = today.getFullYear();
      //If is january or february
      if (month == 1 || month == 2) year -= 1;
      for (let i = 0; i < 5 + specialty.duration!; i++) {
        let generation = year - i + ' - ' + (year - i + specialty.duration!);
        if (i < specialty.duration!) generation += ' (' + (i + 1) + ' año)';
        generations.push({
          name: generation,
          value: year - i + specialty.duration!,
        });
      }
    }
    return generations;
  }

  /**
   * Get a generation as string
   * @param _id
   * @param lastYearGeneration
   * @returns the generation as string
   */
  async getGeneration(
    _id: string,
    lastYearGeneration: number
  ): Promise<string> {
    let generation = '';
    //Gets the specialty
    let specialty = await this.http.get<Specialty>(
      SERVER_ENDPOINTS.SPECIALTIES.BY_ID(_id),
      this.forbiddenErrors
    );
    if (specialty) {
      //Gets the month and year now
      const today = new Date();
      let month = today.getMonth() + 1,
        year = today.getFullYear();
      //If the month is january or february
      if (month == 1 || month == 2) year -= 1;
      generation += `${
        lastYearGeneration - specialty.duration!
      } - ${lastYearGeneration}`;
      const grade = -(lastYearGeneration - specialty.duration! - year - 1);
      if (grade <= specialty.duration!) {
        generation += ` (${grade} año)`;
      }
    }
    return generation;
  }
}
