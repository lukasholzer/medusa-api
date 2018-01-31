import { DynamoDB } from 'aws-sdk';

export function call(action: string, params: any) {
  const db = new DynamoDB.DocumentClient();

  return db[action](params).promise();
}