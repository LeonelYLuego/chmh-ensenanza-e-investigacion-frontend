import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Specialty } from '@data/interfaces';
import { SpecialtiesService } from '@data/services';

/** @class Specialty Dialog Component */
@Component({
  selector: 'app-specialty-dialog',
  templateUrl: './specialty-dialog.component.html',
  styleUrls: ['./specialty-dialog.component.css'],
})
export class SpecialtyDialogComponent implements OnInit {
  specialtyFormControl = new FormGroup({
    value: new FormControl('', [Validators.required, Validators.minLength(3)]),
    duration: new FormControl<number | string>('', [
      Validators.required,
      Validators.min(1),
      Validators.max(6),
    ]),
    tenuredPostgraduateProfessor: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(128),
    ]),
    headOfService: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(128),
    ]),
  });

  constructor(
    private dialogRef: MatDialogRef<SpecialtyDialogComponent>,
    private specialtiesService: SpecialtiesService,
    @Inject(MAT_DIALOG_DATA)
    public data: { specialty?: Specialty; incoming: boolean }
  ) {
    if (data.specialty) {
      this.specialtyFormControl.setValue({
        value: data.specialty.value,
        duration: data.specialty.duration,
        headOfService: data.specialty.headOfService,
        tenuredPostgraduateProfessor:
          data.specialty.tenuredPostgraduateProfessor,
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
            duration: values.duration as number,
            headOfService: values.headOfService!,
            tenuredPostgraduateProfessor: values.tenuredPostgraduateProfessor!,
          },
          this.data.incoming
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
            duration: values.duration as number,
            headOfService: values.headOfService!,
            tenuredPostgraduateProfessor: values.tenuredPostgraduateProfessor!,
          },
          this.data.incoming
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
