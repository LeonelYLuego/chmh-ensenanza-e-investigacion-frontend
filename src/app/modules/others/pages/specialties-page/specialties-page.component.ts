import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Specialty } from '@data/interfaces';
import { SpecialtiesService } from '@data/services';
import { DeleteDialogComponent } from '@shared/delete-dialog';
import { SpecialtyDialogComponent } from '../../dialogs/specialty-dialog/specialty-dialog.component';

/** @class Specialties Page Component */
@Component({
  selector: 'app-specialties-page',
  templateUrl: './specialties-page.component.html',
  styleUrls: ['./specialties-page.component.css'],
})
export class SpecialtiesPageComponent implements OnInit {
  specialties: Specialty[] = [];
  err: any;
  displayedColumns: string[] = ['specialty', 'update', 'delete'];
  loading = false;

  constructor(
    private dialog: MatDialog,
    private specialtiesService: SpecialtiesService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.getSpecialties();
    this.loading = false;
  }

  /**
   * Gets the specialties from the server
   * @async
   */
  async getSpecialties(): Promise<void> {
    this.specialties = await this.specialtiesService.findAll();
  }

  /**
   * Opens the Specialty dialog for add a Specialty
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
  async deleteSpecialty(_id: string, title: string): Promise<void> {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: `a ${title}`,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        await this.specialtiesService.delete(_id);
        await this.getSpecialties();
      }
    });
  }
}
