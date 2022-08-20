/** @interface */
interface Director {
  /** @property {string} name */
  name: string;

  /** @property {string} position */
  position: string;
}

/** @interface */
interface Address {
  /** @property {string} country */
  country: string;

  /** @property {string} state */
  state: string;

  /** @property {string} city */
  city: string;

  /** @property {string} street */
  street: string;
}

export interface Hospital {
  /** @property {string} _id Hospital primary key */
  _id?: string;

  /** @property {string} name */
  name: string;

  /** @property {string} acronym */
  acronym?: string;

  /** @property {Director} director */
  director?: Director;

  /** @property {string} educationBoss */
  educationBoss?: string;

  /** @property {Address} address */
  address?: Address;

  /** @property {string[]} phones */
  phones: string[];

  /** @property {string[]} emails */
  emails: string[];

  /** @property {boolean} socialService */
  socialService: boolean;

  /** @property {number} __v */
  __v?: number;
}
