import { Hospital } from './hospital';
import { RotationService } from './rotation-service';
import { Student } from './student';

export interface ObligatoryMobility {
  _id?: string;

  date: Date;

  presentationOfficeDocument?: string;

  evaluationDocument?: string;

  rotationService: RotationService | string;

  student: Student | string;

  hospital: Hospital | string;

  __v?: number;
}

export interface ObligatoryMobilityByHospital {
  _id: string;

  name: string;

  specialties: ObligatoryMobilityBySpecialty[];
}

interface ObligatoryMobilityBySpecialty {
  _id: string;

  value: string;

  obligatoryMobilities: ObligatoryMobility[];
}

export interface ObligatoryMobilityInterval {
  initialMonths: { name: string; value: Date }[];

  finalMonths: { name: string; value: Date }[];
}
