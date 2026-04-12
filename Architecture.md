# Architecture.md — Step 1

## Architecture Principle

Serverless-first, event-driven, audit-ready.

## Core Stack

Frontend: AWS Amplify Hosting (React app)
API: API Gateway + Lambda
Auth: Cognito
Database: DynamoDB
File Storage: S3
Processing: Lambda + Step Functions (CPU)
Optional Compute: AWS Fargate (if video processing exceeds Lambda limits)
AI (future): Amazon Bedrock
Orchestration: EventBridge
Monitoring: CloudWatch + X-Ray

## High-Level Flow

User → Upload Video → S3  
→ EventBridge Trigger  
→ Step Function → Lambda Processing  
→ Store Results in DynamoDB  
→ Generate PDF → S3  
→ Notify User  
→ Optional: Anchor to Ledger

## Architecture Diagram (Text)

[User Browser]
↓
[CloudFront + Amplify]
↓
[API Gateway]
↓
[Lambda (Auth + API)]
↓
[DynamoDB] ←→ [S3 Uploads]
↓
[EventBridge]
↓
[Step Functions]
↓
[Lambda Processing]
↓
[S3 Reports]
↓
[User Dashboard]

## Security

- Secrets → AWS Secrets Manager
- IAM least privilege roles
- CloudTrail enabled
- GuardDuty enabled

## Cost Controls

- Budget alert at 80%
- Lambda timeout limits
- S3 lifecycle policies

## Risk Notes

- Video processing cost spikes
- Anchor transactions (on-chain) can increase cost
