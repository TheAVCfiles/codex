# TRI\* Live Feed Runner — Adapter Plan and Loop-Closure Notes

## Critical Bug Fix

When `gain_factor` is calculated inside `calculate_tri_shocks`, persist it to the impact window DataFrame before downstream logging/printing:

```python
impact_window_df['Gain_Factor'] = gain_factor
```

Without this assignment, any later reference to `df_impact['Gain_Factor']` will fail or print missing values.

## Adapter Contract (No Engine Rewire)

Keep the TRI\* calculation pure and swap only feed adapters. Every adapter should emit the same normalized payload:

```python
{
    "timestamp": "UTC minute",
    "Price": float,
    "Volume": float,
    "Funding": float,
    "OI": float,
    "Gas": float,
    "Mempool": float,
}
```

### Exchange adapter

- Realtime: exchange websocket (trade/ohlc stream)
- Minute poll: funding + open-interest endpoints

### On-chain adapter

- Gas oracle endpoint (1-minute cadence)
- Mempool load endpoint or `txpool_status`

## Operational Hygiene

1. **Time discipline**

   - UTC only
   - floor timestamps to minute
   - reject duplicates/out-of-order records

2. **Backpressure behavior**

   - if feed stalls, reuse last value temporarily
   - decay stale shocks (`z = 0.9 * z`) to avoid sticky extremes

3. **Circuit breaker**

   - if `abs(TRI*) > 6` or any channel `|z| > 8`: mark `DATA_ANOMALY`, block entries, alert

4. **Risk stop**

   - query live broker/account PnL each loop
   - halt new entries at daily loss cap (example: `<= -3%` equity)

5. **Observability**
   - append minute CSV/JSON logs
   - export small Prometheus textfile with: TRI\*, regime gate, action, latest gas

## Regime Loop Closure

Daily process should write a lightweight regime file consumed by the minute runner:

```json
{
  "last_update_utc": "2025-10-03T00:00:00Z",
  "struct_confirmed": true,
  "tau_ci_excludes_zero": true,
  "tap_p_value": 0.01,
  "tap_weight": 92,
  "risk_level_bias": "LONG_BIAS"
}
```

Minute loop behavior:

- if regime gate is **closed**: no entries even if TRI\* spikes
- if gate is **open** and `TRI* >= 2.5σ`: allow scale-up path

This keeps daily (slow conviction) and minute (fast execution) synchronized.
