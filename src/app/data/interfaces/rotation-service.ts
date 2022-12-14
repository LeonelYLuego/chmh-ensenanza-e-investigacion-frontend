import { Specialty } from './specialty';

/** @interface RotationService */
export interface RotationService {
  /** @property */
  _id?: string;

  /** @property */
  specialty: Specialty | string;

  /** @property */
  value: string;

  /** @property */
  __v?: number;
}
