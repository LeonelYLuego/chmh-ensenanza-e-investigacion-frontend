import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Hospital } from '@app/data/interfaces/hospital';
import { HospitalsService } from '@app/data/services/hospitals.service';

@Component({
  selector: 'app-hospital-dialog',
  templateUrl: './hospital-dialog.component.html',
  styleUrls: ['./hospital-dialog.component.css'],
})
/** @class Hospital Dialog Component */
export class HospitalDialogComponent implements OnInit {
  private textValidators = [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(64),
  ];
  showDirectorInputs = false;
  showAddressInputs = false;

  hospitalFormControl = new FormGroup({
    name: new FormControl('', this.textValidators),
    acronym: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(4),
    ]),
    educationBoss: new FormControl('', [
      Validators.minLength(3),
      Validators.maxLength(64),
    ]),
    phones: new FormArray<FormControl<string | null>>([]),
    emails: new FormArray<FormControl<string | null>>([]),
    socialService: new FormControl(false),
  });

  directorFormControl = new FormGroup({
    name: new FormControl('', this.textValidators),
    position: new FormControl('', this.textValidators),
  });

  addressFormControl = new FormGroup({
    country: new FormControl('', this.textValidators),
    state: new FormControl('', this.textValidators),
    city: new FormControl('', this.textValidators),
    street: new FormControl('', this.textValidators),
  });

  constructor(
    private dialogRef: MatDialogRef<HospitalDialogComponent>,
    private hospitalsService: HospitalsService,
    @Inject(MAT_DIALOG_DATA) public data: undefined | Hospital
  ) {}

  ngOnInit(): void {
    // Checks if exists a hospital to edit
    if (this.data) {
      this.hospitalFormControl.setValue({
        name: this.data.name,
        acronym: this.data.acronym ?? null,
        educationBoss: this.data.educationBoss ?? null,
        emails: [],
        phones: [],
        socialService: this.data.socialService,
      });
      this.data.phones.map((phone) => {
        this.addPhone(phone);
      });
      this.data.emails.map((email) => {
        this.addEmail(email);
      });
      if (this.data.director) {
        this.directorFormControl.setValue({
          name: this.data.director.name,
          position: this.data.director.position,
        });
        this.showDirectorInputs = true;
      }
      if (this.data.address) {
        this.addressFormControl.setValue({
          country: this.data.address.country,
          state: this.data.address.state,
          city: this.data.address.city,
          street: this.data.address.street,
        });
        this.showAddressInputs = true;
      }
    }
  }

  /**
   * Disapears the direcitor form controls
   */
  removeDirector(): void {
    this.directorFormControl.controls.name.setValue('');
    this.directorFormControl.controls.position.setValue('');
    this.showDirectorInputs = false;
  }

  /**
   * Disapears the address form controls
   */
  removeAddress(): void {
    this.addressFormControl.controls.country.setValue('');
    this.addressFormControl.controls.state.setValue('');
    this.addressFormControl.controls.city.setValue('');
    this.addressFormControl.controls.street.setValue('');
    this.showAddressInputs = false;
  }

  /**
   * Adds a phone control to the dialog
   * @param {string} phone phone value
   */
  addPhone(phone: string = ''): void {
    this.hospitalFormControl.controls.phones.push(
      new FormControl(phone, [
        Validators.required,
        Validators.pattern(
          /^(\+[0-9]{2})*\ {0,1}[0-9]{3}\ {0,1}[0-9]{3}\ {0,1}[0-9]{4}$/
        ),
      ])
    );
  }

  /**
   * Deletes a specified phone control of the dialog
   * @param {number} index
   */
  deletePhone(index: number): void {
    this.hospitalFormControl.controls.phones.removeAt(index);
  }

  /**
   * Adds a email control to the dialog
   * @param {string} email email value
   */
  addEmail(email: string = ''): void {
    this.hospitalFormControl.controls.emails.push(
      new FormControl(email, [
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(64),
      ])
    );
  }

  /**
   * Deletes a specified email control of the dialog
   * @param {number} index
   */
  deleteEmail(index: number): void {
    this.hospitalFormControl.controls.emails.removeAt(index);
  }

  /**
   * Get the dialog data and transforms to Hospital object
   * @returns {Hospital} Hospital object if is valid
   * @returns {null} if is no valid
   */
  private getHospital(): Hospital | null {
    if (this.hospitalFormControl.valid) {
      const data = this.hospitalFormControl.value;
      let director: { name: string; position: string } | undefined = undefined;
      let address:
        | {
            country: string;
            state: string;
            city: string;
            street: string;
          }
        | undefined = undefined;
      if (this.showDirectorInputs) {
        if (this.directorFormControl.valid) {
          const data = this.directorFormControl.value;
          director = {
            name: data.name!,
            position: data.position!,
          };
        } else return null;
      }
      if (this.showAddressInputs) {
        if (this.addressFormControl.valid) {
          const data = this.addressFormControl.value;
          address = {
            country: data.country!,
            state: data.state!,
            city: data.city!,
            street: data.street!,
          };
        } else return null;
      }
      return {
        name: data.name!,
        acronym: data.acronym == '' ? undefined : data.acronym!,
        educationBoss:
          data.educationBoss == '' ? undefined : data.educationBoss!,
        director,
        address,
        phones: data.phones as string[],
        emails: data.emails as string[],
        socialService: data.socialService!,
      };
    }
    return null;
  }

  /**
   * Sends the dialog data for add a Hospital in the server
   * @async
   */
  async addHospital(): Promise<void> {
    const hospital = this.getHospital();
    if (hospital) {
      if (await this.hospitalsService.createHospital(hospital)) this.close();
    }
  }

  /**
   * Sends the dialog data for update a specified Hospital in the server
   * @async
   */
  async updateHospital(): Promise<void> {
    const hospital = this.getHospital();
    if (hospital) {
      if (await this.hospitalsService.updateHospital(this.data!._id!, hospital))
        this.close();
    }
  }

  /** Close the dialog */
  close(): void {
    this.dialogRef.close();
  }
}
