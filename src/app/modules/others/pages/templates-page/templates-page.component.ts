import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplatesService } from '@data/services/templates.service';

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

  showEditedSnackBar(): void {
    this.snackBar.open('Plantilla Actualizada', undefined, {
      duration: 2000,
      panelClass: 'accent-snackbar',
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

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
}
