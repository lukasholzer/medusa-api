import { Context, Callback } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

import * as dynamoDbLib from '../libs/dynamodb.lib';
import { success, failure } from "../libs/response.lib";


export async function get(event: any, context: Context, callback: Callback) {

    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: `${process.env.DYNAMODB_TABLE}-customers`,
      Key: {
        id: event.pathParameters.id
      }
    }

    try {
      const result = await dynamoDbLib.call('get', params);

      if (result.Item) {
        callback(null, success(result.Item));
      } else {
        callback(null, failure({ status: false, error: `Customer Item with ID: ${event.pathParameters.id} not found.` }));
      }
    } catch (e) {
      callback(null, failure({ status: false }));
    }
}