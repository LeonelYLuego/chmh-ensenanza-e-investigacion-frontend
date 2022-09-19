import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NameValueInterface } from '@app/core/interfaces/name-value.interface';
import { Hospital } from '@app/data/interfaces/hospital';
import { Specialty } from '@app/data/interfaces/specialty';
import { Student } from '@app/data/interfaces/student';
import { HospitalsService } from '@app/data/services/hospitals.service';
import { SocialServicesService } from '@app/data/services/social-services.service';
import { SpecialtiesService } from '@app/data/services/specialties.service';
import { StudentsService } from '@app/data/services/students.service';

interface SocialServiceFormControlInterface {
  student: FormControl<string | null>;
  hospital: FormControl<string | null>;
  period: FormControl<number | null>;
  year: FormControl<number | null>;
}

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
    private hospitalsService: HospitalsService
  ) {}

  async ngOnInit(): Promise<void> {
    this.specialties = await this.specialtiesService.getSpecialties();
    this.hospitals = await this.hospitalsService.getSocialServiceHospitals();
    this.singlePeriods = this.socialServicesService.getSinglePeriods();
  }

  async getStudents(specialty: string, generation: number): Promise<void> {
    this.loading = true;
    this.socialServiceFormControls.clear();
    this.students = await this.studentsService.getStudents(
      specialty,
      generation
    );
    this.addStudent();
    this.loading = false;
  }

  async specialtyValueChange() {
    this.socialServiceFormControls.clear();
    this.students = [];
    this.generationFormControl.setValue(null);
    this.generations = await this.specialtiesService.getGenerations(
      this.specialtyFormControl.value!
    );
    this.generationFormControl.enable();
  }

  async filterChange(): Promise<void> {
    const specialty = this.specialtyFormControl.value;
    const generation = this.generationFormControl.value;
    if (specialty && generation) {
      this.getStudents(specialty, generation);
    }
  }

  addStudent(): void {
    this.socialServiceFormControls.push(
      new FormGroup({
        student: new FormControl<string | null>(null, [Validators.required]),
        hospital: new FormControl<string | null>(null, [Validators.required]),
        period: new FormControl<number | null>(null, [
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

  removeStudent(index: number): void {
    this.socialServiceFormControls.removeAt(index);
  }
}
