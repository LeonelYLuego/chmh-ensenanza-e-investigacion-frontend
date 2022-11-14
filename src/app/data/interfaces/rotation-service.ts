import { Specialty } from './specialty';

export interface RotationService {
  _id?: string;
  specialty: Specialty | string;
  value: string;
  __v?: number;
}
