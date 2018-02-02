import { Context, Callback } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

import * as dynamoDbLib from '../libs/dynamodb.lib';
import { success, failure } from '../libs/response.lib';


export async function main(event: any, context: Context, callback: Callback) {

  const params: DynamoDB.DocumentClient.DeleteItemInput = {
    TableName: `${process.env.DYNAMODB_TABLE}-customers`,
    Key: {
      id: event.pathParameters.id
    }
  };

  try {

    await dynamoDbLib.call('delete', params);
    callback(null, success({ status: true }));
  } catch (e) {
    callback(null, failure({ status: false, error: 'Customer could not be deleted!', debug: e }));
  }
}