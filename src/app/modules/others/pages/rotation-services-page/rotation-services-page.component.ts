import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RotationService, Specialty } from '@data/interfaces';
import { RotationServicesService, SpecialtiesService } from '@data/services';
import { RotationServiceDialogComponent } from '@shared/rotation-service-dialog';
import { DeleteDialogComponent } from '@shared/delete-dialog';

/** Rotation Service page component */
@Component({
  selector: 'app-rotation-services-page',
  templateUrl: './rotation-services-page.component.html',
  styleUrls: ['./rotation-services-page.component.css'],
})
export class RotationServicesPageComponent implements OnInit {
  specialties: Specialty[] = [];
  rotationServices: RotationService[] = [];
  specialtyFormControl = new FormControl<string | null>(null);
  displayedColumns = ['name', 'update', 'delete'];
  loading = false;

  constructor(
    private rotationServicesService: RotationServicesService,
    private specialtiesService: SpecialtiesService,
    private dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.specialties = await this.specialtiesService.findAll();
  }

  /**
   * Gets all Rotation Services by Specialty from the server
   */
  async getRotationServices(): Promise<void> {
    this.loading = true;
    if (this.specialtyFormControl.value) {
      this.rotationServices = await this.rotationServicesService.getAll(
        this.specialtyFormControl.value!
      );
    }
    this.loading = false;
  }

  /**
   * If Specialties input change gets again all Rotation Services
   */
  async specialtiesSelectionChange(): Promise<void> {
    await this.getRotationServices();
  }

  /**
   * Opens the Rotation Service dialog to add a new Rotation Service
   */
  addRotationService(): void {
    const dialogRef = this.dialog.open(RotationServiceDialogComponent, {
      maxWidth: '500px',
      width: '80%',
      position: {
        top: '10px',
      },
      data: {
        specialty: this.specialtyFormControl.value ?? undefined,
      },
    });

    dialogRef.afterClosed().subscribe(async () => {
      await this.getRotationServices();
    });
  }

  /**
   * Opens the Rotation Service dialog to update a new Rotation Service
   * @param rotationService
   */
  updateRotationService(rotationService: RotationService): void {
    const dialogRef = this.dialog.open(RotationServiceDialogComponent, {
      maxWidth: '500px',
      width: '80%',
      position: {
        top: '10px',
      },
      data: {
        rotationService,
      },
    });

    dialogRef.afterClosed().subscribe(async () => {
      await this.getRotationServices();
    });
  }

  /**
   * Opens the Delete dialog to confirm the deletion of a new Rotation Service
   * @param _id
   * @param title
   */
  async deleteRotationService(_id: string, title: string): Promise<void> {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: `a ${title}`,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        await this.rotationServicesService.delete(_id);
        await this.getRotationServices();
      }
    });
  }
}
