import subprocess
import datetime
import os
import sys

ROOT = os.path.dirname(os.path.dirname(__file__))
OPS = os.path.join(ROOT, "ops")


def run(cmd):
    print(">", " ".join(cmd))
    return subprocess.call(cmd)


def compose_and_run_suite():
    # 1) refresh mesh
    run([sys.executable, os.path.join(OPS, "mesh_build.py")])
    # 2) run KOLL entrypoint (single-asset as example)
    cfg = os.path.join(ROOT, "engines", "koll_core", "configs", "koll_config.yaml")
    bt = os.path.join(ROOT, "engines", "koll_core", "backtest.py")
    run([sys.executable, bt, "--config", cfg])
    # 3) (optional) send EI% over OSC to TD receiver (bridge script)
    # run([sys.executable, os.path.join(ROOT,"interfaces","ui_td","receiver_bridge.py")])


if __name__ == "__main__":
    print("AUTOPILOT @", datetime.datetime.utcnow().isoformat())
    compose_and_run_suite()
