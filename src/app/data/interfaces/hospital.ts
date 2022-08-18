interface Director {
  name: string;

  position: string;
}

interface Address {
  country: string;

  state: string;

  city: string;

  street: string;
}

export interface Hospital {
  _id?: string;

  name: string;

  acronym?: string;

  director?: Director;

  educationBoss?: string;

  address?: Address;

  phones: string[];

  emails: string[];

  socialService: boolean;

  __v?: number;
}
