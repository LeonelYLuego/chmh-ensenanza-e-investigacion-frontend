import { Hospital } from './hospital';
import { RotationService } from './rotation-service';
import { Specialty } from './specialty';

/** Incoming Student */
export interface IncomingStudent {
  /** @property */
  _id?: string;

  /** @property */
  code?: string;

  /** @property */
  name: string;

  /** @property */
  firstLastName: string;

  /** @property */
  secondLastName?: string;

  /** @property */
  phones: string[];

  /** @property */
  emails: string[];

  /** @property */
  initialDate: Date;

  /** @property */
  finalDate: Date;

  /** @property */
  solicitudeDocument?: string;

  /** @property */
  solicitudeVoBo?: boolean;

  /** @property */
  acceptanceDocument?: string;

  /** @property */
  evaluationDocument?: string;

  /** @property */
  incomingSpecialty: Specialty | string;

  /** @property */
  rotationService: RotationService | string;

  /** @property */
  hospital: Hospital | string;

  /** @property */
  canceled?: boolean;

  /** @property */
  __v?: number;
}

/**
 * Incoming Students Interval
 */
export interface IncomingStudentsInterval {
  /** @property */
  initialMonths: { name: string; value: Date }[];

  /** @property */
  finalMonths: { name: string; value: Date }[];
}
