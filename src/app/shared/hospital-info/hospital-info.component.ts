import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Hospital } from '@data/interfaces';
import { HospitalsService } from '@data/services';
import { HospitalDialogComponent } from '@shared/hospital-dialog';

/** Hospital Info component */
@Component({
  selector: 'app-hospital-info',
  templateUrl: './hospital-info.component.html',
  styleUrls: ['./hospital-info.component.css'],
})
export class HospitalInfoComponent implements OnInit {
  @Input()
  id: string | Hospital = '';
  hospital: Hospital | null = null;
  phones = '';
  emails = '';

  constructor(
    private hospitalsService: HospitalsService,
    private dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getHospital();
  }

  /** Gets the hospital from the server */
  async getHospital(): Promise<void> {
    this.hospital = await this.hospitalsService.get(
      (this.id as Hospital)._id
        ? (this.id as Hospital)._id!
        : (this.id as string)
    );
    if (this.hospital) {
      //Format the phones, emails and hospital to show
      this.phones = '';
      this.hospital.phones.map((phone) => {
        this.phones += phone + ', ';
      });
      this.phones = this.phones.slice(0, -2);
      this.emails = '';
      this.hospital.emails.map((email) => {
        this.emails += email + ', ';
      });
      this.emails = this.emails.slice(0, -2);
    }
  }

  /** Opens the hospital dialog to modify the Hospital */
  updateHospitalDialog(): void {
    const dialogRef = this.dialog.open(HospitalDialogComponent, {
      maxWidth: '500px',
      width: '80%',
      position: {
        top: '10px',
      },
      data: this.hospital,
    });

    dialogRef.afterClosed().subscribe(async () => {
      await this.getHospital();
    });
  }
}
