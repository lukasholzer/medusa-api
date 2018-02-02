import { DynamoDB } from 'aws-sdk';
import { Callback } from 'aws-lambda';
import { success, failure } from '../libs/response.lib';

export default class Database {

  private _db = new DynamoDB.DocumentClient();

  public async create(params: DynamoDB.DocumentClient.PutItemInput, callback: Callback) {
    try {
      await this.call('put', params);
      callback(null, success(params.Item));
    } catch (e) {
      callback(null, failure({
        status: false,
        error: 'Couldn\'t create Entry.',
        debug: { stackTrace: e, params: params }
      }));
    }
  }

  public async update(params: DynamoDB.DocumentClient.UpdateItemInput, callback: Callback) {
    try {
      const result = await this.call('update', params);
      callback(null, success(result));
    } catch (e) {
      console.log(e);
      callback(null, failure({
        status: false,
        error: `Couldn\'t update Entry with ID: ${params.Key.id}.`,
        debug: { stackTrace: e, params: params }
      }));
    }
  }

  public async delete(params: DynamoDB.DocumentClient.DeleteItemInput, callback: Callback) {
    try {
      await this.call('delete', params);
      callback(null, success({ status: true }));
    } catch (e) {
      callback(null, failure({
        status: false,
        error: 'Couldn\'t delete Entry.',
        debug: { stackTrace: e, params: params }
      }));
    }
  }

  public async get(params: DynamoDB.DocumentClient.GetItemInput, callback: Callback) {
    try {
      const result = await this.call(`get`, params);

      if (result.Item) {
        callback(null, success(result.Item));
      } else {
        callback(null, failure({
          status: false,
          error: `Couldn\'t get Entry ID: ${params.Key.id}.`
        }));
      }
    } catch (e) {
      callback(null, failure({
        status: false,
        debug: { stackTrace: e, params: params }
      }));
    }
  }

  public async list(params: DynamoDB.DocumentClient.ScanInput, callback: Callback) {
    try {
      const result = await this.call('scan', params);
      callback(null, success(result.Items));
    } catch (e) {
      callback(null, failure({
        status: false,
        error: 'Could\'t list all the Entries.',
        debug: { stackTrace: e, params: params }
      }));
    }
  }

  private call(action: string, params: any): Promise<any> {
    return this._db[action](params).promise();
  }
}
