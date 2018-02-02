import { Context, Callback } from 'aws-lambda';
import Customer from '../libs/customer.class';
import { validateEventBody } from '../libs/tools';
import { failure } from '../libs/response.lib';

const customer = new Customer();

export async function main(event: any, context: Context, callback: Callback) {
  const data: any = validateEventBody(event.body);

  if (typeof data.name !== 'string') {
    callback(null, failure({ status: false, error: 'Could\'t parse the data. JSON Validation Failed!' }));
    return;
  }

  customer.create(data, callback);
}
