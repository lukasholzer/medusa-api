import { Context, Callback } from 'aws-lambda';
import * as dynamoDbLib from "../libs/dynamodb.lib";
import { success, failure } from "../libs/response.lib";

import { validateEventBody } from '../libs/tools';

export async function update(event: any, context: Context, callback: Callback) {

  const timestamp = new Date().getTime();
  const data: any = validateEventBody(event.body);

  const params = {
    TableName: "notes",
    // 'Key' defines the partition key and sort key of the item to be updated
    Key: {
      id: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET #N = :name, web = :web, updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":name": data.name || null,
      ":web": data.web || null,
      ":company": data.company || null,
      ":email": data.email || null,
      ":uid": data.uid || null,
      ":updatedAt": new Date().getTime
    },
    ExpressionAttributeNames: {
      "#N": "name"
    }, 
    ReturnValues: "ALL_NEW"
  };

  // id: `${uuid()}`,
  // name: data.name || undefined,
  // web: data.web || undefined,
  // company: data.company || undefined,
  // email: data.email || undefined,
  // address: undefined,
  // avatar: undefined,
  // persons: [],
  // uid: data.uid || undefined,
  // projects: [],
  // createdAt: timestamp,
  // updatedAt: timestamp

  try {
    await dynamoDbLib.call('update', params);

    callback(null, success({ status: true }));
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false, error: `Couldn't update the Customer with the ID: ${event.pathParameters.id}`, debug: e }));
  }
}