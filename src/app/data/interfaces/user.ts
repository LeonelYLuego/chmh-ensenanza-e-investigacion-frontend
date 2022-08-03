export interface User {
  _id: string;
  username: string;
  password?: string,
  administrator: boolean;
}
