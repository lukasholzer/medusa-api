import { Context, Callback } from 'aws-lambda';
import Projcet from '../libs/project.class';

const project = new Projcet();

export async function main(event: any, context: Context, callback: Callback) {
  project.get(event.pathParameters.id, callback);
}
