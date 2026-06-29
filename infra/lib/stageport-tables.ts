import * as ddb from "aws-cdk-lib/aws-dynamodb";
import * as kms from "aws-cdk-lib/aws-kms";
import { Construct } from "constructs";

export function createStagePortTables(scope: Construct, key: kms.IKey) {
  const common = {
    billingMode: ddb.BillingMode.PAY_PER_REQUEST,
    encryption: ddb.TableEncryption.CUSTOMER_MANAGED,
    encryptionKey: key,
    pointInTimeRecovery: true,
  };

  const sessions = new ddb.Table(scope, "SessionsTable", {
    partitionKey: { name: "PK", type: ddb.AttributeType.STRING },
    sortKey: { name: "SK", type: ddb.AttributeType.STRING },
    ...common,
  });

  sessions.addGlobalSecondaryIndex({
    indexName: "GSI1",
    partitionKey: { name: "GSI1PK", type: ddb.AttributeType.STRING },
    sortKey: { name: "GSI1SK", type: ddb.AttributeType.STRING },
  });

  const primitives = new ddb.Table(scope, "PrimitivesTable", {
    partitionKey: { name: "PK", type: ddb.AttributeType.STRING },
    sortKey: { name: "SK", type: ddb.AttributeType.STRING },
    ...common,
  });

  const stateTransitions = new ddb.Table(scope, "StateTransitionsTable", {
    partitionKey: { name: "PK", type: ddb.AttributeType.STRING },
    sortKey: { name: "SK", type: ddb.AttributeType.STRING },
    ...common,
  });

  const scores = new ddb.Table(scope, "ScoresTable", {
    partitionKey: { name: "PK", type: ddb.AttributeType.STRING },
    sortKey: { name: "SK", type: ddb.AttributeType.STRING },
    ...common,
  });

  const receipts = new ddb.Table(scope, "ReceiptsTable", {
    partitionKey: { name: "PK", type: ddb.AttributeType.STRING },
    sortKey: { name: "SK", type: ddb.AttributeType.STRING },
    ...common,
  });

  const auditLog = new ddb.Table(scope, "AuditLogTable", {
    partitionKey: { name: "PK", type: ddb.AttributeType.STRING },
    sortKey: { name: "SK", type: ddb.AttributeType.STRING },
    ...common,
  });

  return { sessions, primitives, stateTransitions, scores, receipts, auditLog };
}
