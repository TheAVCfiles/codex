"""Websocket stream constants and helpers."""

BINANCE_TRADE_WS = "wss://stream.binance.com:9443/ws/ethusdt@trade"


def stream_for_symbol(symbol: str) -> str:
    return f"wss://stream.binance.com:9443/ws/{symbol.lower()}@trade"
