import { Context, Callback } from 'aws-lambda';
import * as dynamoDbLib from "../libs/dynamodb.lib";
import { success, failure } from "../libs/response.lib";

import { validateEventBody } from '../libs/tools';

export async function update(event: any, context: Context, callback: Callback) {

  const data: any = validateEventBody(event.body);
  data.updatedAt = new Date().getTime();

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-customers`,
    Key: {
      id: event.pathParameters.id
    },
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
    UpdateExpression: 'SET ',
    ReturnValues: 'ALL_NEW'
  };

  const expression = [];
  // generate Update Expression with Attributes from event.body.data Object
  for(const field in data) {
    if (data.hasOwnProperty(field)) {
      params.ExpressionAttributeValues = Object.assign({
        [`:${field}`]: data[field]
          }, params.ExpressionAttributeValues);
  
      expression.push(` #${field} = :${field}`);
      params.ExpressionAttributeNames = Object.assign({
        [`#${field}`]: field
          }, params.ExpressionAttributeNames);
  
      }
  }
  
  params.UpdateExpression += expression.join(', ');

  try {
    const result = await dynamoDbLib.call('update', params);

    callback(null, success(result));
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false, error: `Couldn't update the Customer with the ID: ${event.pathParameters.id}`, debug: e }));
  }
}