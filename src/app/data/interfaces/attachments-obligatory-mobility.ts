import { Hospital } from './hospital';
import { Specialty } from './specialty';

/**
 * Attachments Obligatory Mobility
 */
export interface AttachmentsObligatoryMobility {
  /** @property */
  _id?: string;

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
  __v?: number;
}

/**
 * Attachments Obligatory Mobility by Hospital
 */
export interface AttachmentsObligatoryMobilityByHospital {
  /** @property */
  _id: string;

  /** @property */
  name: string;

  /** @property */
  attachmentsObligatoryMobilities: AttachmentsObligatoryMobility[];
}
