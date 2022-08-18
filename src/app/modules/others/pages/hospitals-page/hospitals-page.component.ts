import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Hospital } from '@app/data/interfaces/hospital';
import { HospitalsService } from '@app/data/services/hospitals.service';
import { HospitalDialogComponent } from '@app/shared/hospital-dialog/hospital-dialog.component';

@Component({
  selector: 'app-hospitals-page',
  templateUrl: './hospitals-page.component.html',
  styleUrls: ['./hospitals-page.component.css'],
})
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

  async getHospitals(): Promise<void> {
    this.hospitals = await this.hospitalsService.getHospitals();
  }

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

  async deleteHospital(_id: string): Promise<void> {
    await this.hospitalsService.deleteHospital(_id);
    await this.getHospitals();
  }
}
