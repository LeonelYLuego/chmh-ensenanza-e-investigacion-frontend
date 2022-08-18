import { Injectable } from '@angular/core';
import { SERVER_ENDPOINTS } from '@app/core/constants/server-endpoints.constant';
import { HttpPetitions } from '@app/core/services/http-petitions.service';
import { Hospital } from '../interfaces/hospital';

@Injectable({
  providedIn: 'root',
})
export class HospitalsService {
  err: any;
  forbiddenErrors = [
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

  async getHospitals(): Promise<Hospital[]> {
    let data = await this.http.get<Hospital[]>(
      SERVER_ENDPOINTS.HOSPITALS,
      this.forbiddenErrors
    );
    return data ?? [];
  }

  async createHospital(hospital: Hospital): Promise<Hospital | null> {
    let data = await this.http.post<Hospital>(
      SERVER_ENDPOINTS.HOSPITALS,
      hospital,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  async updateHospital(
    _id: string,
    hospital: Hospital
  ): Promise<Hospital | null> {
    let data = await this.http.put<Hospital>(
      `${SERVER_ENDPOINTS.HOSPITALS}/${_id}`,
      hospital,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  async deleteHospital(_id: string): Promise<void> {
    await this.http.delete(
      `${SERVER_ENDPOINTS.HOSPITALS}/${_id}`,
      this.forbiddenErrors
    );
  }
}
