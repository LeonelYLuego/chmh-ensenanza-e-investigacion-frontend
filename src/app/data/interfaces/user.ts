/** @interface  */
export interface User {
  /** @property {string} _id User Primary Key */
  _id: string;

  /** @property {string} username */
  username: string;

  /** @property {string?} password */
  password?: string;

  /** @property {boolean} administrator */
  administrator: boolean;
}
