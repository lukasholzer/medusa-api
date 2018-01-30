import * as uuid from 'uuid';
import { DynamoDB } from 'aws-sdk';

import ICustomer from '../interfaces/customer.interface';
import { Error } from 'aws-sdk/clients/mq';
import { AWSError } from 'aws-sdk/lib/error';
import { PutItemOutput } from 'aws-sdk/clients/dynamodb';


const dB = new DynamoDB.DocumentClient();

interface Item extends ICustomer {
  createdAt: number;
  updatedAt: number;
}

export function create(event, context, callback) {

    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body)

    if(typeof data.name !== 'string') {
      console.error('Validation Failed');
      callback(new Error('Could\'t parse the data!'));
      return;
    }

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: uuid.v1() as string,
        name: data.name,
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

      const response = {
        statusCode: 200,
        body: JSON.stringify(result)
      };
      
      callback(null, response);

    });
}