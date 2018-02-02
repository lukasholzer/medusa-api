import * as uuid from 'uuid/v1';
import { Callback } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import Database from './database.class';
import { ICustomer } from '../interfaces/customer.interface';

interface Item extends ICustomer {
  createdAt: number;
  updatedAt: number;
}

interface ExpressionAttribute {
  [key: string]: any;
}

export default class Customer {

  private static TABLE_NAME = `${process.env.DYNAMODB_TABLE}-customers`;
  private _db = new Database();

  public async create(data: any, callback: Callback) {
    const params = this._generateCreateParams(data);
    this._db.create(params, callback);
  }

  public async get(id: string, callback: Callback) {
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: Customer.TABLE_NAME,
      Key: {
        id: id
      }
    };
    this._db.get(params, callback);
  }

  public async list(callback: Callback) {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: Customer.TABLE_NAME
    };
    this._db.list(params, callback);
  }

  public async update(id: string, data: any, remove: boolean, callback: Callback) {
    const params = this._generateUpdateParams(id, data, remove);
    this._db.update(params, callback);
  }

  public async delete(id: string, callback: Callback) {
    const params: DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: Customer.TABLE_NAME,
      Key: {
        id: id
      }
    };
    this._db.delete(params, callback);
  }

  private _generateUpdateParams(
    id: string,
    data: ExpressionAttribute,
    remove?: boolean): DynamoDB.DocumentClient.UpdateItemInput {

    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: Customer.TABLE_NAME,
      Key: {
        id: id
      },
      ExpressionAttributeNames: this._generateExpAttr(data),
      ExpressionAttributeValues: remove ? {} : this._generateExpAttr(data, true),
      UpdateExpression: remove ? 'REMOVE ' : 'SET ',
      ReturnValues: 'ALL_NEW'
    };

    params.UpdateExpression += this._generateExp(data, remove);

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

  private _generateExp(data: any, remove?: boolean): string {
    const expression: string[] = [];

    for (const field in data) {
      if (data.hasOwnProperty(field)) {

        const _expression = remove ? `#${field}` : ` #${field} = :${field}`;
        expression.push(_expression);
      }
    }

    return expression.join(', ');
  }

  private _generateExpAttr(data: any, values?: boolean): ExpressionAttribute {
    let vals = {};

    for (const field in data) {
      if (data.hasOwnProperty(field)) {
        const obj = (values) ? { [`:${field}`]: data[field] } : { [`#${field}`]: field };
        vals = Object.assign(obj, vals);
      }
    }

    return vals;
  }

  private _generateCreateParams(data: ExpressionAttribute): DynamoDB.DocumentClient.PutItemInput {
    const timestamp = Date.now();
    let params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: Customer.TABLE_NAME,
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

    if (data.address && typeof data.address === 'object') {

      params.Item.address = {
        street: data.address.street || undefined,
        number: data.address.number || undefined,
        town: data.address.town || undefined,
        zip: data.address.zip || undefined,
        country: data.address.country || undefined,
        countryShort: data.address.countryShort || undefined
      };
    }

    return params;
  }
}
