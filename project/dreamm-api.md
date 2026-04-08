# Dreamm Corridor API (Draft)

## Endpoints

### `GET /dreamm/{corridor}`

Returns corridor JSON + image reference.

### `GET /dreamm/random`

Returns a weighted Dreamm entry based on user kinetic history.

### `POST /dreamm/attach`

Attach a Dreamm reference to a movement receipt.

Request body:

```json
{
  "harvest_id": "<movement-receipt-id>",
  "dreamm_id": "DREAMM_CORRIDOR_3_01"
}
```

## Corridor namespace

```text
/corridors/
  0_origin/
  1_proof/
  2_movement/
  3_memory/
  ...
  10_enterprise/
```
