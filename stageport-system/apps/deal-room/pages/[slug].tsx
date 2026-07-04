type Room = {
  title: string;
  summary?: {
    overview?: string;
    inputs?: number;
    outputs?: number;
    time_saved_hours?: number;
  };
};

export default function DealRoom({ room }: { room: Room }) {
  return (
    <main style={{ background: '#050505', color: '#e7e7e7', minHeight: '100vh', padding: '40px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 12 }}>Deal Room</div>
        <h1>{room.title}</h1>
        <p style={{ color: '#b3b3b3' }}>{room.summary?.overview}</p>

        <section>
          <h2>Structured Impact</h2>
          <ul>
            <li>Inputs processed: {room.summary?.inputs}</li>
            <li>Outputs generated: {room.summary?.outputs}</li>
            <li>Estimated time saved: {room.summary?.time_saved_hours}h</li>
          </ul>
        </section>

        <section>
          <h2>Controlled Access</h2>
          <p>Execution is authority-gated. Interaction is auditable. Preview is bounded.</p>
        </section>

        <section>
          <h2>Next Step</h2>
          <button>Start pilot</button>
          <button style={{ marginLeft: 12 }}>Request full deployment</button>
        </section>
      </div>
    </main>
  );
}
