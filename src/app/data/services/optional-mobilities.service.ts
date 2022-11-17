import { Injectable } from '@angular/core';
import { SERVER_ENDPOINTS } from '@core/constants';
import { ForbiddenErrorInterface } from '@core/interfaces';
import { HttpPetitions } from '@core/services';
import { OptionalMobility } from '@data/interfaces';

@Injectable()
export class OptionalMobilitiesService {
  err: any;
  forbiddenErrors: ForbiddenErrorInterface[] = [];

  constructor(private http: HttpPetitions) {}

  async get(_id: string): Promise<OptionalMobility | null> {
    const data = await this.http.get<OptionalMobility>(
      SERVER_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID(_id),
      this.forbiddenErrors
    );
    return data ?? null;
  }

  async getAll(): Promise<OptionalMobility[]> {
    const data = await this.http.get<OptionalMobility[]>(
      SERVER_ENDPOINTS.OPTIONAL_MOBILITIES.BASE_ENDPOINT,
      this.forbiddenErrors
    );
    return data ?? [];
  }

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

  async delete(_id: string): Promise<void> {
    await this.http.delete<void>(
      SERVER_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID(_id),
      this.forbiddenErrors
    );
  }
}
