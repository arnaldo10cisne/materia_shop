import * as cdk from "aws-cdk-lib";
import * as path from "path";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class MateriaShop_Serverless_Stack extends cdk.Stack {
  public readonly serverlessStackName: string;
  public readonly productsTableARN: string;
  public readonly transactionsTableARN: string;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.serverlessStackName = this.stackName;
    const projectName = "MateriaShop";
    const resourceName = (name: string) => `${projectName}__${name}`;

    const products_table = new dynamodb.Table(
      this,
      resourceName("products-table"),
      {
        tableName: resourceName("products-table"),
        partitionKey: {
          name: "id",
          type: dynamodb.AttributeType.NUMBER,
        },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    );

    const transactions_table = new dynamodb.Table(
      this,
      resourceName("transactions-table"),
      {
        tableName: resourceName("transactions-table"),
        partitionKey: {
          name: "id",
          type: dynamodb.AttributeType.NUMBER,
        },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    );

    this.productsTableARN = products_table.tableArn;
    this.transactionsTableARN = transactions_table.tableArn;

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
          TRANSACTIONS_TABLE_NAME: transactions_table.tableName,
        },
        timeout: cdk.Duration.minutes(15),
      },
    );

    products_table.grantReadData(lambda_NestjsBackendProxy);
    transactions_table.grantReadData(lambda_NestjsBackendProxy);

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

    const apiResource_transactions = api.root.addResource("transactions");
    apiResource_transactions.addMethod("GET");
    apiResource_transactions.addMethod("POST");
    apiResource_transactions.addMethod("PUT");
    apiResource_transactions.addCorsPreflight({
      allowOrigins: ["*"],
      allowMethods: ["GET"],
    });

    new cdk.CfnOutput(this, resourceName("api-endpoint-url"), {
      value: api.url,
      description: `${projectName} api endpoint to make requests to /products and /transactions`,
    });
  }
}
