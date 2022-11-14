import { Injectable } from '@angular/core';
import { SERVER_ENDPOINTS } from '@core/constants';
import { ForbiddenErrorInterface } from '@core/interfaces';
import { HttpPetitions } from '@core/services';
import { RotationService } from '@data/interfaces';

@Injectable()
export class RotationServicesService {
  forbiddenErrors: ForbiddenErrorInterface[] = [];

  constructor(private http: HttpPetitions) {}

  async getAll(specialty: string): Promise<RotationService[]> {
    let data = await this.http.get<RotationService[]>(
      SERVER_ENDPOINTS.ROTATION_SERVICES.BASE_ENDPOINT,
      this.forbiddenErrors,
      [{ name: 'specialty', value: specialty }]
    );
    return data || [];
  }

  async get(_id: string): Promise<RotationService | null> {
    let data = await this.http.get<RotationService>(
      SERVER_ENDPOINTS.ROTATION_SERVICES.BY_ID(_id),
      this.forbiddenErrors
    );
    return data || null;
  }

  async add(rotationService: RotationService): Promise<RotationService | null> {
    let data = await this.http.post<RotationService>(
      SERVER_ENDPOINTS.ROTATION_SERVICES.BASE_ENDPOINT,
      rotationService,
      this.forbiddenErrors
    );
    return data || null;
  }

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

  async delete(_id: string): Promise<void> {
    await this.http.delete<void>(
      SERVER_ENDPOINTS.ROTATION_SERVICES.BY_ID(_id),
      this.forbiddenErrors
    );
  }
}
