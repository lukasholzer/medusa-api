import * as uuid from 'uuid/v1';
import { DynamoDB } from 'aws-sdk';
import { Callback } from 'aws-lambda';
import Database from './database.class';

import { IProject } from '../interfaces/project.interface';

interface Item extends IProject {
  createdAt: number;
  updatedAt: number;
}

interface ExpressionAttribute {
  [key: string]: any;
}

export default class Project {

  private static TABLE_NAME = `${process.env.DYNAMODB_TABLE}-projects`;
  private _db = new Database();

  public async create(data: any, callback: Callback) {
    const params = this._generateCreateParams(data);
    this._db.create(params, callback);
  }

  public async get(id: string, callback: Callback) {
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: Project.TABLE_NAME,
      Key: {
        id: id
      }
    };
    this._db.get(params, callback);
  }

  public async list(callback: Callback) {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: Project.TABLE_NAME
    };
    this._db.list(params, callback);
  }


  private _generateCreateParams(data: ExpressionAttribute): DynamoDB.DocumentClient.PutItemInput {
    const timestamp = Date.now();
    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: Project.TABLE_NAME,
      Item: {
        id: `${uuid()}`,
        name: data.name || undefined,
        createdAt: timestamp,
        updatedAt: timestamp
      } as Item
    };

    return params;
  }
}
