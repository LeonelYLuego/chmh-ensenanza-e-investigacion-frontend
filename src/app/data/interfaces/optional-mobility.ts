import { Hospital } from './hospital';
import { RotationService } from './rotation-service';
import { Student } from './student';

/** @interface OptionalMobility */
export interface OptionalMobility {
  /** @property */
  _id?: string;

  /** @property */
  initialDate: Date;

  /** @property */
  finalDate: Date;

  /** @property */
  solicitudeDocument?: string;

  /** @property */
  presentationOfficeDocument?: string;

  /** @property */
  acceptanceDocument?: string;

  /** @property */
  evaluationDocument?: string;

  /** @property */
  rotationService: RotationService | string;

  /** @property */
  student: Student | string;

  /** @property */
  hospital: Hospital | string;

  /** @property */
  canceled?: boolean;

  /** @property */
  __v?: number;
}

/** @interface OptionalMobilityBySpecialty */
export interface OptionalMobilityBySpecialtyDto {
  /** @property */
  _id: string;

  /** @property */
  value: string;

  /** @property */
  optionalMobilities: OptionalMobility[];
}
