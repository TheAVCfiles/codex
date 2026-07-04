import { suites } from '../data/seed';
export function BackOfHouse(){return <main><h1>Back-of-House Operations</h1><ul>{suites.map(s=><li key={s.id}>{s.name} — {s.roomKeyStatus} <button>Activate</button><button>Suspend</button><button>Revoke</button><button>Extend</button><button>Archive</button></li>)}</ul></main>;}
