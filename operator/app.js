const STORAGE_KEY = "operator_shell_state_v1";
const STATE_URL = "state/default_state.json";

// Internal terminology map kept private in code. UI uses controlled language only.
const releaseStateLabels = {
  public_now: "ready",
  gated_preview: "gated",
  private_hold: "hold",
};

const buildActionMap = [
  {
    id: "build_demos",
    label: "Build demos",
    what: "Generates rendered previews for external review.",
    why: "Maintains a current demo surface with safe, structured outputs.",
    files: "scripts/build_demos.py, data/demos.json",
    output: "site/demos/",
  },
  {
    id: "build_rooms",
    label: "Build deal rooms",
    what: "Generates buyer-facing room pages.",
    why: "Provides controlled presentation assets for qualified opportunities.",
    files: "scripts/build_deal_rooms.py, data/deal_rooms.json",
    output: "site/rooms/",
  },
  {
    id: "build_witness",
    label: "Build witness",
    what: "Generates restricted preview pages.",
    why: "Supports controlled evidence previews without exposing internals.",
    files: "scripts/build_witness.py, data/witness_tokens.json",
    output: "site/witness/",
  },
  {
    id: "score_musings",
    label: "Score musings",
    what: "Refreshes release scoring and risk markers.",
    why: "Ensures queue decisions are current and auditable.",
    files: "scripts/musings_score.py, data/musings.json",
    output: "data/musings.json",
  },
];

async function readJson(path) {
  const res = await fetch(`../${path}`);
  if (!res.ok) throw new Error(`Unable to load ${path}`);
  return await res.json();
}

function getSavedState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function pushAudit(state, action, detail) {
  state.audit = state.audit || [];
  state.audit.unshift({ timestamp: new Date().toISOString(), action, detail });
  state.audit = state.audit.slice(0, 25);
}

function renderAuthority(state) {
  const s = state.settings;
  const text = `${s.role} · ${s.credential} · ${s.status}`;
  document.getElementById("authorityState").textContent = text;
  document.getElementById("operatorStateDetail").innerHTML = `
    <div class="card">
      <h3>Authority / Delivery</h3>
      <p class="meta">${text}</p>
      <p class="meta">Internal-only control state. Not for public deployment.</p>
    </div>
  `;
}

function renderIntake(dumps) {
  const root = document.getElementById("intakeList");
  root.innerHTML = dumps
    .map(
      (d) => `
      <article class="card">
        <h3>${d.title}</h3>
        <p class="meta">Source: ${d.source}</p>
        <p class="meta">Classification: ${d.classification}</p>
        <p class="meta">Status: ${d.status}</p>
      </article>
    `,
    )
    .join("");
}

function renderReview(musings, state) {
  const root = document.getElementById("reviewList");
  root.innerHTML = "";

  musings.forEach((m) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>${m.title}</h3>
      <p class="meta">Release score: ${m.release_score}</p>
      <p class="meta">Leak risk: ${m.leak_risk}</p>
      <p class="meta">Release State: ${m.release_state}</p>
      <div class="controls">
        <button data-state="public_now">public_now</button>
        <button data-state="gated_preview">gated_preview</button>
        <button data-state="private_hold">private_hold</button>
      </div>
    `;

    card.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        m.release_state = btn.dataset.state;
        m.reason = `Operator set state to ${btn.dataset.state} from console.`;
        pushAudit(state, "RELEASE_STATE_UPDATE", `${m.id} -> ${btn.dataset.state}`);
        saveState(state);
        renderReview(musings, state);
        renderQueue(musings);
        renderAudit(state);
      });
    });

    root.appendChild(card);
  });
}

function renderBuildActions(state) {
  const root = document.getElementById("buildActions");
  root.innerHTML = buildActionMap
    .map(
      (a) => `
      <article class="action">
        <h3>${a.label}</h3>
        <p class="meta"><strong>What:</strong> ${a.what}</p>
        <p class="meta"><strong>Why:</strong> ${a.why}</p>
        <p class="meta"><strong>Files:</strong> ${a.files}</p>
        <p class="meta"><strong>Output:</strong> ${a.output}</p>
        <button data-action="${a.id}">Record action</button>
      </article>
    `,
    )
    .join("");

  root.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = buildActionMap.find((a) => a.id === btn.dataset.action);
      state.last_build = { id: action.id, timestamp: new Date().toISOString() };
      pushAudit(state, "BUILD_ACTION", `${action.label} recorded.`);
      saveState(state);
      renderAudit(state);
      renderAuthority(state);
    });
  });
}

function renderQueue(musings) {
  const buckets = { ready: [], gated: [], hold: [] };
  musings.forEach((m) => {
    const bucket = releaseStateLabels[m.release_state] || "hold";
    buckets[bucket].push(m);
  });

  document.getElementById("queueSummary").innerHTML = `
    <span class="pill ready">ready: ${buckets.ready.length}</span>
    <span class="pill gated">gated: ${buckets.gated.length}</span>
    <span class="pill hold">hold: ${buckets.hold.length}</span>
  `;

  const detail = [];
  Object.entries(buckets).forEach(([bucket, items]) => {
    items.forEach((item) => {
      detail.push(`
        <article class="card">
          <h3>${item.title}</h3>
          <p class="meta">Queue bucket: ${bucket}</p>
          <p class="meta">Reason: ${item.reason || "No reason provided."}</p>
        </article>
      `);
    });
  });
  document.getElementById("queueDetails").innerHTML = detail.join("");
}

function renderAudit(state) {
  const root = document.getElementById("auditList");
  const auditRows = (state.audit || []).map(
    (row) => `
      <article class="card">
        <h3>${row.action}</h3>
        <p class="meta">${row.timestamp}</p>
        <p class="meta">${row.detail}</p>
      </article>
    `,
  );
  root.innerHTML = auditRows.join("") || '<p class="meta">No operator actions recorded.</p>';
}

async function init() {
  const [defaultState, dumps, musings] = await Promise.all([
    readJson("operator/state/default_state.json"),
    readJson("data/codex_dumps.json"),
    readJson("data/musings.json"),
  ]);

  const state = getSavedState() || defaultState;
  renderAuthority(state);
  renderIntake(dumps);
  renderReview(musings, state);
  renderBuildActions(state);
  renderQueue(musings);
  renderAudit(state);
}

init().catch((error) => {
  console.error(error);
  document.body.innerHTML = `<main class="panel" style="margin:1rem;">Failed to initialize operator shell: ${error.message}</main>`;
});
