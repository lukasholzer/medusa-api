export interface ICustomer {
  id: string;
  name: string;
  company: boolean;
  web?: string;
  email?: string;
  avatar?: string;
  persons?: ICustomerEmployees[];
  uid?: string;
  address?: ICustomerAddress;
  projects?: ICustomerProjects[];
}

export interface ICustomerEmployees {
  id: string;
}

export interface ICustomerAddress {
  street: string;
  number: string;
  town: string;
  zip: number;
  country: string;
  countryShort: string;
}

export interface ICustomerProjects {
  id: string;
  name: string;
}

