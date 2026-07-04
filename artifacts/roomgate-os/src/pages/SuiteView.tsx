import { useParams, Navigate } from 'react-router-dom';
import { suites } from '../data/seed';
import { canAccessSuite } from '../lib/access';
import { assertGuestPayload } from '../lib/guestAllowList';
export function SuiteView(){ const {id}=useParams(); const suite=suites.find(s=>s.id===id); if(!suite) return <main>Suite not found</main>; if(!canAccessSuite(suite.roomKeyStatus)) return <Navigate to={`/access-status?state=${suite.roomKeyStatus}`} replace/>; const safe=assertGuestPayload(suite) as typeof suite; return <main><h1>{safe.name}</h1><p>Room Key: {safe.roomKeyStatus}</p><p>Stay: {safe.stayStart} to {safe.stayEnd}</p><h2>Front Desk</h2><button>Request Stay Extension</button><button>Ring Concierge</button><button>Summon Bellhop</button><button>View Stay Ledger</button><button>Message the House</button></main>; }
