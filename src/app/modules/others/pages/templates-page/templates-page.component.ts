import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '@data/services/templates.service';

@Component({
  selector: 'app-templates-page',
  templateUrl: './templates-page.component.html',
  styleUrls: ['./templates-page.component.css'],
})
export class TemplatesPageComponent implements OnInit {
  constructor(private templatesService: TemplatesService) {}

  ngOnInit(): void {}

  async updateSocialServicePresentationOfficeTemplate(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      await this.templatesService.update(
        'socialService',
        'presentationOfficeDocument',
        formData
      );
    }
  }
}
