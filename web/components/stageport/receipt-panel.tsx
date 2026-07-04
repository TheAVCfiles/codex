import { Receipt } from "@/lib/stageport-types";

export function ReceiptPanel({ receipt, onFinalize, onExport }: { receipt?: Receipt | null; onFinalize: () => void; onExport: () => void; }) {
  return <div>{receipt ? <button onClick={onExport}>Export Bundle</button> : <button onClick={onFinalize}>Finalize Receipt</button>}</div>;
}
