import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as kms from "aws-cdk-lib/aws-kms";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as logs from "aws-cdk-lib/aws-logs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as apigwv2Auth from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as budgets from "aws-cdk-lib/aws-budgets";
import * as iam from "aws-cdk-lib/aws-iam";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { createStagePortTables } from "./stageport-tables";

export class StagePortStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps & { stage: string }) {
    super(scope, id, props);

    const stage = props.stage;

    const dataKey = new kms.Key(this, "StagePortDataKey", {
      alias: `alias/stageport-${stage}`,
      enableKeyRotation: true
    });

    const mediaBucket = new s3.Bucket(this, "MediaBucket", {
      bucketName: `${this.account}-${this.region}-stageport-media-${stage}`.toLowerCase(),
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: dataKey,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      versioned: true
    });

    const receiptsBucket = new s3.Bucket(this, "ReceiptsBucket", {
      bucketName: `${this.account}-${this.region}-stageport-receipts-${stage}`.toLowerCase(),
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: dataKey,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      versioned: true,
      lifecycleRules: [
        {
          abortIncompleteMultipartUploadAfter: cdk.Duration.days(7)
        }
      ]
    });

    const { sessions, primitives, stateTransitions, scores, receipts, auditLog } =
      createStagePortTables(this, dataKey);

    const userPool = new cognito.UserPool(this, "UserPool", {
      selfSignUpEnabled: false,
      signInAliases: { email: true },
      standardAttributes: {
        email: { required: true, mutable: false }
      },
      passwordPolicy: {
        minLength: 14,
        requireDigits: true,
        requireLowercase: true,
        requireUppercase: true,
        requireSymbols: true
      }
    });

    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      generateSecret: false,
      authFlows: {
        userPassword: true,
        userSrp: true
      }
    });

    new cognito.CfnUserPoolGroup(this, "AdminGroup", {
      userPoolId: userPool.userPoolId,
      groupName: "Admin"
    });

    new cognito.CfnUserPoolGroup(this, "ReviewerGroup", {
      userPoolId: userPool.userPoolId,
      groupName: "Reviewer"
    });

    new cognito.CfnUserPoolGroup(this, "OperatorGroup", {
      userPoolId: userPool.userPoolId,
      groupName: "Operator"
    });

    const apiFn = new lambda.Function(this, "StagePortApiFn", {
      functionName: `stageport-api-${stage}`,
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../services/api/dist"),
      timeout: cdk.Duration.seconds(20),
      memorySize: 1024,
      tracing: lambda.Tracing.ACTIVE,
      reservedConcurrentExecutions: 10,
      logRetention: logs.RetentionDays.THREE_MONTHS,
      environment: {
        STAGE: stage,
        SESSIONS_TABLE: sessions.tableName,
        PRIMITIVES_TABLE: primitives.tableName,
        STATE_TRANSITIONS_TABLE: stateTransitions.tableName,
        SCORES_TABLE: scores.tableName,
        RECEIPTS_TABLE: receipts.tableName,
        AUDIT_LOG_TABLE: auditLog.tableName,
        MEDIA_BUCKET: mediaBucket.bucketName,
        RECEIPTS_BUCKET: receiptsBucket.bucketName
      }
    });

    sessions.grantReadWriteData(apiFn);
    primitives.grantReadWriteData(apiFn);
    stateTransitions.grantReadWriteData(apiFn);
    scores.grantReadWriteData(apiFn);
    receipts.grantReadWriteData(apiFn);
    auditLog.grantReadWriteData(apiFn);

    mediaBucket.grantReadWrite(apiFn);
    receiptsBucket.grantReadWrite(apiFn);
    dataKey.grantEncryptDecrypt(apiFn);

    apiFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["kms:Encrypt", "kms:Decrypt", "kms:GenerateDataKey", "kms:DescribeKey"],
        resources: [dataKey.keyArn]
      })
    );

    const httpApi = new apigwv2.HttpApi(this, "StagePortHttpApi", {
      apiName: `stageport-${stage}`
    });

    const jwtAuthorizer = new apigwv2Auth.HttpJwtAuthorizer(
      "StagePortJwtAuthorizer",
      `https://cognito-idp.${this.region}.amazonaws.com/${userPool.userPoolId}`,
      {
        jwtAudience: [userPoolClient.userPoolClientId]
      }
    );

    httpApi.addRoutes({
      path: "/v1/{proxy+}",
      methods: [apigwv2.HttpMethod.GET, apigwv2.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration("StagePortApiIntegration", apiFn),
      authorizer: jwtAuthorizer
    });

    new cloudwatch.Alarm(this, "ApiErrorsAlarm", {
      alarmName: `stageport-api-errors-${stage}`,
      metric: apiFn.metricErrors(),
      threshold: 5,
      evaluationPeriods: 1
    });

    new cloudwatch.Alarm(this, "ApiDurationAlarm", {
      alarmName: `stageport-api-duration-${stage}`,
      metric: apiFn.metricDuration(),
      threshold: 5000,
      evaluationPeriods: 1
    });

    new cloudwatch.Alarm(this, "SessionsReadThrottleAlarm", {
      alarmName: `stageport-sessions-read-throttle-${stage}`,
      metric: sessions.metricThrottledRequestsForOperations({
        operations: [dynamodb.Operation.GET_ITEM, dynamodb.Operation.QUERY]
      }),
      threshold: 1,
      evaluationPeriods: 1
    });

    new cloudwatch.Alarm(this, "SessionsWriteThrottleAlarm", {
      alarmName: `stageport-sessions-write-throttle-${stage}`,
      metric: sessions.metricThrottledRequestsForOperations({
        operations: [dynamodb.Operation.PUT_ITEM, dynamodb.Operation.UPDATE_ITEM]
      }),
      threshold: 1,
      evaluationPeriods: 1
    });

    new cloudwatch.Alarm(this, "Bucket4xxAlarm", {
      alarmName: `stageport-bucket-4xx-${stage}`,
      metric: new cloudwatch.Metric({
        namespace: "AWS/S3",
        metricName: "4xxErrors",
        dimensionsMap: {
          BucketName: receiptsBucket.bucketName,
          FilterId: "EntireBucket"
        },
        statistic: "Sum",
        period: cdk.Duration.minutes(5)
      }),
      threshold: 10,
      evaluationPeriods: 1
    });

    new budgets.CfnBudget(this, "MonthlyBudget", {
      budget: {
        budgetName: `stageport-${stage}-monthly-budget`,
        budgetLimit: {
          amount: 1000,
          unit: "USD"
        },
        timeUnit: "MONTHLY",
        budgetType: "COST"
      },
      notificationsWithSubscribers: [
        {
          notification: {
            notificationType: "ACTUAL",
            comparisonOperator: "GREATER_THAN",
            threshold: 80
          },
          subscribers: [
            {
              subscriptionType: "EMAIL",
              address: "alerts@example.com"
            }
          ]
        }
      ]
    });

    new cdk.CfnOutput(this, "HttpApiUrl", {
      value: httpApi.url ?? ""
    });

    new cdk.CfnOutput(this, "MediaBucketName", {
      value: mediaBucket.bucketName
    });

    new cdk.CfnOutput(this, "ReceiptsBucketName", {
      value: receiptsBucket.bucketName
    });

    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId
    });

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId
    });
  }
}
