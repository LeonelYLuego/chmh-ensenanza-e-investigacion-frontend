import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Specialty } from '@data/interfaces';
import { SpecialtiesService } from '@data/services';

/** @class Specialty Dialog Component */
@Component({
  selector: 'app-specialty-dialog',
  templateUrl: './incoming-specialty-dialog.component.html',
  styleUrls: ['./incoming-specialty-dialog.component.css'],
})
export class IncomingSpecialtyDialogComponent implements OnInit {
  specialtyFormControl = new FormGroup({
    value: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  constructor(
    private dialogRef: MatDialogRef<IncomingSpecialtyDialogComponent>,
    private specialtiesService: SpecialtiesService,
    @Inject(MAT_DIALOG_DATA)
    public data: { specialty?: Specialty }
  ) {
    if (data.specialty) {
      this.specialtyFormControl.setValue({
        value: data.specialty.value,
      });
    }
  }

  ngOnInit(): void {}

  /**
   * Sends the dialog data to the server for add a Specialty
   * @async
   */
  async addSpecialty(): Promise<void> {
    if (this.specialtyFormControl.valid) {
      const values = this.specialtyFormControl.value;
      if (
        await this.specialtiesService.add(
          {
            value: values.value!,
          },
          true
        )
      )
        this.close();
    }
  }

  /**
   * Sends the dialog data to the server to update the Specialty
   */
  async updateSpecialty(): Promise<void> {
    if (this.specialtyFormControl.valid) {
      const values = this.specialtyFormControl.value;
      if (
        await this.specialtiesService.update(
          this.data!.specialty!._id!,
          {
            value: values.value!,
          },
          true
        )
      )
        this.close();
    }
  }

  /**
   * Closes the dialog
   */
  close(): void {
    this.dialogRef.close();
  }
}
