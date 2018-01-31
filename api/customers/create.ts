import * as uuid from 'uuid/v1';
import { Handler, Context, Callback } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { AWSError } from 'aws-sdk/lib/error';

import { validateEventBody } from '../libs/tools';
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

    let params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: `${process.env.DYNAMODB_TABLE}-customers`,
      Item: {
        id: `${uuid()}`,
        name: data.name || undefined,
        web: data.web || undefined,
        company: data.company || undefined,
        email: data.email || undefined,
        address: undefined,
        avatar: undefined,
        persons: [],
        uid: data.uid || undefined,
        projects: [],
        createdAt: timestamp,
        updatedAt: timestamp
      } as Item
    };

    if(data.address && typeof data.address === 'object') {

      params.Item.address = {
        street: data.address.street || undefined,
        number: data.address.number || undefined,
        town: data.address.town || undefined,
        zip: data.address.zip || undefined,
        country: data.address.country || undefined,
        countryShort: data.address.countryShort || undefined
      };
    }
    

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