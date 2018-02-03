import { Context, Callback } from 'aws-lambda';
import Project from '../libs/project.class';

const project = new Project();

export async function main(event: any, context: Context, callback: Callback) {
  project.list(callback);
}
