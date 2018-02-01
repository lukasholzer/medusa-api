import { Context, Callback } from 'aws-lambda';
import * as dynamoDbLib from "../libs/dynamodb.lib";
import { success, failure } from "../libs/response.lib";

import { validateEventBody } from '../libs/tools';

export async function update(event: any, context: Context, callback: Callback) {

  const data: any = validateEventBody(event.body);

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-customers`,
    Key: {
      id: event.pathParameters.id
    },
    UpdateExpression: `SET 
    #N = :name, 
    web = :web, 
    #UID = :uid`,
    ExpressionAttributeValues: {
      ":name": data.name || null,
      ":web": data.web || null,
      ":uid": data.uid || null
      // ":company": data.company || null,
      // ":email": data.email || null,
      // ":uid": data.uid || null,
      // ":updatedAt": new Date().getTime()
    },
    ExpressionAttributeNames: {
      "#N": "name",
      "#UID": "uid"
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
    const result = await dynamoDbLib.call('update', params);

    callback(null, success(result));
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false, error: `Couldn't update the Customer with the ID: ${event.pathParameters.id}`, debug: e }));
  }
}