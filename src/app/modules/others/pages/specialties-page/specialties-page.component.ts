import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Specialty } from '@data/interfaces';
import { SpecialtiesService } from '@data/services';
import { DeleteDialogComponent } from '@shared/delete-dialog';
import { IncomingSpecialtyDialogComponent } from '@shared/incoming-specialty-dialog';
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
  incoming = false;

  constructor(
    private dialog: MatDialog,
    private specialtiesService: SpecialtiesService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.data.subscribe(async (v) => {
      if (v['incoming']) {
        this.incoming = true;
      }
      await this.getSpecialties();
    });
  }

  /**
   * Gets the specialties from the server
   * @async
   */
  async getSpecialties(): Promise<void> {
    this.loading = true;
    this.specialties = await this.specialtiesService.findAll(this.incoming);
    this.loading = false;
  }

  /**
   * Opens the Specialty dialog for add a Specialty
   */
  addSpecialtyDialog(): void {
    if (this.incoming) {
      const dialogRef = this.dialog.open(IncomingSpecialtyDialogComponent, {
        maxWidth: '500px',
        width: '80%',
        position: { top: '10px' },
        data: {},
      });

      dialogRef.afterClosed().subscribe(async () => {
        await this.getSpecialties();
      });
    } else {
      const dialogRef = this.dialog.open(SpecialtyDialogComponent, {
        maxWidth: '500px',
        width: '80%',
        position: { top: '10px' },
        data: {},
      });

      dialogRef.afterClosed().subscribe(async () => {
        await this.getSpecialties();
      });
    }
  }

  /**
   * Opens the Specialty dialog for add the specified Specialty
   * @param {Specialty} specialty
   */
  updateSpecialtyDialog(specialty: Specialty): void {
    if (this.incoming) {
      const dialogRef = this.dialog.open(IncomingSpecialtyDialogComponent, {
        maxWidth: '500px',
        width: '80%',
        position: { top: '10px' },
        data: { specialty },
      });

      dialogRef.afterClosed().subscribe(async () => {
        await this.getSpecialties();
      });
    } else {
      const dialogRef = this.dialog.open(SpecialtyDialogComponent, {
        maxWidth: '500px',
        width: '80%',
        position: { top: '10px' },
        data: { specialty },
      });

      dialogRef.afterClosed().subscribe(async () => {
        await this.getSpecialties();
      });
    }
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
        await this.specialtiesService.delete(_id, this.incoming);
        await this.getSpecialties();
      }
    });
  }
}
