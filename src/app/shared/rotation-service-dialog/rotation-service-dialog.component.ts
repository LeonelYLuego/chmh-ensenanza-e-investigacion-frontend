import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RotationService, Specialty } from '@data/interfaces';
import { RotationServicesService, SpecialtiesService } from '@data/services';

/** Rotation Service dialog component */
@Component({
  selector: 'app-rotation-service-dialog',
  templateUrl: './rotation-service-dialog.component.html',
  styleUrls: ['./rotation-service-dialog.component.css'],
})
export class RotationServiceDialogComponent implements OnInit {
  readonly nameValidators = [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(64),
    Validators.pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÑ ]+$/u),
  ];
  rotationServiceFormControl = new FormGroup({
    specialty: new FormControl('', Validators.required),
    value: new FormControl('', this.nameValidators),
  });
  specialties: Specialty[] = [];

  constructor(
    private dialogRef: MatDialogRef<RotationServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      rotationService: RotationService | undefined;
      specialty: string | undefined;
      disableSpecialty: boolean | undefined;
    },
    private rotationServicesService: RotationServicesService,
    private specialtiesService: SpecialtiesService
  ) {}

  async ngOnInit(): Promise<void> {
    this.specialties = await this.specialtiesService.findAll();
    if (this.data.rotationService) {
      this.rotationServiceFormControl.setValue({
        specialty: this.data.rotationService.specialty as string,
        value: this.data.rotationService.value,
      });
    } else {
      if (this.data.specialty) {
        this.rotationServiceFormControl.controls.specialty.setValue(
          this.data.specialty
        );
        if (this.data.disableSpecialty)
          this.rotationServiceFormControl.controls.specialty.disable();
      } else {
        if (this.specialties.length > 0) {
          this.rotationServiceFormControl.controls.specialty.setValue(
            this.specialties[0]._id!
          );
        }
      }
    }
  }

  /**
   * Sends the information to the server to add a Rotation Service
   */
  async addRotationService(): Promise<void> {
    if (this.rotationServiceFormControl.valid) {
      if (
        await this.rotationServicesService.add({
          specialty: this.rotationServiceFormControl.controls.specialty.value!,
          value: this.rotationServiceFormControl.controls.value.value!,
        })
      )
        this.close();
    }
  }

  /**
   * Sends the information to the server to update a Rotation Service
   */
  async updateRotationService(): Promise<void> {
    if (this.rotationServiceFormControl.valid) {
      if (
        await this.rotationServicesService.update(
          this.data!.rotationService!._id!,
          {
            specialty:
              this.rotationServiceFormControl.controls.specialty.value!,
            value: this.rotationServiceFormControl.controls.value.value!,
          }
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
