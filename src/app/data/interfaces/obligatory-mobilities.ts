import { Hospital } from './hospital';
import { RotationService } from './rotation-service';
import { Specialty } from './specialty';
import { Student } from './student';

/** Obligatory Mobility */
export interface ObligatoryMobility {
  /** @property */
  _id?: string;

  /** @property */
  initialDate: Date;

  /** @property */
  finalDate: Date;

  /** @property */
  presentationOfficeDocument?: string;

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

/** Obligatory Mobility Response */
export interface ObligatoryMobilityResponse {
  /** @property */
  _id?: string;

  /** @property */
  initialDate: Date;

  /** @property */
  finalDate: Date;

  /** @property */
  solicitudeDocument: string[];

  /** @property */
  acceptanceDocument: string[];

  /** @property */
  presentationOfficeDocument?: string;

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

/** Obligatory Mobility by Hospital */
export interface ObligatoryMobilityByHospital {
  /** @property */
  _id: string;

  /** @property */
  name: string;

  /** @property */
  obligatoryMobilities: ObligatoryMobilityResponse[];
}

/** Obligatory Mobility by Student */
export interface ObligatoryMobilityByStudent {
  /** @property */
  _id: string;

  /** @property */
  name: string;

  /** @property */
  firstLastName: string;

  /** @property */
  secondLastName: string;

  /** @property */
  obligatoryMobilities: ObligatoryMobilityResponse[];
}

/** Obligatory Mobility Interval */
export interface ObligatoryMobilityInterval {
  /** @property */
  initialMonths: { name: string; value: Date }[];

  /** @property */
  finalMonths: { name: string; value: Date }[];
}

/** Attachments Obligatory Mobility Response */
export interface AttachmentsObligatoryMobilityResponse {
  /** @property */
  _id: string;

  /** @property */
  initialDate: Date;

  /** @property */
  finalDate: Date;

  /** @property */
  hospital: Hospital | string;

  /** @property */
  specialty: Specialty | string;

  /** @property */
  solicitudeDocument?: string;

  /** @property */
  acceptanceDocument?: string;

  /** @property */
  obligatoryMobilities: ObligatoryMobility[];
}
