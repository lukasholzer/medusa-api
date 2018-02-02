import { Context, Callback } from 'aws-lambda';
import { validateEventBody } from '../libs/tools';
import Customer from '../libs/customer.class';

const customer = new Customer();

export async function main(event: any, context: Context, callback: Callback) {
  const data: any = validateEventBody(event.body);
  const remove: boolean = !!(event.queryStringParameters && event.queryStringParameters.remove);

  customer.update(event.pathParameters.id, data, remove, callback);
}
