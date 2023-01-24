import { Hospital } from './hospital';
import { RotationService } from './rotation-service';
import { Specialty } from './specialty';
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

  canceled?: boolean;

  __v?: number;
}

export interface ObligatoryMobilityByHospital {
  _id: string;

  name: string;

  obligatoryMobilities: ObligatoryMobility[];
}

export interface ObligatoryMobilityByStudent {
  _id: string;

  name: string;

  firstLastName: string;

  secondLastName: string;

  obligatoryMobilities: ObligatoryMobility[];
}

export interface ObligatoryMobilityInterval {
  initialMonths: { name: string; value: Date }[];

  finalMonths: { name: string; value: Date }[];
}

export interface AttachmentsObligatoryMobilityResponse {
  _id: string;

  initialDate: Date;

  finalDate: Date;

  hospital: Hospital | string;

  specialty: Specialty | string;

  solicitudeDocument?: string;

  acceptanceDocument?: string;

  obligatoryMobilities: ObligatoryMobility[];
}
