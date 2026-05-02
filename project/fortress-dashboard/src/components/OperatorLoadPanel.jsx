import React from 'react';
import ProgressBar from './ProgressBar';

export default function OperatorLoadPanel({ load }) {
  return <div><p className="text-xs mb-2">Operator load: {load}%</p><ProgressBar value={load} /></div>;
}
