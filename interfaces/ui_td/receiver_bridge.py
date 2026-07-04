import argparse
import random
import socket
import time


def send_osc_value(host, port, path, value):
    """Send a minimal OSC-like message over UDP."""
    # Ultra-minimal OSC packet (for real OSC use a library like python-osc)
    message = f"{path} {value}\n".encode("utf-8")
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
        sock.sendto(message, (host, port))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=9004)  # lights
    parser.add_argument("--path", default="/percent")
    parser.add_argument("--hz", type=float, default=2.0)
    args = parser.parse_args()

    try:
        while True:
            # Replace with live EI% from KOLL output; this is a stub demo.
            percent = max(0, min(100, random.uniform(10, 90)))
            send_osc_value(args.host, args.port, args.path, percent)
            time.sleep(1.0 / args.hz)
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
