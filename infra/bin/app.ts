#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { StagePortStack } from "../lib/stageport-stack";

const app = new cdk.App();

new StagePortStack(app, "StagePortDev", {
  stage: "dev",
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});

new StagePortStack(app, "StagePortProd", {
  stage: "prod",
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});
