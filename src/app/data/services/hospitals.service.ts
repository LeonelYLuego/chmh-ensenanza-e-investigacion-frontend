import { Injectable } from '@angular/core';
import { SERVER_ENDPOINTS } from '@core/constants';
import { ForbiddenErrorInterface } from '@core/interfaces';
import { HttpPetitions } from '@core/services';
import { Hospital } from '../interfaces/hospital';

/** Hospitals service */
@Injectable({
  providedIn: 'root',
})
export class HospitalsService {
  err: any;
  forbiddenErrors: ForbiddenErrorInterface[] = [
    {
      errorMessage: 'hospital not found',
      snackbarMessage: 'Hospital no encontrado',
    },
    {
      errorMessage: 'hospital not modified',
      snackbarMessage: 'Hospital no modificado',
    },
    {
      errorMessage: 'hospital not deleted',
      snackbarMessage: 'Hospital no eliminado',
    },
  ];

  constructor(private http: HttpPetitions) {}

  /**
   * Gets from the server the Hospitals
   * @async
   * @returns {Promise<Hospital[]>} the found Hospitals
   */
  async getAll(): Promise<Hospital[]> {
    let data = await this.http.get<Hospital[]>(
      SERVER_ENDPOINTS.HOSPITALS.BASE_ENDPOINT,
      this.forbiddenErrors
    );
    return data ?? [];
  }

  /**
   * Gets from the serve a Hospital
   * @param _id Hospital primary key
   * @returns the found hospital
   */
  async get(_id: string): Promise<Hospital | null> {
    const data = await this.http.get<Hospital | null>(
      SERVER_ENDPOINTS.HOSPITALS.BY_ID(_id),
      this.forbiddenErrors
    );
    return data ?? null;
  }

  /**
   * Gets from the server all Social Service Hospitals
   * @returns the found hospitals
   */
  async getSocialServices(): Promise<Hospital[]> {
    let data = await this.http.get<Hospital[]>(
      SERVER_ENDPOINTS.HOSPITALS.SOCIAL_SERVICE,
      this.forbiddenErrors
    );
    return data ?? [];
  }

  /**
   * Adds a Hospital in the server
   * @async
   * @param {Hospital} hospital
   * @returns {Promise<Hospital | null>} the added Hospital
   */
  async add(hospital: Hospital): Promise<Hospital | null> {
    let data = await this.http.post<Hospital>(
      SERVER_ENDPOINTS.HOSPITALS.BASE_ENDPOINT,
      hospital,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  /**
   * Updates the specified Hospital in the server
   * @async
   * @param {string} _id _id of the Hospital
   * @param {Hospital} hospital
   * @returns {Promise<Hospital | null>} the updated Hospital
   */
  async update(_id: string, hospital: Hospital): Promise<Hospital | null> {
    let data = await this.http.put<Hospital>(
      SERVER_ENDPOINTS.HOSPITALS.BY_ID(_id),
      hospital,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  /**
   * Deletes the specified Hospital in the server
   * @async
   * @param {string} _id
   */
  async delete(_id: string): Promise<void> {
    await this.http.delete(
      SERVER_ENDPOINTS.HOSPITALS.BY_ID(_id),
      this.forbiddenErrors
    );
  }
}
