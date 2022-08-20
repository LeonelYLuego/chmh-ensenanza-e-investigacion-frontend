import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Specialty } from '@app/data/interfaces/specialty';
import { SpecialtiesService } from '@app/data/services/specialties.service';

@Component({
  selector: 'app-specialty-dialog',
  templateUrl: './specialty-dialog.component.html',
  styleUrls: ['./specialty-dialog.component.css'],
})
/** @class Specialty Dialog Component */
export class SpecialtyDialogComponent implements OnInit {
  value = new FormControl('', [Validators.required, Validators.minLength(3)]);

  constructor(
    private dialogRef: MatDialogRef<SpecialtyDialogComponent>,
    private specialtiesService: SpecialtiesService,
    @Inject(MAT_DIALOG_DATA) public data: Specialty | undefined
  ) {
    if (data) this.value.setValue(data.value);
  }

  ngOnInit(): void {}

  /**
   * Sends the dialog data to the server for add a Specialty
   * @async
   */
  async addSpecialty(): Promise<void> {
    if (this.value.valid)
      if (
        await this.specialtiesService.addSpecialty({
          value: this.value.value!,
        })
      )
        this.close();
  }

  /**
   * Sends the dialog data to the server to update the Specialty
   */
  async updateSpecialty(): Promise<void> {
    if (this.value.valid) {
      if (
        await this.specialtiesService.updateSpecialty(this.data!._id!, {
          value: this.value.value!,
        })
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
