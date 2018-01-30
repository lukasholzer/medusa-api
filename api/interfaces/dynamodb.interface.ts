import ICustomer from './customer.interface';

export interface IDynamoDbParams {
  TableName: string;
  Item?: IDynamoDbCustomer;
}

interface IDynamoDbCustomer extends ICustomer {
  createdAt: number;
  updatedAt: number;
}
