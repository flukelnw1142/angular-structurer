import { IUser } from '../../interfaces/user.interface';

/* --------------------------------- Sign In -------------------------------- */
export type ISignInPayload = {
  username: string;
  password: string;
};
export type ISignInResponse = Omit<IUser, 'roleCode'> & { roleCode: string };
