import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplatesService } from '@data/services/templates.service';

/** Templates page component */
@Component({
  selector: 'app-templates-page',
  templateUrl: './templates-page.component.html',
  styleUrls: ['./templates-page.component.css'],
})
export class TemplatesPageComponent implements OnInit {
  constructor(
    private templatesService: TemplatesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  /**
   * Shows a SnackBar when a template is updated
   */
  showEditedSnackBar(): void {
    this.snackBar.open('Plantilla Actualizada', undefined, {
      duration: 2000,
      panelClass: 'accent-snackbar',
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  /**
   * Sends the information to the server to update a Template
   * @param event
   */
  async updateSocialServicePresentationOfficeTemplate(
    event: any
  ): Promise<void> {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      await this.templatesService.update(
        'socialService',
        'presentationOfficeDocument',
        formData
      );
      this.showEditedSnackBar();
    }
  }

  /**
   * Sends the information to the server to update a Template
   * @param event
   */
  async updateOptionalMobilitiesSolicitudeTemplate(event: any): Promise<void> {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      await this.templatesService.update(
        'optionalMobility',
        'solicitudeDocument',
        formData
      );
      this.showEditedSnackBar();
    }
  }

  /**
   * Sends the information to the server to update a Template
   * @param event
   */
  async updateOptionalMobilitiesPresentationOfficeTemplate(
    event: any
  ): Promise<void> {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      await this.templatesService.update(
        'optionalMobility',
        'presentationOfficeDocument',
        formData
      );
      this.showEditedSnackBar();
    }
  }

  /**
   * Sends the information to the server to update a Template
   * @param event
   */
  async updateObligatoryMobilitiesSolicitudeTemplate(
    event: any
  ): Promise<void> {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      await this.templatesService.update(
        'obligatoryMobility',
        'solicitudeDocument',
        formData
      );
      this.showEditedSnackBar();
    }
  }
}
