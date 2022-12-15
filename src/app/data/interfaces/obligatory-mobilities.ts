import { Hospital } from './hospital';
import { RotationService } from './rotation-service';
import { Student } from './student';

export interface ObligatoryMobility {
  _id?: string;

  initialDate: Date;

  finalDate: Date;

  presentationOfficeDocument?: string;

  evaluationDocument?: string;

  rotationService: RotationService | string;

  student: Student | string;

  hospital: Hospital | string;

  __v?: number;
}

export interface ObligatoryMobilityBySpecialty {
  _id: string;

  value: string;

  obligatoryMobilities: ObligatoryMobility[];
}
