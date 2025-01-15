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
    /* If you don't specify 'env', this stack will be environment-agnostic.
     * Account/Region-dependent features and context lookups will not work,
     * but a single synthesized template can be deployed anywhere. */
    /* Uncomment the next line to specialize this stack for the AWS Account
     * and Region that are implied by the current CLI configuration. */
    // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
    /* Uncomment the next line if you know exactly what Account and Region you
     * want to deploy the stack to. */

    projectName: "MateriaShop",
    lambdaHandler: "dist/lambda.handler",
    lambdaZipPath: path.resolve(__dirname, "..", "api-package.zip"),
    env: { account: "706169966278", region: "us-east-1" },
    /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
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
});
