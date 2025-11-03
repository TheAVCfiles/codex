"""Schedule automated ledger-driven licensing jobs."""

from __future__ import annotations

import datetime as dt


class LicenseScheduler:
  def __init__(self) -> None:
    self.events: list[str] = []

  def schedule_refresh(self, name: str, when: dt.datetime) -> None:
    entry = f"{when.isoformat()} :: refresh {name}"
    self.events.append(entry)

  def dump(self) -> str:
    return "\n".join(self.events)


if __name__ == "__main__":
  scheduler = LicenseScheduler()
  scheduler.schedule_refresh("sentient-cents", dt.datetime.utcnow())
  print(scheduler.dump())
