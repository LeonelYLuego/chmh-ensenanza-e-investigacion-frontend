import { Hospital } from './hospital';
import { Student } from './student';

export interface SocialService {
  _id?: string;
  period: 0 | 1 | 2;
  year: number;
  presentationOfficeDocument?: string;
  reportDocument?: string;
  constancyDocument?: string;
  student: Student | string;
  hospital: Hospital | string;
  __v?: number;
}

export interface SocialServiceBySpecialty {
  _id: string;
  value: string;
  socialServices: SocialService[];
}
