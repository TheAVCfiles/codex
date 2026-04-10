# StagePort Core MVP Architecture

## Architecture principle

The center of the system is:

`Session -> Primitive -> State -> Score -> Receipt`

Document AI services are supporting components only.

## AWS serverless topology

- **Frontend**: S3 static hosting + CloudFront
- **Auth**: Cognito (invite-only)
- **API**: API Gateway + Lambda
- **Orchestration**: Step Functions
- **State + operational records**: DynamoDB
- **Media/artifacts**: S3 (SSE-KMS)
- **Events + notifications**: EventBridge + SES/SNS
- **Secrets**: Secrets Manager
- **Security/forensics**: CloudTrail, GuardDuty, KMS
- **Optional docs pipeline**: Textract (Comprehend optional for metadata)

## Pipeline stages

1. `InitializeSession`
2. `IngestSignal`
3. `MapPrimitives`
4. `RunFsmTransition`
5. `ComputePyRouetteScore`
6. `ReviewerGate`
7. `FinalizeReceipt`
8. `ArchiveSession`

## Step Functions state machine (MVP draft)

```json
{
  "StartAt": "InitializeSession",
  "States": {
    "InitializeSession": { "Type": "Task", "Next": "IngestSignal" },
    "IngestSignal": { "Type": "Task", "Next": "MapPrimitives" },
    "MapPrimitives": { "Type": "Task", "Next": "RunFsmTransition" },
    "RunFsmTransition": { "Type": "Task", "Next": "ComputePyRouetteScore" },
    "ComputePyRouetteScore": { "Type": "Task", "Next": "ReviewerGate" },
    "ReviewerGate": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.review.approved",
          "BooleanEquals": true,
          "Next": "FinalizeReceipt"
        }
      ],
      "Default": "AwaitReviewerAction"
    },
    "AwaitReviewerAction": {
      "Type": "Wait",
      "Seconds": 10,
      "Next": "ReviewerGate"
    },
    "FinalizeReceipt": { "Type": "Task", "Next": "ArchiveSession" },
    "ArchiveSession": { "Type": "Task", "End": true }
  }
}
```

## Reliability and observability requirements

- Per-stage structured logs with `sessionId`, `tenantId`, `traceId`.
- Dead-letter workflow for failed pipelines.
- Alert on stuck sessions (>5 minutes without transition).
- Versioned scoring rules with release marker in score output.
- Replay capability from persisted signal and primitive snapshots.

## Budget guardrails

- Target monthly spend under **$1,000**.
- Configure AWS Budgets alert at 80% and 100% thresholds.
- Track unit economics via `cost-per-session` dashboard.

## Security controls

- S3 SSE-KMS default encryption.
- IAM least privilege per Lambda.
- CloudTrail enabled across all regions.
- GuardDuty enabled for runtime/anomaly detection.
- Optional Macie if sensitive student data is stored.
