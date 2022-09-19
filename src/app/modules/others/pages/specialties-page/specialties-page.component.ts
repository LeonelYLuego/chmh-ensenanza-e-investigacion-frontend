import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SERVER_ENDPOINTS, SERVER_RESOURCES } from '@app/core/constants/server-endpoints.constant';
import { HttpPetitions } from '@app/core/services/http-petitions.service';
import { Specialty } from '@app/data/interfaces/specialty';
import { SpecialtiesService } from '@app/data/services/specialties.service';
import to from 'await-to-js';
import { SpecialtyDialogComponent } from '../../dialogs/specialty-dialog/specialty-dialog.component';

@Component({
  selector: 'app-specialties-page',
  templateUrl: './specialties-page.component.html',
  styleUrls: ['./specialties-page.component.css'],
})
/** @class Specialties Page Component */
export class SpecialtiesPageComponent implements OnInit {
  specialties: Specialty[] = [];
  err: any;
  displayedColumns: string[] = ['specialty', 'update', 'delete'];
  loading = false;

  constructor(
    private http: HttpPetitions,
    private dialog: MatDialog,
    private specialtiesService: SpecialtiesService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.getSpecialties();
    this.loading = false;
  }

  /**
   * Gets the specialtes from the server
   * @async
   */
  async getSpecialties(): Promise<void> {
    let data: Specialty[] | undefined;
    [this.err, data] = await to(
      this.http.get<Specialty[]>(SERVER_RESOURCES.SPECIALTIES)
    );
    if (data) this.specialties = data;
  }

  /**
   * Opens the Speciaty dialog for add a Specialty
   */
  addSpecialtyDialog(): void {
    const dialogRef = this.dialog.open(SpecialtyDialogComponent, {
      maxWidth: '500px',
      width: '80%',
      position: {
        top: '10px',
      },
    });

    dialogRef.afterClosed().subscribe(async () => {
      await this.getSpecialties();
    });
  }

  /**
   * Opens the Specialty dialog for add the specified Specialty
   * @param {Specialty} specialty
   */
  updateSpecialtyDialog(specialty: Specialty): void {
    const dialogRef = this.dialog.open(SpecialtyDialogComponent, {
      maxWidth: '500px',
      width: '80%',
      position: {
        top: '10px',
      },
      data: specialty,
    });

    dialogRef.afterClosed().subscribe(async () => {
      await this.getSpecialties();
    });
  }

  /**
   * Deletes a specified Specialty
   * @param {string} _id _id of the Specialty
   */
  async deleteSpecialty(_id: string): Promise<void> {
    await this.specialtiesService.deleteSpecialty(_id);
    await this.getSpecialties();
  }
}
