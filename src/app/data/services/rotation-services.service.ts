import { Injectable } from '@angular/core';
import { SERVER_ENDPOINTS } from '@core/constants';
import { ForbiddenErrorInterface } from '@core/interfaces';
import { HttpPetitions } from '@core/services';
import { RotationService } from '@data/interfaces';

/** Rotation Services service */
@Injectable()
export class RotationServicesService {
  forbiddenErrors: ForbiddenErrorInterface[] = [
    {
      errorMessage: 'specialty must exist',
      snackbarMessage: 'Especialidad no encontrada',
    },
    {
      errorMessage: 'rotation service not found',
      snackbarMessage: 'Servicio a Rotar no encontrado',
    },
    {
      errorMessage: 'rotation service not modified',
      snackbarMessage: 'Servicio a Rotar no editado',
    },
    {
      errorMessage: 'rotation service not deleted',
      snackbarMessage: 'Servicio a Rotar no eliminado',
    },
  ];

  constructor(private http: HttpPetitions) {}

  /**
   * Gets all Rotation Services by Specialty from the server
   * @param specialty Specialty primary key
   * @returns The found Rotation Services
   */
  async getAll(specialty: string): Promise<RotationService[]> {
    let data = await this.http.get<RotationService[]>(
      SERVER_ENDPOINTS.ROTATION_SERVICES.BASE_ENDPOINT,
      this.forbiddenErrors,
      [{ name: 'specialty', value: specialty }]
    );
    return data || [];
  }

  /**
   * Gets a Rotation Service by Id from the server
   * @param _id Rotation Service primary key
   * @returns The found Rotation Service
   */
  async get(_id: string): Promise<RotationService | null> {
    let data = await this.http.get<RotationService>(
      SERVER_ENDPOINTS.ROTATION_SERVICES.BY_ID(_id),
      this.forbiddenErrors
    );
    return data || null;
  }

  /**
   * Adds a Rotation Service in the server
   * @param rotationService
   * @returns The created Rotation Service
   */
  async add(rotationService: RotationService): Promise<RotationService | null> {
    let data = await this.http.post<RotationService>(
      SERVER_ENDPOINTS.ROTATION_SERVICES.BASE_ENDPOINT,
      rotationService,
      this.forbiddenErrors
    );
    return data || null;
  }

  /**
   * Updates a Rotation Service in the server by Id
   * @param _id Rotation Service primary key
   * @param rotationService
   * @returns The updated Rotation Service
   */
  async update(
    _id: string,
    rotationService: RotationService
  ): Promise<RotationService | null> {
    let data = await this.http.put<RotationService>(
      SERVER_ENDPOINTS.ROTATION_SERVICES.BY_ID(_id),
      rotationService,
      this.forbiddenErrors
    );
    return data || null;
  }

  /**
   * Deletes a Rotation Service in the server by Id
   * @param _id Rotation Service primary key
   */
  async delete(_id: string): Promise<void> {
    await this.http.delete<void>(
      SERVER_ENDPOINTS.ROTATION_SERVICES.BY_ID(_id),
      this.forbiddenErrors
    );
  }
}
