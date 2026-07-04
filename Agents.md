# Agents.md — Step 1

## Agent 1: Frontend Builder

Goal: Build UI in React (Amplify)

Tasks:

- Landing page (hero + CTA)
- StageCred upload UI
- Results dashboard
- Auth integration (Cognito)

Output:

- Deployed frontend on Amplify

---

## Agent 2: Backend API Builder

Goal: Build API layer

Tasks:

- Create API Gateway routes
- Implement Lambda handlers:
  - Upload metadata
  - Fetch reports
  - Trigger processing
- Connect to DynamoDB

Output:

- Working REST API

---

## Agent 3: Processing Engine

Goal: Analyze video + generate report

Tasks:

- Build Lambda-compatible processing logic
- Integrate OpenCV/MediaPipe
- Generate structured metrics
- Output JSON + PDF

Output:

- Processing pipeline

---

## Agent 4: Orchestration Agent

Goal: Event-driven pipeline

Tasks:

- Configure EventBridge rules
- Build Step Functions workflow:
  - Validate upload
  - Process video
  - Generate report
  - Notify user

Output:

- Fully automated pipeline

---

## Agent 5: Security + Infra

Goal: Lock system

Tasks:

- Setup IAM roles
- Enable CloudTrail + GuardDuty
- Configure Secrets Manager
- Apply least privilege policies

Output:

- Secure AWS environment

---

## Agent 6: Monetization Agent

Goal: Revenue system

Tasks:

- Integrate Stripe
- Implement paywall logic
- Track usage + entitlements

Output:

- Paid report system
