# Telemetry (OTLP) API Overview

This document summarizes the Google Cloud **Telemetry API** (`telemetry.googleapis.com`), which implements the OpenTelemetry OTLP protocol for traces and metrics.

## What the Telemetry API is for

The Telemetry API is designed for applications instrumented with OpenTelemetry SDKs or OpenTelemetry Collectors.

### Why use the Telemetry API

- Stores telemetry in a format broadly aligned with OTLP protobuf schemas.
- Avoids dependence on Google Cloud-specific tracing exporters.
- Often provides more generous limits than the Cloud Trace API.
- Enables features (for example, Application Monitoring) that rely on Telemetry API ingestion paths.

### When to use it

Prefer sending trace data via the Telemetry API when targeting Google Cloud and using OpenTelemetry.

Recommended patterns:

1. **App exporter → Collector → Telemetry API** (OTLP pipeline).
2. **In-process OTLP exporter → Telemetry API** (no Collector).

## Authentication

Exporters must be authorized to write to your Google Cloud project (for example, via Application Default Credentials and language-specific Google Auth libraries).

## Data residency caveat

If you are using Assured Workloads for strict data residency or IL4 requirements, do **not** use the Telemetry API for trace spans.

---

## Metrics ingestion behavior in Cloud Monitoring

When metrics are ingested through OTLP HTTP exporter + Collector (or directly from OpenTelemetry SDKs), Cloud Monitoring maps OTLP data to Monitoring metric structures.

### Monitored resource mapping

Metrics are written using Prometheus-style mapping with monitored resource type:

- `prometheus_target`

Key `prometheus_target` labels use prioritized fallbacks from resource attributes.

#### Label source priority (high-level)

- **location**: `location` → `cloud.availability_zone` → `cloud.region` (required)
- **cluster**: `cluster` → `k8s.cluster.name` → inferred platform defaults → empty
- **namespace**: `namespace` → `k8s.namespace.name` → `service.namespace` → empty
- **job**: `job` → service/k8s/faas fallbacks → empty
- **instance**: multiple fallbacks (for example `instance`, `service.instance.id`, pod/container identifiers, `host.id`); metric point is rejected if unresolved

### Metric naming and conversion

- Metrics are converted to Prometheus-style time series.
- Metric domain must be empty or `prometheus.googleapis.com`.
- Stored metric type format:

```text
prometheus.googleapis.com/{metric_name}/{suffix}
```

- For each unique resource, conversion adds a `target_info` metric (excluding `service.name`, `service.instance.id`, and `service.namespace`).
- OTLP `INT64` values are converted to Monitoring `DOUBLE` to avoid immutable type-collision issues in Monarch.

### OTLP → Cloud Monitoring type mapping

- **Gauge** → Monitoring `GAUGE`, `DOUBLE`, suffix `/gauge`
- **Sum**:
  - non-monotonic → `GAUGE`, `/gauge`
  - monotonic + cumulative → `CUMULATIVE`, `/counter`
  - monotonic + delta → `DELTA`, `/delta`
- **Histogram**:
  - cumulative → `CUMULATIVE` distribution, `/histogram`
  - delta → `DELTA` distribution, `/histogram:delta`
- **Exponential Histogram**:
  - cumulative → `CUMULATIVE` distribution, `/histogram`
  - delta → `DELTA` distribution, `/histogram:delta`
- **Summary** expands into multiple series:
  - sum (`_sum/summary:counter`), cumulative double
  - count (`_count/summary`), cumulative double
  - quantiles (`/summary`), gauge double + `quantile` label

---

## Differences vs `googlemanagedprometheus` exporter

Compared to `googlemanagedprometheus`, the Telemetry API differs in several ways:

- Preserves `.` and `/` in metric names (instead of replacing with `_`).
- Does not append unit-derived suffixes or `_total` for counters.
- Synthesizes `sum_of_squared_deviation` for distributions derived from exponential histograms.
- Converts integer points to doubles for Prometheus metrics.
- Omits `scope_version` and `scope_name` labels when empty.

Using both ingestion paths can produce two parallel metric descriptor sets; queries may need explicit union logic.

---

## Where to view ingested data

- **Traces**: Trace Explorer.
- **Metrics**: Metrics Explorer.

## VPC Service Controls

- Service name: `telemetry.googleapis.com`.
- VPC Service Controls restrictions on this service apply only to this service and not automatically to other ingestion services (for example `cloudtrace.googleapis.com`).
