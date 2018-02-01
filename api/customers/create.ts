import * as uuid from 'uuid/v1';
import { Context, Callback } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

import * as dynamoDbLib from '../libs/dynamodb.lib';
import { success, failure } from "../libs/response.lib";
import { validateEventBody } from '../libs/tools';

import { ICustomer } from '../interfaces/customer.interface';

interface Item extends ICustomer {
  createdAt: number;
  updatedAt: number;
}

export async function create(event: any, context: Context, callback: Callback) {

    const timestamp = new Date().getTime();
    const data: any = validateEventBody(event.body);

    if(typeof data.name !== 'string') {
      callback(null, failure({ status: false, error: 'Could\'t parse the data. JSON Validation Failed!' }));
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

    try {
      await dynamoDbLib.call('put', params);
      callback(null, success(params.Item));
    } catch (e) {
      callback(null, failure({ status: false, error: 'Could\'t create the new Customer.' }));
    }
}