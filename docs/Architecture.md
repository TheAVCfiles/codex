# Architecture.md — StagePort Core MVP

## Thesis

This is a system of action, not a chat product. The workflow is:
session -> primitive stream -> FSM -> score -> review -> receipt.

## Core Stack

- CloudFront + S3: static web app
- Cognito: invite-only auth
- API Gateway HTTP API: thin API surface
- Lambda: API + workers
- Step Functions Standard: orchestration
- DynamoDB on-demand: operational state
- S3: media and artifacts
- Secrets Manager: secrets
- CloudWatch/X-Ray: observability
- CloudTrail/GuardDuty/KMS: security baseline
- Optional Macie: sensitive media/data scanning

## Data Path

Session created -> media stored -> workflow runs -> primitives/transitions/scores written -> reviewer actions logged -> receipt minted.

## Why Serverless

- Fast to ship
- Low idle cost
- Good match for bursty pilot usage
- Easy to observe and lock down
- No fake platform team required

## Security Defaults

- SSE-KMS
- least-privilege IAM
- CloudTrail enabled
- GuardDuty enabled
- block public S3
- enforce SSL
- DynamoDB PITR
- S3/Dynamo gateway endpoints where private routing matters

## Concurrency Controls

- conservative reserved concurrency
- bounded active session processing
- retry with backoff
- no uncontrolled fan-out in v1

## Failure Model

- processing failure -> audit event + visible status
- invalid primitive -> reject or flag
- reviewer override -> append-only log
- finalize failure -> no receipt, no silent success
