/** @interface */
export interface Specialty {
  /** @property {string} _id */
  _id?: string;

  /** @property {string} value */
  value: string;

  /** @property {number} duration */
  duration: number;

  headOfDepartment: string;

  headOfDepartmentPosition: string;

  /** @property {string} tenuredPostgraduateProfessor */
  tenuredPostgraduateProfessor: string;

  /** @property {string} headOfService */
  headOfService: string;

  __v?: number;
}
