import { IAddress } from './customer.interface';

export interface IUser {
  id: string;
  name: string;
  company: boolean;
  web?: string;
  email?: string;
  avatar?: string;
  uid?: string;
  address?: IAddress;
  taxNumber?: number;
  bank: IBankData;
}

export interface IBankData {
  iban: number;
  bic: number;
}
