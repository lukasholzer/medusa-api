import { Context, Callback } from 'aws-lambda';
import { success } from '../libs/response.lib';

export async function main(event: any, context: Context, callback: Callback) {

  callback(null, success({ message: 'Create a Project!' }));
}
