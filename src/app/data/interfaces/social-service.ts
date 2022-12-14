import { Hospital } from './hospital';
import { Student } from './student';

/** @interface SocialService */
export interface SocialService {
  /** @property */
  _id?: string;

  /** @property */
  period: 0 | 1 | 2;

  /** @property */
  year: number;

  /** @property */
  presentationOfficeDocument?: string;

  /** @property */
  reportDocument?: string;

  /** @property */
  constancyDocument?: string;

  /** @property */
  student: Student | string;

  /** @property */
  hospital: Hospital | string;

  /** @property */
  __v?: number;
}

/** @interface SocialServiceBySpecialty */
export interface SocialServiceBySpecialty {
  /** @property */
  _id: string;

  /** @property */
  value: string;

  /** @property */
  socialServices: SocialService[];
}
