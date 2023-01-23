import { Hospital } from './hospital';
import { Specialty } from './specialty';

export interface AttachmentsObligatoryMobility {
  _id?: string;

  initialDate: Date;

  finalDate: Date;

  hospital: Hospital | string;

  specialty: Specialty | string;

  solicitudeDocument?: string;

  acceptanceDocument?: string;

  __v?: number;
}

export interface AttachmentsObligatoryMobilityByHospital {
  _id: string;

  name: string;

  attachmentsObligatoryMobilities: AttachmentsObligatoryMobility[];
}
