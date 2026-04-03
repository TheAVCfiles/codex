const STORAGE_KEY = "operator_shell_state_v1";

const vocabularyMap = {
  // Internal terminology can be mapped here if needed.
  // Keep internal terms out of UI labels.
};

const buildActions = [
  {
    id: "build_demos",
    label: "Build demos",
    what: "Generates sanitized showcase previews.",
    why: "Provides public-safe demonstration artifacts.",
    files: "scripts/build_demos.py, data/demos.json",
    output: "site/demos/",
  },
  {
    id: "build_deal_rooms",
    label: "Build deal rooms",
    what: "Generates buyer-facing room pages.",
    why: "Packages structured value for controlled partner review.",
    files: "scripts/build_deal_rooms.py, data/deal_rooms.json",
    output: "site/rooms/",
  },
  {
    id: "build_witness",
    label: "Build witness",
    what: "Generates restricted witness preview pages.",
    why: "Supports controlled disclosure for review workflows.",
    files: "scripts/build_witness.py, data/witness_tokens.json",
    output: "site/witness/",
  },
  {
    id: "score_musings",
    label: "Score musings",
    what: "Updates scoring and release state recommendations.",
    why: "Keeps queue decisions consistent across operator sessions.",
    files: "scripts/musings_score.py, data/musings.json",
    output: "data/musings.json",
  },
];

const safeJsonLoad = async (path, fallback) => {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return await response.json();
  } catch {
    return fallback;
  }
};

const normalizeQueue = (queue) => ({
  ready: Array.isArray(queue?.ready) ? queue.ready : [],
  gated: Array.isArray(queue?.gated) ? queue.gated : [],
  hold: Array.isArray(queue?.hold) ? queue.hold : [],
});

const initialLoad = async () => {
  const [defaultState, codexDumps, musings, releaseQueue] = await Promise.all([
    safeJsonLoad("state/default_state.json", {
      settings: { role: "DIRECTOR", credential: "ACTIVE", status: "GOOD_STANDING" },
      queue: [],
      notes: [],
      last_build: null,
    }),
    safeJsonLoad("../data/codex_dumps.json", []),
    safeJsonLoad("../data/musings.json", []),
    safeJsonLoad("../data/release_queue.json", { ready: [], gated: [], hold: [] }),
  ]);

  const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  const state = persisted || defaultState;

  return {
    state,
    codexDumps,
    musings,
    releaseQueue: normalizeQueue(releaseQueue),
  };
};

const persistState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const renderIntake = (entries) => {
  const host = document.getElementById("intakeList");
  if (!entries.length) {
    host.innerHTML = '<p class="meta">No intake entries available.</p>';
    return;
  }
  host.innerHTML = entries
    .map(
      (entry) => `
      <article class="item">
        <strong>${entry.title}</strong>
        <p class="meta">Source: ${entry.source}</p>
        <span class="tag">Classification: ${entry.classification}</span>
      </article>
    `,
    )
    .join("");
};

const renderReview = (musings, state) => {
  const host = document.getElementById("reviewList");
  if (!musings.length) {
    host.innerHTML = '<p class="meta">No musing records available.</p>';
    return;
  }

  host.innerHTML = musings
    .map((m) => {
      const riskClass = m.leak_risk === "high" ? "risk-high" : "risk-low";
      return `
        <article class="item" data-id="${m.id}">
          <strong>${m.title}</strong>
          <p class="meta">Release score: <span class="score">${m.release_score}</span></p>
          <p class="meta">Leak risk: <span class="${riskClass}">${m.leak_risk}</span></p>
          <p class="meta">Release State: <span class="tag">${m.release_state}</span></p>
          <div class="controls">
            <button data-action="state" data-value="public_now" data-id="${m.id}">public_now</button>
            <button data-action="state" data-value="gated_preview" data-id="${m.id}">gated_preview</button>
            <button data-action="state" data-value="private_hold" data-id="${m.id}">private_hold</button>
          </div>
        </article>
      `;
    })
    .join("");

  host.querySelectorAll('button[data-action="state"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const itemId = btn.dataset.id;
      const nextState = btn.dataset.value;
      const entry = musings.find((m) => m.id === itemId);
      if (!entry) return;
      entry.release_state = nextState;
      state.notes.unshift({
        at: new Date().toISOString(),
        action: `Set ${entry.title} to ${nextState}`,
      });
      persistState(state);
      renderReview(musings, state);
      renderAudit(state);
    });
  });
};

const renderActions = (state) => {
  const host = document.getElementById("buildActions");
  host.innerHTML = buildActions
    .map(
      (action) => `
      <article class="action">
        <h3>${action.label}</h3>
        <p><strong>What:</strong> ${action.what}</p>
        <p><strong>Why:</strong> ${action.why}</p>
        <p><strong>Files:</strong> ${action.files}</p>
        <p><strong>Output:</strong> ${action.output}</p>
        <button data-action="build" data-id="${action.id}">Record action</button>
      </article>
    `,
    )
    .join("");

  host.querySelectorAll('button[data-action="build"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const actionId = btn.dataset.id;
      const action = buildActions.find((item) => item.id === actionId);
      state.last_build = { id: actionId, at: new Date().toISOString() };
      state.notes.unshift({
        at: new Date().toISOString(),
        action: `Build control recorded: ${action.label}`,
      });
      persistState(state);
      renderAudit(state);
      renderAuthority(state);
    });
  });
};

const renderQueue = (releaseQueue) => {
  const host = document.getElementById("queueBuckets");
  const buckets = ["ready", "gated", "hold"];
  host.innerHTML = buckets
    .map((bucket) => {
      const rows = releaseQueue[bucket]
        .map((entry) => `<li>${entry.title} <span class="meta">— ${entry.reason}</span></li>`)
        .join("");
      return `
        <div class="bucket">
          <h3>${bucket}</h3>
          <ul>
            ${rows || '<li class="meta">No items in this bucket.</li>'}
          </ul>
        </div>
      `;
    })
    .join("");
};

const renderAuthority = (state) => {
  const label = `${state.settings.role} · ${state.settings.credential} · ${state.settings.status.replaceAll("_", " ")}`;
  document.getElementById("authorityState").textContent = label;
  const host = document.getElementById("authorityDetail");
  host.innerHTML = `
    <p><strong>Operator Credential:</strong> ${label}</p>
    <p class="meta">Last build action: ${state.last_build ? `${state.last_build.id} at ${state.last_build.at}` : "No build action recorded."}</p>
    <p class="meta">Delivery posture: controlled internal operation for artifact generation.</p>
  `;
};

const renderAudit = (state) => {
  const host = document.getElementById("auditList");
  if (!state.notes.length) {
    host.innerHTML = '<p class="meta">No audit entries recorded.</p>';
    return;
  }
  host.innerHTML = state.notes
    .slice(0, 12)
    .map((note) => `<article class="item"><p>${note.action}</p><p class="meta">${note.at}</p></article>`)
    .join("");
};

const bindNoteForm = (state) => {
  const form = document.getElementById("noteForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("noteInput");
    const value = input.value.trim();
    if (!value) return;
    state.notes.unshift({ at: new Date().toISOString(), action: `Operator note: ${value}` });
    input.value = "";
    persistState(state);
    renderAudit(state);
  });
};

const boot = async () => {
  const { state, codexDumps, musings, releaseQueue } = await initialLoad();
  renderIntake(codexDumps);
  renderReview(musings, state);
  renderActions(state);
  renderQueue(releaseQueue);
  renderAuthority(state);
  renderAudit(state);
  bindNoteForm(state);
};

boot();
