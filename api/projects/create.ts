import { Context, Callback } from 'aws-lambda';
import { failure } from '../libs/response.lib';
import Project from '../libs/project.class';
import { validateEventBody } from '../libs/tools';

const project = new Project();

export async function main(event: any, context: Context, callback: Callback) {
  const data: any = validateEventBody(event.body);

  if (typeof data.name !== 'string') {
    callback(null, failure({ status: false, error: 'Could\'t parse the data. JSON Validation Failed!' }));
    return;
  }

  project.create(data, callback);
}
