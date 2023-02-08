import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { ObligatoryMobilitiesService } from '@data/services';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'DD MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'DD MMMM YYYY',
  },
};

/** Attachments Obligatory Mobility Generate dialog component */
@Component({
  selector: 'app-attachments-obligatory-mobility-generate-dialog',
  templateUrl:
    './attachments-obligatory-mobility-generate-dialog.component.html',
  styleUrls: [
    './attachments-obligatory-mobility-generate-dialog.component.css',
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AttachmentsObligatoryMobilityGenerateDialogComponent
  implements OnInit
{
  generateFormControl = new FormGroup({
    numberOfDocument: new FormControl<number | undefined>(undefined, [
      Validators.required,
      Validators.min(0),
      Validators.pattern(/^\d+$/),
    ]),
    dateOfDocument: new FormControl<Date | undefined>(undefined, [
      Validators.required,
    ]),
  });
  @Input()
  _id: string = '';

  constructor(
    private obligatoryMobilitiesService: ObligatoryMobilitiesService
  ) {}

  ngOnInit(): void {
    console.log(this._id);
  }

  /**
   * Generates solicitude docx document
   */
  async generateSolicitude(): Promise<void> {
    if (this.generateFormControl.valid) {
      const blob = await this.obligatoryMobilitiesService.generateSolicitude(
        this._id,
        this.generateFormControl.controls.numberOfDocument.value!,
        this.generateFormControl.controls.dateOfDocument.value!
      );
      if (blob) {
        var url = window.URL.createObjectURL(blob);
        var anchor = document.createElement('a');
        anchor.download = 'Solicitud.docx';
        anchor.href = url;
        anchor.click();
      }
    }
  }
}
