# Customizing the development environment for GitHub Copilot coding agent

This guide explains how to customize GitHub Copilot coding agent's ephemeral development environment using a dedicated GitHub Actions workflow.

## Overview

Copilot coding agent runs tasks in an ephemeral GitHub Actions environment where it can:

- Explore your code
- Make changes
- Run tests and linters
- Validate results

You can customize this environment by creating:

- `.github/workflows/copilot-setup-steps.yml`

Use setup steps to:

- Preinstall tools and dependencies
- Use larger GitHub-hosted runners
- Run on self-hosted runners
- Switch to Windows runners
- Enable Git LFS
- Set environment variables (via the `copilot` environment)
- Adjust firewall behavior in repository settings

## Create the setup workflow

The setup workflow must define a **single job named `copilot-setup-steps`**. GitHub Actions will run its steps before the agent starts work.

> **Important:** The file must exist on the default branch before Copilot will use it for coding sessions.

```yaml
name: "Copilot Setup Steps"

on:
  workflow_dispatch:
  push:
    paths:
      - .github/workflows/copilot-setup-steps.yml
  pull_request:
    paths:
      - .github/workflows/copilot-setup-steps.yml

jobs:
  copilot-setup-steps:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - name: Checkout code
        uses: actions/checkout@v5

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci
```

### Supported job-level customization

In `copilot-setup-steps.yml`, only these job settings are honored:

- `steps`
- `permissions`
- `runs-on`
- `services`
- `snapshot`
- `timeout-minutes` (max 59)

Any other job customizations are ignored.

## Preinstall dependencies

Preinstalling dependencies in setup steps is often faster and more deterministic than having the agent discover them dynamically.

Recommended pattern:

1. `actions/checkout`
2. language/runtime setup
3. dependency installation

If setup fails with a non-zero exit code, remaining setup steps are skipped and Copilot starts with whatever environment state is available.

## Use larger GitHub-hosted runners

To run on larger runners:

1. Configure larger runners for your organization.
2. If using Azure private networking, allow outbound access to:
   - `uploads.github.com`
   - `user-images.githubusercontent.com`
   - `api.individual.githubcopilot.com` (Copilot Pro / Pro+)
   - `api.business.githubcopilot.com` (Copilot Business)
   - `api.enterprise.githubcopilot.com` (Copilot Enterprise)
3. Set `runs-on` to the larger runner label/group.

```yaml
jobs:
  copilot-setup-steps:
    runs-on: ubuntu-4-core
```

> Copilot coding agent supports Ubuntu x64 Linux and Windows 64-bit runners only.

## Use self-hosted runners

Self-hosted runners can be used to align with internal CI/CD or private network access. Prefer ephemeral, single-use runners.

Required network/firewall allowances include standard Actions endpoints plus:

- `uploads.github.com`
- `user-images.githubusercontent.com`
- `api.individual.githubcopilot.com`
- `api.business.githubcopilot.com`
- `api.enterprise.githubcopilot.com`

Additional requirements:

1. Disable Copilot coding agent's integrated firewall in repository settings (required for self-hosted).
2. Set `runs-on` to your ARC scale set label.

```yaml
jobs:
  copilot-setup-steps:
    runs-on: arc-scale-set-name
```

### Optional proxy environment variables

For proxied internet access, set as needed:

- `https_proxy`
- `http_proxy`
- `no_proxy`
- `ssl_cert_file`
- `node_extra_ca_certs`

You can provide these through the `copilot` environment or directly in the runner image/configuration.

## Switch to Windows

By default, Copilot uses Ubuntu Linux. Use Windows runners if your toolchain is Windows-specific.

- Integrated Copilot firewall is not compatible with Windows.
- Prefer self-hosted runners or larger GitHub-hosted runners with private networking and your own network controls.

## Enable Git LFS

To fetch LFS objects, configure checkout with `lfs: true`:

```yaml
jobs:
  copilot-setup-steps:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v5
        with:
          lfs: true
```

## Set environment variables and secrets

Set variables/secrets in the repository's **`copilot` environment**:

1. Go to repository **Settings**.
2. Open **Environments**.
3. Select **copilot**.
4. Add environment variables or secrets.

Use secrets for sensitive values (API keys, tokens, passwords).

## Validation tips

- Keep triggers for `push`, `pull_request`, and `workflow_dispatch` on the setup file path.
- Verify the workflow succeeds in Actions before merging.
- After merging to default branch, manually run the workflow to validate setup health over time.
