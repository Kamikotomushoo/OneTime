export interface IUserData {
  id?: number;
  firstName?: string;
  secondName?: string;
  email?: string;
  password?: string;
  passwordId?: number;
}

export interface IPassword {
  id: number;
  passwordHash: string;
}
