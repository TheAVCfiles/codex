import React from 'react';
import ProgressBar from './ProgressBar';

export default function TelemetryPanel({ risk, motion }) {
  return <div className="space-y-2"><p className="text-xs">Risk: {risk}</p><ProgressBar value={risk} /><p className="text-xs">Motion: {motion}</p><ProgressBar value={motion} /></div>;
}
