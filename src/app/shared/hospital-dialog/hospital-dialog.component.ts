import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Hospital } from '@data/interfaces';
import { HospitalsService } from '@data/services';

/** @class Hospital Dialog Component */
@Component({
  selector: 'app-hospital-dialog',
  templateUrl: './hospital-dialog.component.html',
  styleUrls: ['./hospital-dialog.component.css'],
})
export class HospitalDialogComponent implements OnInit {
  private textValidators = [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(64),
  ];
  showFirstReceiverInputs = false;
  showSecondReceiverInputs = false;
  showThirdReceiverInputs = false;
  showAddressInputs = false;

  hospitalFormControl = new FormGroup({
    name: new FormControl('', this.textValidators),
    acronym: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(4),
    ]),
    phones: new FormArray<FormControl<string | null>>([]),
    emails: new FormArray<FormControl<string | null>>([]),
    socialService: new FormControl(false),
  });

  directorFormControl = new FormGroup({
    name: new FormControl('', this.textValidators),
    position: new FormControl('', this.textValidators),
  });

  firstReceiverFormControl = new FormGroup({
    position: new FormControl('', this.textValidators),
    name: new FormControl('', [
      Validators.required,
      Validators.min(3),
      Validators.max(128),
    ]),
  });

  secondReceiverFormControl = new FormGroup({
    position: new FormControl('', this.textValidators),
    name: new FormControl('', [
      Validators.required,
      Validators.min(3),
      Validators.max(128),
    ]),
  });

  thirdReceiverFormControl = new FormGroup({
    position: new FormControl('', this.textValidators),
    name: new FormControl('', [
      Validators.required,
      Validators.min(3),
      Validators.max(128),
    ]),
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
        emails: [],
        phones: [],
        socialService: this.data.socialService,
      });
      //Adds the phone data to the form
      this.data.phones.map((phone) => {
        this.addPhone(phone);
      });
      //Adds the email data to de form
      this.data.emails.map((email) => {
        this.addEmail(email);
      });
      //If exists a first receiver adds it to the form
      if (this.data.firstReceiver) {
        this.firstReceiverFormControl.setValue({
          position: this.data.firstReceiver.position,
          name: this.data.firstReceiver.name,
        });
        this.showFirstReceiverInputs = true;
        //If exists a second receiver adds it to the form
        if (this.data.secondReceiver) {
          this.secondReceiverFormControl.setValue({
            position: this.data.secondReceiver.position,
            name: this.data.secondReceiver.name,
          });
          this.showSecondReceiverInputs = true;
          //If exists a third receiver adds it to the form
          if (this.data.thirdReceiver) {
            this.thirdReceiverFormControl.setValue({
              position: this.data.thirdReceiver.position,
              name: this.data.thirdReceiver.name,
            });
            this.showThirdReceiverInputs = true;
          }
        }
      }
      //If exists address data adds it to the form
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
   * Removes the first and second receiver data
   */
  removeFirstReceiver(): void {
    this.removeSecondReceiver();
    this.firstReceiverFormControl.controls.position.setValue('');
    this.firstReceiverFormControl.controls.name.setValue('');
    this.showFirstReceiverInputs = false;
  }

  /**
   * Removes the second receiver data
   */
  removeSecondReceiver(): void {
    this.removeThirdReceiver();
    this.secondReceiverFormControl.controls.position.setValue('');
    this.secondReceiverFormControl.controls.name.setValue('');
    this.showSecondReceiverInputs = false;
  }

  /**
   * Removes the third receiver data
   */
  removeThirdReceiver(): void {
    this.thirdReceiverFormControl.controls.position.setValue('');
    this.thirdReceiverFormControl.controls.name.setValue('');
    this.showThirdReceiverInputs = false;
  }

  /**
   * Disappears the address form controls
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
      let firstReceiver: { name: string; position: string } | undefined =
          undefined,
        secondReceiver: { name: string; position: string } | undefined =
          undefined,
        thirdReceiver: { name: string; position: string } | undefined;
      let address:
        | {
            country: string;
            state: string;
            city: string;
            street: string;
          }
        | undefined = undefined;
      //Adds to the object the first receiver if this is being showed
      if (this.showFirstReceiverInputs) {
        if (this.firstReceiverFormControl.valid) {
          const data = this.firstReceiverFormControl.value;
          firstReceiver = {
            position: data.position!,
            name: data.name!,
          };
          //Adds to the object the second receiver if this is being showed
          if (this.showSecondReceiverInputs) {
            if (this.secondReceiverFormControl.valid) {
              const data = this.secondReceiverFormControl.value;
              secondReceiver = {
                position: data.position!,
                name: data.name!,
              };
              //Adds to the object the third receiver if this is being showed
              if (this.showThirdReceiverInputs) {
                if (this.thirdReceiverFormControl.valid) {
                  const data = this.thirdReceiverFormControl.value;
                  thirdReceiver = {
                    position: data.position!,
                    name: data.name!,
                  };
                } else return null;
              }
            } else return null;
          }
        } else return null;
      }
      //Adds to the object the address if this is being showed
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
        firstReceiver,
        secondReceiver,
        thirdReceiver,
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
      if (await this.hospitalsService.add(hospital)) this.close();
    }
  }

  /**
   * Sends the dialog data for update a specified Hospital in the server
   * @async
   */
  async updateHospital(): Promise<void> {
    const hospital = this.getHospital();
    if (hospital) {
      if (await this.hospitalsService.update(this.data!._id!, hospital))
        this.close();
    }
  }

  /** Close the dialog */
  close(): void {
    this.dialogRef.close();
  }
}
