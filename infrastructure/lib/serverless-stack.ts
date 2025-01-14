import * as cdk from "aws-cdk-lib";
import * as path from "path";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class MateriaShop_Serverless_Stack extends cdk.Stack {
  public readonly serverlessStackName: string;
  public readonly usersTableARN: string;
  public readonly ordersTableARN: string;
  public readonly productsTableARN: string;
  public readonly paymentsTableARN: string;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.serverlessStackName = this.stackName;
    const projectName = "MateriaShop";
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
        handler: "lambda_function.lambda_handler",
        code: lambda.Code.fromAsset(
          path.join(__dirname, "..", "lambda", "NestjsBackend"),
        ),
        environment: {
          PRODUCTS_TABLE_NAME: products_table.tableName,
          PAYMENTS_TABLE_NAME: payments_table.tableName,
          USERS_TABLE_NAME: users_table.tableName,
          ORDERS_TABLE_NAME: orders_table.tableName,
        },
        timeout: cdk.Duration.minutes(15),
      },
    );

    products_table.grantReadData(lambda_NestjsBackendProxy);
    payments_table.grantReadData(lambda_NestjsBackendProxy);
    users_table.grantReadData(lambda_NestjsBackendProxy);
    orders_table.grantReadData(lambda_NestjsBackendProxy);

    const api = new apigateway.LambdaRestApi(this, resourceName("api"), {
      handler: lambda_NestjsBackendProxy,
      integrationOptions: {
        timeout: cdk.Duration.seconds(29),
      },
      proxy: false,
    });

    const apiResource_products = api.root.addResource("products");
    apiResource_products.addMethod("GET");
    apiResource_products.addCorsPreflight({
      allowOrigins: ["*"],
      allowMethods: ["GET"],
    });

    const apiResource_payments = api.root.addResource("payments");
    apiResource_payments.addMethod("GET");
    apiResource_payments.addMethod("POST");
    apiResource_payments.addMethod("PUT");
    apiResource_payments.addCorsPreflight({
      allowOrigins: ["*"],
      allowMethods: ["GET"],
    });

    new cdk.CfnOutput(this, resourceName("api-endpoint-url"), {
      value: api.url,
      description: `${projectName} api endpoint to make requests to /products and /payments`,
    });
  }
}
