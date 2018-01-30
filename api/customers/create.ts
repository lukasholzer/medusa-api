import * as uuid from 'uuid/v1';
import { Handler, Context, Callback } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

import { validateEventBody } from '../utils/tools';
import ICustomer from '../interfaces/customer.interface';
import { AWSError } from 'aws-sdk/lib/error';


const dB = new DynamoDB.DocumentClient();

interface Params {
  TableName: string;
  Item: Item;
}

interface Item extends ICustomer {
  createdAt: number;
  updatedAt: number;
}

interface Response {
  statusCode: number;
  body: any;
}

const create: Handler = (event: any, context: Context, callback: Callback) => {

    const timestamp = new Date().getTime();
    const data: any = validateEventBody(event.body);

    if(typeof data.name !== 'string') {
      console.error('Validation Failed');
      callback(new Error('Could\'t parse the data!'));
      return;
    }

    const params: Params = {
      TableName: `${process.env.DYNAMODB_TABLE}-customers`,
      Item: {
        id: `${uuid()}`,
        name: data.name as string,
        createdAt: timestamp,
        updatedAt: timestamp
      } as Item
    };
    

    dB.put(params, (error: AWSError, result) => {
      if(error) {
        console.error(error);
        callback(new Error('Could\'t create the new Customer.'));
        return;
      }

      const response: Response = {
        statusCode: 200,
        body: JSON.stringify(result)
      };

      callback(null, response);

    });
}

export { create };