import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NameValueInterface } from '@core/interfaces';
import { Hospital, Specialty, Student } from '@data/interfaces';
import {
  HospitalsService,
  SocialServicesService,
  SpecialtiesService,
  StudentsService,
} from '@data/services';

interface SocialServiceFormControlInterface {
  student: FormControl<string | null>;
  hospital: FormControl<string | null>;
  period: FormControl<0 | 1 | 2 | null>;
  year: FormControl<number | null>;
}

/** Add Social Service component */
@Component({
  selector: 'app-add-social-services',
  templateUrl: './add-social-services.component.html',
  styleUrls: ['./add-social-services.component.css'],
})
export class AddSocialServicesComponent implements OnInit {
  loading = false;
  specialties: Specialty[] = [];
  generations: NameValueInterface<number>[] = [];
  singlePeriods: NameValueInterface<number>[] = [];
  students: Student[] = [];
  hospitals: Hospital[] = [];
  specialtyFormControl = new FormControl<string | null>(null);
  generationFormControl = new FormControl<number | null>({
    disabled: true,
    value: null,
  });
  socialServiceFormControls: FormArray<
    FormGroup<SocialServiceFormControlInterface>
  > = new FormArray<FormGroup<SocialServiceFormControlInterface>>([]);

  constructor(
    private socialServicesService: SocialServicesService,
    private specialtiesService: SpecialtiesService,
    private studentsService: StudentsService,
    private hospitalsService: HospitalsService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.specialties = await this.specialtiesService.findAll();
    this.hospitals = await this.hospitalsService.getSocialServices();
    this.singlePeriods = this.socialServicesService.getSinglePeriods();
  }

  /**
   * Gets all student from a specialty and generation
   */
  async getStudents(specialty: string, generation: number): Promise<void> {
    this.loading = true;
    this.socialServiceFormControls.clear();
    this.students = await this.studentsService.getAll(specialty, generation);
    this.addStudent();
    this.loading = false;
  }

  /**
   * Clears students when specialty changes
   */
  async specialtyValueChange() {
    this.socialServiceFormControls.clear();
    this.students = [];
    this.generationFormControl.setValue(null);
    this.generations = await this.specialtiesService.getGenerations(
      this.specialtyFormControl.value!
    );
    this.generationFormControl.enable();
  }

  /**
   * Finds students when filter changes
   */
  async filterChange(): Promise<void> {
    const specialty = this.specialtyFormControl.value;
    const generation = this.generationFormControl.value;
    if (specialty && generation) {
      this.getStudents(specialty, generation);
    }
  }

  /**
   * Adds a new Student form to the Social Services array
   */
  addStudent(): void {
    this.socialServiceFormControls.push(
      new FormGroup({
        student: new FormControl<string | null>(null, [Validators.required]),
        hospital: new FormControl<string | null>(null, [Validators.required]),
        period: new FormControl<0 | 1 | 2 | null>(null, [
          Validators.required,
          Validators.min(0),
          Validators.max(2),
        ]),
        year: new FormControl<number | null>(null, [
          Validators.required,
          Validators.min(1990),
          Validators.max(2100),
        ]),
      })
    );
  }

  /**
   * Removes a Student form from the Social Services array
   * @param index
   */
  removeStudent(index: number): void {
    this.socialServiceFormControls.removeAt(index);
  }

  /**
   * Adds Social Services array to the server
   */
  async addSocialServices(): Promise<void> {
    if (this.socialServiceFormControls.valid) {
      await Promise.all(
        this.socialServiceFormControls.value.map(async (value) => {
          await this.socialServicesService.add({
            hospital: value.hospital!,
            period: value.period!,
            student: value.student!,
            year: +value.year!,
          });
        })
      );
      this.router.navigate(['..']);
    }
  }
}
