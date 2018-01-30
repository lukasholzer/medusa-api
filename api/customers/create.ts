import * as uuid from 'uuid/v1';
import { Handler, Context, Callback } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { AWSError } from 'aws-sdk/lib/error';

import { validateEventBody } from '../utils/tools';
import { ICustomer } from '../interfaces/customer.interface';
import { IResponse } from '../interfaces/aws.interface';


const dB = new DynamoDB.DocumentClient();

interface Item extends ICustomer {
  createdAt: number;
  updatedAt: number;
}

const create: Handler = (event: any, context: Context, callback: Callback) => {

    const timestamp = new Date().getTime();
    const data: any = validateEventBody(event.body);

    if(typeof data.name !== 'string') {
      console.error('Validation Failed');
      callback(new Error('Could\'t parse the data!'));
      return;
    }

    const params: DynamoDB.DocumentClient.PutItemInput = {
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

      const response: IResponse = {
        statusCode: 200,
        body: JSON.stringify(result)
      };

      callback(null, response);

    });
}

export { create };