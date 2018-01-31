import { IResponse } from '../interfaces/aws.interface';

interface IErrorObject {
  status: boolean;
  error?: String;
}

export function success(body: Object) {
  return buildResponse(200, body);
}

export function failure(body: IErrorObject) {
  return buildResponse(500, body);
}

function buildResponse(statusCode: number, body: Object): IResponse {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(body)
  };
}