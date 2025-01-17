#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { MateriaShop_Serverless_Stack } from "../lib/serverless-stack";
import { MateriaShop_CICD_Stack } from "../lib/cicd-stack";
import path = require("path");

const app = new cdk.App();
const serverlessStack = new MateriaShop_Serverless_Stack(
  app,
  "MateriaShop-ServerlessStack",
  {
    projectName: "MateriaShop",
    lambdaHandler: "dist/lambda.handler",
    lambdaZipPath: path.resolve(__dirname, "..", "api-package.zip"),
    env: { account: "706169966278", region: "us-east-1" },
  },
);

new MateriaShop_CICD_Stack(app, "MateriaShop-CICDStack", {
  env: { account: "706169966278", region: "us-east-1" },
  projectName: "MateriaShop",
  serverlessStackName: serverlessStack.serverlessStackName,
  productsTableARN: serverlessStack.productsTableARN,
  paymentsTableARN: serverlessStack.paymentsTableARN,
  usersTableARN: serverlessStack.usersTableARN,
  ordersTableARN: serverlessStack.ordersTableARN,
  apiUrl: serverlessStack.apiUrl,
});
