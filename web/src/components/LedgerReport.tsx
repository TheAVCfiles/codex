import type { CSSProperties } from 'react';
import { loadLedger } from '../lib/ledger';

export default function LedgerReport({ founderId = 'avc_beta' }: { founderId?: string }): JSX.Element {
  const ledger = loadLedger();
  const rows = ledger.founders?.[founderId] ?? [];

  return (
    <div style={styles.page}>
      <style>{printCss}</style>
      <header style={styles.header}>
        <div>
          <div style={styles.kicker}>FOUNDEROS • IMMUTABLE AUDIT TRAIL</div>
          <h1 style={styles.title}>Ledger Export</h1>
          <div style={styles.metaRow}>
            <div>
              <b>Founder:</b> {founderId}
            </div>
            <div>
              <b>Generated:</b> {new Date().toLocaleString()}
            </div>
            <div>
              <b>Entries:</b> {rows.length}
            </div>
          </div>
        </div>
        <div style={styles.badge}>CONFIDENTIAL</div>
      </header>

      <section style={styles.summary}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Integrity Note</div>
          <div style={styles.summaryText}>Each row includes a SHA-256 hash derived from the transition payload. If any field changes, the hash no longer matches the original entry.</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Export Method</div>
          <div style={styles.summaryText}>Use browser Print → “Save as PDF”. This produces a packet with repeated table headers.</div>
        </div>
      </section>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.th, width: '16%' }}>Time</th>
            <th style={{ ...styles.th, width: '10%' }}>Prev</th>
            <th style={{ ...styles.th, width: '14%' }}>Event</th>
            <th style={{ ...styles.th, width: '10%' }}>Next</th>
            <th style={{ ...styles.th, width: '12%' }}>Actor</th>
            <th style={{ ...styles.th, width: '14%' }}>Org</th>
            <th style={{ ...styles.th, width: '24%' }}>Hash</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td style={styles.td} colSpan={7}>
                No entries found for this founder ID.
              </td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={r.hash ?? i} style={i % 2 ? styles.rowAlt : undefined}>
                <td style={styles.td}>{fmtTime(r.timestamp)}</td>
                <td style={styles.td}>
                  <span style={styles.pill}>{r.previousState ?? '-'}</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.pillDark}>{r.event ?? '-'}</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.pillGold}>{r.newState ?? '-'}</span>
                </td>
                <td style={styles.td}>{r.actor ?? '-'}</td>
                <td style={styles.td}>{r.org ?? '-'}</td>
                <td style={{ ...styles.td, ...styles.hashCell }}>
                  <div style={styles.hashBlock}>{r.hash ?? '-'}</div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <footer style={styles.footer}>
        <div>FounderOS Ledger Export • {founderId}</div>
        <div className="pageNumber" />
      </footer>
    </div>
  );
}

function fmtTime(ts: number): string {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}

const styles: Record<string, CSSProperties> = {
  page: { padding: '28px 28px 40px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial', color: '#111', background: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18, borderBottom: '1px solid #e5e7eb', paddingBottom: 14, marginBottom: 16 },
  kicker: { fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b7280', fontWeight: 700 },
  title: { margin: '6px 0 10px', fontSize: 28, letterSpacing: '-0.02em' },
  metaRow: { display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 12, color: '#374151' },
  badge: { border: '1px solid #111', padding: '6px 10px', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em' },
  summary: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 },
  summaryCard: { border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, background: '#fafafa' },
  summaryLabel: { fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#6b7280', marginBottom: 6 },
  summaryText: { fontSize: 12, lineHeight: 1.35, color: '#111827' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 11 },
  th: { textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid #d1d5db', color: '#111827', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', whiteSpace: 'nowrap' },
  td: { padding: '10px 8px', borderBottom: '1px solid #eee', verticalAlign: 'top', wordBreak: 'break-word' },
  rowAlt: { background: '#fcfcfd' },
  pill: { display: 'inline-block', border: '1px solid #e5e7eb', padding: '2px 8px', borderRadius: 999, fontSize: 10, background: '#fff' },
  pillDark: { display: 'inline-block', border: '1px solid #111', padding: '2px 8px', borderRadius: 999, fontSize: 10, background: '#111', color: '#fff', letterSpacing: '0.06em' },
  pillGold: { display: 'inline-block', border: '1px solid #b45309', padding: '2px 8px', borderRadius: 999, fontSize: 10, background: '#fff7ed', color: '#7c2d12', fontWeight: 700 },
  hashCell: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
  hashBlock: { fontSize: 9.5, lineHeight: 1.25, color: '#111827', background: '#f3f4f6', border: '1px solid #e5e7eb', padding: '6px 8px', borderRadius: 8, wordBreak: 'break-all' },
  footer: { marginTop: 18, paddingTop: 10, borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#6b7280' },
};

const printCss = `
  @page { margin: 14mm; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    table { page-break-inside: auto; }
    tr { page-break-inside: avoid; page-break-after: auto; }
    thead { display: table-header-group; }
    tfoot { display: table-footer-group; }
    .pageNumber:after { content: "Page " counter(page) " of " counter(pages); }
  }
`;
