import { Context, Callback } from 'aws-lambda';
import Customer from '../libs/customer.class';

const customer = new Customer();

export async function main(event: any, context: Context, callback: Callback) {
  customer.get(event.pathParameters.id, callback);
}
