import { Hospital } from './hospital';
import { RotationService } from './rotation-service';
import { Student } from './student';

export interface OptionalMobility {
  _id?: string;

  initialDate: Date;

  finalDate: Date;

  solicitudeDocument?: string;

  presentationOfficeDocument?: string;

  acceptanceDocument?: string;

  evaluationDocument?: string;

  rotationService: RotationService | string;

  student: Student | string;

  hospital: Hospital | string;

  __v?: number;
}

export interface OptionalMobilityBySpecialtyDto {
  _id: string;

  value: string;

  optionalMobilities: OptionalMobility[];
}
