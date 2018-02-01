import { Context, Callback } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

import * as dynamoDbLib from '../libs/dynamodb.lib';
import { success, failure } from "../libs/response.lib";

export async function list(event: any, context: Context, callback: Callback) {

    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: `${process.env.DYNAMODB_TABLE}-customers`
    }
    
    try {
      const result = await dynamoDbLib.call('scan', params);

      callback(null, success(result.Items));
    } catch (e) {
      callback(null, failure({ status: false, error: 'Could\'t list all the customers.' }));
    }

}