import { Specialty } from "./specialty";

export interface Student {
  _id?: string;

  code?: string;

  name: string;

  firstLastName: string;

  secondLastName: string;

  specialty: Specialty | string;

  lastYearGeneration: number;

  phones: string[],

  emails: string[];

  __v?: number;
}
