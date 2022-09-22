import { Injectable } from '@angular/core';
import {
  SERVER_ENDPOINTS,
  SERVER_RESOURCES,
} from '@app/core/constants/server-endpoints.constant';
import { ForbiddenErrorInterface } from '@app/core/interfaces/forbidden-error.interface';
import { HttpPetitions } from '@app/core/services/http-petitions.service';
import { Hospital } from '../interfaces/hospital';

@Injectable({
  providedIn: 'root',
})
/** @class Hospitals Service */
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
  async getHospitals(): Promise<Hospital[]> {
    let data = await this.http.get<Hospital[]>(
      SERVER_RESOURCES.HOSPITALS,
      this.forbiddenErrors
    );
    return data ?? [];
  }

  async getHospital(_id: string): Promise<Hospital | null> {
    const data = await this.http.get<Hospital | null>(
      SERVER_RESOURCES.HOSPITALS + `/${_id}`,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  async getSocialServiceHospitals(): Promise<Hospital[]> {
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
  async createHospital(hospital: Hospital): Promise<Hospital | null> {
    let data = await this.http.post<Hospital>(
      SERVER_RESOURCES.HOSPITALS,
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
  async updateHospital(
    _id: string,
    hospital: Hospital
  ): Promise<Hospital | null> {
    let data = await this.http.put<Hospital>(
      `${SERVER_RESOURCES.HOSPITALS}/${_id}`,
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
  async deleteHospital(_id: string): Promise<void> {
    await this.http.delete(
      `${SERVER_RESOURCES.HOSPITALS}/${_id}`,
      this.forbiddenErrors
    );
  }
}
