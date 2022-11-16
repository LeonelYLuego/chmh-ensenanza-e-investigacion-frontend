import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Hospital,
  RotationService,
  Specialty,
  Student,
} from '@data/interfaces';
import {
  HospitalsService,
  RotationServicesService,
  SpecialtiesService,
  StudentsService,
} from '@data/services';

@Component({
  selector: 'app-add-optional-mobility',
  templateUrl: './add-optional-mobility.component.html',
  styleUrls: ['./add-optional-mobility.component.css'],
})
export class AddOptionalMobilityComponent implements OnInit {
  loading = false;
  optionalMobilityFormControl = new FormGroup({
    specialty: new FormControl<undefined | string>(undefined, [
      Validators.required,
    ]),
    generation: new FormControl<undefined | number>(
      { value: undefined, disabled: true },
      [Validators.required]
    ),
    student: new FormControl<undefined | string>(
      { value: undefined, disabled: true },
      [Validators.required]
    ),
    initialDate: new FormControl<undefined | Date>(undefined, [
      Validators.required,
    ]),
    finalDate: new FormControl<undefined | Date>(undefined, [
      Validators.required,
    ]),
    hospital: new FormControl<undefined | string>(undefined, [
      Validators.required,
    ]),
    rotationService: new FormControl<undefined | string>(
      { value: undefined, disabled: true },
      [Validators.required]
    ),
  });
  specialties: Specialty[] = [];
  generations: { name: string; value: number }[] = [];
  students: Student[] = [];
  hospitals: Hospital[] = [];
  rotationServices: RotationService[] = [];

  constructor(
    private specialtiesServices: SpecialtiesService,
    private rotationServicesService: RotationServicesService,
    private studentsService: StudentsService,
    private hospitalsService: HospitalsService
  ) {}

  async ngOnInit(): Promise<void> {
    this.specialties = await this.specialtiesServices.findAll();
    this.hospitals = await this.hospitalsService.getAll();
  }

  async specialtyChanged(): Promise<void> {
    if (this.optionalMobilityFormControl.controls.specialty.valid) {
      this.generations = await this.specialtiesServices.getGenerations(
        this.optionalMobilityFormControl.controls.specialty.value!
      );
      this.rotationServices = await this.rotationServicesService.getAll(
        this.optionalMobilityFormControl.controls.specialty.value!
      );
      this.optionalMobilityFormControl.controls.generation.setValue(undefined);
      this.optionalMobilityFormControl.controls.generation.enable();
      this.optionalMobilityFormControl.controls.rotationService.setValue(
        undefined
      );
      this.optionalMobilityFormControl.controls.rotationService.enable();
      await this.generationChanged();
    }
  }

  async generationChanged(): Promise<void> {
    if (this.optionalMobilityFormControl.controls.generation.valid) {
      this.students = await this.studentsService.getAll(
        this.optionalMobilityFormControl.controls.specialty.value!,
        this.optionalMobilityFormControl.controls.generation.value!
      );
      this.optionalMobilityFormControl.controls.student.setValue(undefined);
      this.optionalMobilityFormControl.controls.student.enable();
    } else {
      this.optionalMobilityFormControl.controls.student.setValue(undefined);
      this.optionalMobilityFormControl.controls.student.disable();
    }
  }

  async addOptionalMobility(): Promise<void> {
    if (this.optionalMobilityFormControl.valid) {
      const value = this.optionalMobilityFormControl.value;
      console.log(value);
    }
  }
}
