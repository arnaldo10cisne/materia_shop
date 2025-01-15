import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import 'dotenv/config';

interface MateriaShopServerlessStackProps extends cdk.StackProps {
  projectName: string;
  lambdaHandler: string;
  lambdaZipPath: string;
}

export class MateriaShop_Serverless_Stack extends cdk.Stack {
  public readonly serverlessStackName: string;
  public readonly usersTableARN: string;
  public readonly ordersTableARN: string;
  public readonly productsTableARN: string;
  public readonly paymentsTableARN: string;
  constructor(
    scope: Construct,
    id: string,
    props: MateriaShopServerlessStackProps,
  ) {
    super(scope, id, props);

    this.serverlessStackName = this.stackName;
    const projectName = props?.projectName;
    const resourceName = (name: string) => `${projectName}__${name}`;

    const users_table = new dynamodb.Table(this, resourceName("users-table"), {
      tableName: resourceName("users-table"),
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const orders_table = new dynamodb.Table(
      this,
      resourceName("orders-table"),
      {
        tableName: resourceName("orders-table"),
        partitionKey: {
          name: "id",
          type: dynamodb.AttributeType.STRING,
        },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    );

    const products_table = new dynamodb.Table(
      this,
      resourceName("products-table"),
      {
        tableName: resourceName("products-table"),
        partitionKey: {
          name: "id",
          type: dynamodb.AttributeType.STRING,
        },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    );

    const payments_table = new dynamodb.Table(
      this,
      resourceName("payments-table"),
      {
        tableName: resourceName("payments-table"),
        partitionKey: {
          name: "id",
          type: dynamodb.AttributeType.STRING,
        },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    );

    this.usersTableARN = users_table.tableArn;
    this.ordersTableARN = orders_table.tableArn;
    this.productsTableARN = products_table.tableArn;
    this.paymentsTableARN = payments_table.tableArn;

    const lambda_NestjsBackendProxy = new lambda.Function(
      this,
      resourceName("NestjsBackend"),
      {
        functionName: resourceName("NestjsBackend"),
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: props.lambdaHandler,
        code: lambda.Code.fromAsset(props.lambdaZipPath),
        environment: {
          PRODUCTS_TABLE_NAME: products_table.tableName,
          PAYMENTS_TABLE_NAME: payments_table.tableName,
          USERS_TABLE_NAME: users_table.tableName,
          ORDERS_TABLE_NAME: orders_table.tableName,
          WOMPI_SANDBOX_API: process.env.WOMPI_SANDBOX_API!,
          WOMPI_PUBLIC_KEY: process.env.WOMPI_PUBLIC_KEY!,
          WOMPI_PRIVATE_KEY: process.env.WOMPI_PRIVATE_KEY!,
          WOMPI_INTEGRITY_KEY: process.env.WOMPI_INTEGRITY_KEY!,
        },
        timeout: cdk.Duration.minutes(15),
      },
    );

    products_table.grantReadWriteData(lambda_NestjsBackendProxy);
    payments_table.grantReadWriteData(lambda_NestjsBackendProxy);
    users_table.grantReadData(lambda_NestjsBackendProxy);
    orders_table.grantReadWriteData(lambda_NestjsBackendProxy);

    const api = new apigateway.LambdaRestApi(this, resourceName("api"), {
      handler: lambda_NestjsBackendProxy,
      restApiName: resourceName("api"),
      deploy: true,
      proxy: true,
      deployOptions: {
        stageName: "prod",
      },
      integrationOptions: {
        timeout: cdk.Duration.seconds(29),
      },
    });

    lambda_NestjsBackendProxy.addEnvironment("NESTJS_API_ADDRESS", api.url);

    new cdk.CfnOutput(this, resourceName("api-endpoint-url"), {
      value: api.url,
      description: `${projectName} api endpoint to make requests to /products and /payments`,
    });
  }
}
