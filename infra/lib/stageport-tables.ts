import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as kms from "aws-cdk-lib/aws-kms";

function createTable(scope: Construct, id: string, key: kms.IKey) {
  return new dynamodb.Table(scope, id, {
    partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
    sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    pointInTimeRecovery: true,
    encryption: dynamodb.TableEncryption.CUSTOMER_MANAGED,
    encryptionKey: key,
    removalPolicy: undefined
  });
}

export function createStagePortTables(scope: Construct, dataKey: kms.IKey) {
  const sessions = createTable(scope, "SessionsTable", dataKey);
  sessions.addGlobalSecondaryIndex({
    indexName: "GSI1",
    partitionKey: { name: "GSI1PK", type: dynamodb.AttributeType.STRING },
    sortKey: { name: "GSI1SK", type: dynamodb.AttributeType.STRING }
  });

  const primitives = createTable(scope, "PrimitivesTable", dataKey);
  const stateTransitions = createTable(scope, "StateTransitionsTable", dataKey);
  const scores = createTable(scope, "ScoresTable", dataKey);
  const receipts = createTable(scope, "ReceiptsTable", dataKey);
  const auditLog = createTable(scope, "AuditLogTable", dataKey);

  return { sessions, primitives, stateTransitions, scores, receipts, auditLog };
}
