import React from 'react';

export default function DiscoveryModal({ open, onClose }) {
  if (!open) return null;
  return <div className="fixed inset-0 bg-black/60 grid place-items-center" onClick={onClose}><div className="bg-slate-900 p-6 rounded" onClick={(e)=>e.stopPropagation()}><h3 className="text-lg">Discovery</h3><p className="text-slate-300 text-sm">Governance event lineage is export-ready.</p></div></div>;
}
