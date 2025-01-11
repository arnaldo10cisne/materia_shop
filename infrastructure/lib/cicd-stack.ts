import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codepipeline_actions from "aws-cdk-lib/aws-codepipeline-actions";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53_targets from "aws-cdk-lib/aws-route53-targets";

interface MateriaShopCICDStackProps extends cdk.StackProps {
  serverlessStackName: string;
  productsTableARN: string;
  transactionsTableARN: string;
}

export class MateriaShop_CICD_Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: MateriaShopCICDStackProps) {
    super(scope, id, props);

    const projectName = "MateriaShop";
    const resourceName = (name: string) => `${projectName}__${name}`;

    const deploymentBucket = s3.Bucket.fromBucketArn(
      this,
      resourceName("DeploymentBucket"),
      "arn:aws:s3:::materiashop-deployment",
    );

    const pipeline = new codepipeline.Pipeline(
      this,
      resourceName("CodePipeline"),
      {
        pipelineName: resourceName("CodePipeline"),
      },
    );

    const codeSourceArtifact = new codepipeline.Artifact();
    const codeBuildArtifact = new codepipeline.Artifact();

    const buildProject = new codebuild.PipelineProject(
      this,
      resourceName("CodeBuild"),
      {
        projectName: resourceName("CodeBuild"),
        environment: {
          buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
          computeType: codebuild.ComputeType.SMALL,
        },
        buildSpec: codebuild.BuildSpec.fromObject({
          version: 0.2,
          phases: {
            install: {
              commands: ["npm install"],
            },
            pre_build: {
              commands: [
                // 'node ./scripts/get_config/generateCloudConfig.js',
                "npx prettier --check .",
                "npx eslint . --ext .js,.jsx,.ts,.tsx",
                "npm test -- --watchAll=false",
              ],
            },
            build: {
              commands: ["npm run build"],
            },
            // post_build: {
            //   commands: [
            //     'cd ./scripts/load_data',
            //     'pip install -r requirements.txt',
            //     'python load_data.py',
            //   ],
            // },
          },
          artifacts: {
            "base-directory": "build",
            files: ["**/*"],
          },
        }),
      },
    );

    const serverlessStackName = cdk.Stack.of(this).formatArn({
      service: "cloudformation",
      resource: "stack",
      resourceName: `${props?.serverlessStackName}/*`,
    });

    buildProject.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["cloudformation:DescribeStacks"],
        resources: [serverlessStackName],
      }),
    );

    // if (props) {
    //   buildProject.addToRolePolicy(
    //     new iam.PolicyStatement({
    //       actions: ['dynamodb:PutItem'],
    //       resources: [props.productsTableARN, props.transactionsTableARN],
    //     })
    //   );
    // }

    deploymentBucket.grantReadWrite(buildProject);

    pipeline.addStage({
      stageName: "Source",
      actions: [
        new codepipeline_actions.GitHubSourceAction({
          actionName: "Source",
          owner: "arnaldo10cisne",
          repo: "materia_shop",
          oauthToken: cdk.SecretValue.secretsManager("github_access_token", {
            jsonField: "githubAccessToken",
          }),
          output: codeSourceArtifact,
          branch: "master",
        }),
      ],
    });

    pipeline.addStage({
      stageName: "Build",
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: "CodeBuild",
          project: buildProject,
          input: codeSourceArtifact,
          outputs: [codeBuildArtifact],
        }),
      ],
    });

    pipeline.addStage({
      stageName: "Deploy",
      actions: [
        new codepipeline_actions.S3DeployAction({
          actionName: "S3Deploy",
          input: codeBuildArtifact,
          bucket: deploymentBucket,
        }),
      ],
    });

    const domainName = "arnaldocisneros.com";
    const hostedZone = route53.HostedZone.fromLookup(
      this,
      resourceName("HostedZone"),
      {
        domainName,
      },
    );

    const subDomain = `materia.${domainName}`;
    const certificate = new acm.Certificate(
      this,
      resourceName("SiteCertificate"),
      {
        domainName: subDomain,
        validation: acm.CertificateValidation.fromDns(hostedZone),
        certificateName: resourceName("SiteCertificate"),
      },
    );

    const distribution = new cloudfront.Distribution(
      this,
      resourceName("SiteDistribution"),
      {
        defaultRootObject: "index.html",
        domainNames: [subDomain],
        certificate,
        defaultBehavior: {
          origin: new origins.OriginGroup({
            primaryOrigin:
              origins.S3BucketOrigin.withOriginAccessControl(deploymentBucket),
            fallbackOrigin: new origins.HttpOrigin(subDomain),
            fallbackStatusCodes: [404, 403, 500, 502, 503, 504],
          }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
            ttl: cdk.Duration.minutes(5),
          },
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
            ttl: cdk.Duration.minutes(5),
          },
        ],
        priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      },
    );

    new route53.ARecord(this, resourceName("SiteAliasRecord"), {
      recordName: subDomain,
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(
        new route53_targets.CloudFrontTarget(distribution),
      ),
    });

    const invalidateCacheBuildProject = new codebuild.PipelineProject(
      this,
      resourceName("InvalidateCacheProject"),
      {
        buildSpec: codebuild.BuildSpec.fromObject({
          version: 0.2,
          phases: {
            build: {
              commands: [
                `aws cloudfront create-invalidation --distribution-id ${distribution.distributionId} --paths "/*"`,
              ],
            },
          },
        }),
      },
    );

    invalidateCacheBuildProject.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["cloudfront:CreateInvalidation"],
        resources: [
          `arn:aws:cloudfront::${cdk.Aws.ACCOUNT_ID}:distribution/${distribution.distributionId}`,
        ],
      }),
    );

    pipeline.addStage({
      stageName: "InvalidateCache",
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: "InvalidateCache",
          project: invalidateCacheBuildProject,
          input: codeBuildArtifact,
        }),
      ],
    });

    new cdk.CfnOutput(this, "DeploymentBucketName", {
      value: deploymentBucket.bucketName,
    });

    new cdk.CfnOutput(this, "CloudFrontSubdomainURL", {
      value: `https://${distribution.domainName}`,
      description: "URL for Materia Shop",
    });

    new cdk.CfnOutput(this, "CustomDomainURL", {
      value: `https://${subDomain}`,
      description: "Custom domain URL for Materia Shop",
    });

    new cdk.CfnOutput(this, "ProductsTableARN", {
      value: `${props?.productsTableARN}`,
      description: "Validation of ARN of the Products DynamoDB Table",
    });

    new cdk.CfnOutput(this, "TransactionsTableARN", {
      value: `${props?.transactionsTableARN}`,
      description: "Validation of ARN of the Transactions DynamoDB Table",
    });
  }
}
