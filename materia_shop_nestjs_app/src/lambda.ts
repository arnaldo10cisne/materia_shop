import {
  Context,
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
} from 'aws-lambda';
import debug from 'debug';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import 'dotenv/config';
import { proxy, createServer } from 'aws-serverless-express';
import { Server } from 'http';
import * as express from 'express';

const verbose = debug('api:verbose: handler');
let cacheServer: Server;

const bootstrapServer = async () => {
  if (!cacheServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST',
    });
    await app.init();
    cacheServer = createServer(expressApp, undefined);
  }

  return cacheServer;
};

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
) => {
  verbose(`EVENT: ${event}`);
  verbose(`CONTEXT: ${context}`);

  cacheServer = await bootstrapServer();
  return proxy(cacheServer, event, context, 'PROMISE').promise;
};
