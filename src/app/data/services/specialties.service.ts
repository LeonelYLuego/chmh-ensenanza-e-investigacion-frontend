import { Injectable } from '@angular/core';
import { SERVER_ENDPOINTS } from '@app/core/constants/server-endpoints.constant';
import { ForbiddenErrorInterface } from '@app/core/interfaces/forbidden-error.interface';
import { HttpPetitions } from '@app/core/services/http-petitions.service';
import { Specialty } from '../interfaces/specialty';

@Injectable({
  providedIn: 'root',
})
/** @class Specialties Service */
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
      snackbarMessage: 'No se encontró la Especialidad',
    },
  ];

  constructor(private http: HttpPetitions) {}

  /**
   * Gets all Specialties from the server
   * @async
   * @returns {Promise<Specialty[]>} the found Specialties
   */
  async getSpecialties(): Promise<Specialty[]> {
    let data = await this.http.get<Specialty[]>(SERVER_ENDPOINTS.SPECIALTIES);
    return data ?? [];
  }

  /**
   * Adds the Specialty in the server
   * @async
   * @param {Specialty} specialty
   * @returns {Promise<Specialty | null>} the added Specialty
   */
  async addSpecialty(specialty: Specialty): Promise<Specialty | null> {
    let data = await this.http.post<Specialty>(
      SERVER_ENDPOINTS.SPECIALTIES,
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
  async updateSpecialty(
    _id: string,
    specialty: Specialty
  ): Promise<Specialty | null> {
    let data = await this.http.put<Specialty>(
      `${SERVER_ENDPOINTS.SPECIALTIES}/${_id}`,
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
  async deleteSpecialty(_id: string): Promise<void> {
    await this.http.delete(
      `${SERVER_ENDPOINTS.SPECIALTIES}/${_id}`,
      this.forbiddenErrors
    );
  }

  async getGenerations(_id: string): Promise<{ name: string; value: number }[]> {
    const generations: { name: string; value: number }[] = [];
    // const today = new Date();
    // let month = today.getMonth() + 1,
    //   year = today.getFullYear();

    // if (month == 1 || month == 2) year -= 1;
    // for (let i = 0; i < 5; i++) {
    //   let generation = year - i + ' - ' + (year - i + 3);
    //   if (i < 3) generation += ' (' + (i + 1) + ' año)';
    //   generations.push({
    //     name: generation,
    //     value: year - i + 3,
    //   });
    // }
    return generations;
  }
}
