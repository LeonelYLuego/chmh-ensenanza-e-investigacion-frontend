import { Injectable } from '@angular/core';
import { SERVER_ENDPOINTS } from '@core/constants';
import { ForbiddenErrorInterface } from '@core/interfaces';
import { HttpPetitions } from '@core/services';
import { OptionalMobilityDocumentTypes } from '@data/types/optional-mobility-document.type';
import { SocialServiceDocumentTypes } from '@data/types/social-service-document.type';

/** Templates service */
@Injectable()
export class TemplatesService {
  readonly forbiddenErrors: ForbiddenErrorInterface[] = [
    {
      errorMessage: 'file must be a docx',
      snackbarMessage: 'El documento debe ser un documento de Word',
    },
  ];

  constructor(private http: HttpPetitions) {}

  /**
   * Updates a Temple in the server
   * @param document
   * @param type
   * @param formData
   */
  async update(
    document: 'socialService' | 'optionalMobility',
    type: SocialServiceDocumentTypes | OptionalMobilityDocumentTypes,
    formData: FormData
  ): Promise<void> {
    await this.http.put<void>(
      SERVER_ENDPOINTS.TEMPLATES.BY_DOCUMENT(document),
      formData,
      this.forbiddenErrors,
      [{ name: 'type', value: type }]
    );
  }
}
