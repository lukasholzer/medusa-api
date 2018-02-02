import { Context, Callback } from 'aws-lambda';
import * as dynamoDbLib from '../libs/dynamodb.lib';
import { success, failure } from '../libs/response.lib';

import { validateEventBody } from '../libs/tools';
import { DynamoDB } from 'aws-sdk';

export async function update(event: any, context: Context, callback: Callback) {

  const data: any = validateEventBody(event.body);
  const remove: boolean = !!(event.queryStringParameters && event.queryStringParameters.remove);
  const params = generateParams(event.pathParameters.id, data, remove);

  try {
    const result = await dynamoDbLib.call('update', params);

    callback(null, success(result));
  } catch (e) {
    console.log(e);
    callback(null, failure({
      status: false,
      error: `Couldn't update the Customer with the ID: ${event.pathParameters.id}`,
      debug: { stackTrace: e, params: params }
    }));
  }
}

function generateParams(
  id: string,
  data: {[key: string]: any },
  remove?: boolean): DynamoDB.DocumentClient.UpdateItemInput {

  const params: DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: `${process.env.DYNAMODB_TABLE}-customers`,
    Key: {
      id: id
    },
    ExpressionAttributeNames: generateExpAttr(data),
    ExpressionAttributeValues: remove ? {} : generateExpAttr(data, true),
    UpdateExpression: remove ? 'REMOVE ' : 'SET ',
    ReturnValues: 'ALL_NEW'
  };

  params.UpdateExpression += generateExp(data, remove);

  // Add a Set part for the updatedAt Timestamp
  if (remove) {
    params.ExpressionAttributeNames = Object.assign(
      { [`#updatedAt`]: 'updatedAt' },
      params.ExpressionAttributeNames);
    params.ExpressionAttributeValues = Object.assign(
      { [':updatedAt']: new Date().getTime() },
      params.ExpressionAttributeValues);
    params.UpdateExpression += ' SET #updatedAt = :updatedAt';
  }

  return params;
}

function generateExp(data: any, remove?: boolean): string {
  const expression: string[] = [];

  for (const field in data) {
    if (data.hasOwnProperty(field)) {

      const _expression = remove ? `#${field}` : ` #${field} = :${field}`;
      expression.push(_expression);
    }
  }

  return expression.join(', ');
}

function generateExpAttr(data: any, values?: boolean) {
  let vals = {};

  for (const field in data) {
    if (data.hasOwnProperty(field)) {

      const obj = (values) ? { [`:${field}`]: data[field] } : { [`#${field}`]: field };
      vals = Object.assign(obj, vals);
    }
  }

  return vals;
}
