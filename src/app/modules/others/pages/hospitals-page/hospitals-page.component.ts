import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Hospital } from '@data/interfaces';
import { HospitalsService } from '@data/services';
import { HospitalDialogComponent } from '@shared/hospital-dialog';

@Component({
  selector: 'app-hospitals-page',
  templateUrl: './hospitals-page.component.html',
  styleUrls: ['./hospitals-page.component.css'],
})
/** @class Hospitals Page Component */
export class HospitalsPageComponent implements OnInit {
  loading = false;
  displayedColumns = ['name', 'address', 'update', 'delete'];
  hospitals: Hospital[] = [];

  constructor(
    private hospitalsService: HospitalsService,
    private dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    await this.getHospitals();
    this.loading = false;
  }

  /**
   * Gets the hospitals form the server
   * @async
   */
  async getHospitals(): Promise<void> {
    this.hospitals = await this.hospitalsService.getAll();
  }

  /**
   * Opens the Hospital dialog for add a Hospital
   * @async
   */
  async addHospitalDialog(): Promise<void> {
    const dialogRef = this.dialog.open(HospitalDialogComponent, {
      maxWidth: '500px',
      width: '80%',
      position: {
        top: '10px',
      },
    });

    dialogRef.afterClosed().subscribe(async () => {
      await this.getHospitals();
    });
  }

  /**
   * Opens the Hospital dialog for update the specified Hospital
   * @async
   * @param {Hospital} hospital
   */
  async updateHospitalDialog(hospital: Hospital): Promise<void> {
    const dialogRef = this.dialog.open(HospitalDialogComponent, {
      maxWidth: '500px',
      width: '80%',
      position: {
        top: '10px',
      },
      data: hospital,
    });

    dialogRef.afterClosed().subscribe(async () => {
      await this.getHospitals();
    });
  }

  /**
   * Deletes the specified Hospital
   * @async
   * @param {string} _id _id Hospital
   */
  async deleteHospital(_id: string): Promise<void> {
    await this.hospitalsService.delete(_id);
    await this.getHospitals();
  }
}
