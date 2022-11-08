import { Specialty } from './specialty';

/** @interface */
export interface Student {
  /** @property {string} _id Student primary key */
  _id?: string;

  /** @property {string} code */
  code?: string;

  /** @property {string} name */
  name: string;

  /** @property {string} firstLastName */
  firstLastName: string;

  /** @property {string} secondLastName */
  secondLastName?: string | null;

  /** @property {Specialty | string} specialty */
  specialty: Specialty | string;

  /** @property {number} lastYearGeneration */
  lastYearGeneration: number;

  /** @property {string[]} phones */
  phones: string[];

  /** @property {string[]} emails */
  emails: string[];

  __v?: number;
}
