import { useSearchParams } from 'react-router-dom';
import { statusCopy } from '../lib/access';
export function AccessStatus(){ const [sp]=useSearchParams(); const s=(sp.get('state')||'on_hold') as keyof typeof statusCopy; return <main><h1>Access Status</h1><p>{statusCopy[s]}</p></main>; }
