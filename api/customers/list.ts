import { Context, Callback } from 'aws-lambda';
import Customer from '../libs/customer.class';

const customer = new Customer();

export async function list(event: any, context: Context, callback: Callback) {
  customer.list(callback);
}
