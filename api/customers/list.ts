import { Handler, Context, Callback } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { AWSError } from 'aws-sdk/lib/error';

import { IDynamoDbParams } from '../interfaces/dynamodb.interface';
import { IResponse } from '../interfaces/aws.interface';


const dB = new DynamoDB.DocumentClient();


const list: Handler = (event: any, context: Context, callback: Callback) => {

    const params: IDynamoDbParams = {
      TableName: `${process.env.DYNAMODB_TABLE}-customers`
    }
    

    dB.scan(params,  (error: AWSError, result) => {
      if(error) {
        console.error(error);
        callback(new Error('Could\'t list all the customers.'));
        return;
      }

      const response: IResponse = {
        statusCode: 200,
        body: JSON.stringify(result)
      };

      callback(null, response);

    });
}

export { list };