import { Hospital } from './hospital';
import { RotationService } from './rotation-service';

export interface IncomingStudent {
  _id?: string;

  code?: string;

  name: string;

  firstLastName: string;

  secondLastName?: string;

  phones: string[];

  emails: string[];

  initialDate: Date;

  finalDate: Date;

  solicitudeDocument?: string;

  solicitudeVoBo?: boolean;

  acceptanceDocument?: string;

  evaluationDocument?: string;

  rotationService: RotationService | string;

  hospital: Hospital | string;

  canceled?: boolean;

  __v?: number;
}
