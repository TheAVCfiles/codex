const paths = {
  state: './state/default_state.json',
  codexDumps: '../data/codex_dumps.json',
  musings: '../data/musings.json',
  queue: '../data/release_queue.json',
};

const storageKey = 'operator_shell_state_v1';
const auditKey = 'operator_shell_audit_v1';

function addAudit(message) {
  const existing = JSON.parse(localStorage.getItem(auditKey) || '[]');
  existing.unshift(`${new Date().toISOString()} — ${message}`);
  localStorage.setItem(auditKey, JSON.stringify(existing.slice(0, 50)));
  renderAudit();
}

function renderAudit() {
  const audit = JSON.parse(localStorage.getItem(auditKey) || '[]');
  document.getElementById('auditLog').innerHTML = audit.length
    ? audit.map((item) => `<li>${item}</li>`).join('')
    : '<li>No local actions recorded.</li>';
}

async function loadJson(path) {
  const response = await fetch(path);
  return response.json();
}

function persistState(state) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function getMergedState(defaultState) {
  const local = JSON.parse(localStorage.getItem(storageKey) || 'null');
  return local ? { ...defaultState, ...local } : defaultState;
}

function renderIntake(codexDumps) {
  const el = document.getElementById('intakeList');
  el.innerHTML = codexDumps.map((dump) => `
    <article class="item">
      <strong>${dump.title}</strong>
      <p class="muted">Source: ${dump.source}</p>
      <p>Classification: <code>${dump.classification}</code></p>
      <p>Status: <code>${dump.status}</code></p>
    </article>
  `).join('');
}

function renderReview(musings, state) {
  const el = document.getElementById('reviewList');
  el.innerHTML = musings.map((m) => {
    const options = ['public_now', 'gated_preview', 'private_hold']
      .map((opt) => `<option value="${opt}" ${m.release_state === opt ? 'selected' : ''}>${opt}</option>`)
      .join('');

    return `
      <article class="item">
        <strong>${m.title}</strong>
        <p class="muted">Release score: ${m.release_score} · Leak risk: ${m.leak_risk}</p>
        <label>Release State
          <select data-id="${m.id}" class="stateSelect">${options}</select>
        </label>
      </article>
    `;
  }).join('');

  el.querySelectorAll('.stateSelect').forEach((select) => {
    select.addEventListener('change', (event) => {
      const id = event.target.dataset.id;
      const releaseState = event.target.value;
      state.queue = state.queue || [];
      state.queue = state.queue.filter((entry) => entry.id !== id);
      state.queue.push({ id, release_state: releaseState, updated_at: new Date().toISOString() });
      persistState(state);
      addAudit(`Release state set for ${id}: ${releaseState}`);
    });
  });
}

function renderBuildControls() {
  const actions = [
    {
      name: 'Build demos',
      what: 'Generate rendered demo previews.',
      why: 'Prepares safe demonstration artifacts for public display.',
      file: 'scripts/build_demos.py',
      out: 'site/demos/',
    },
    {
      name: 'Build deal rooms',
      what: 'Generate buyer-facing room pages.',
      why: 'Creates controlled deal artifacts for partner review.',
      file: 'scripts/build_deal_rooms.py',
      out: 'site/rooms/',
    },
    {
      name: 'Build witness',
      what: 'Generate restricted witness previews.',
      why: 'Supports limited-access verification before publication.',
      file: 'scripts/build_witness.py',
      out: 'site/witness/',
    },
    {
      name: 'Score musings',
      what: 'Refresh release-state scoring in source data.',
      why: 'Keeps release decisions current and auditable.',
      file: 'scripts/musings_score.py',
      out: 'data/musings.json',
    },
  ];

  const el = document.getElementById('buildActions');
  el.innerHTML = actions.map((a) => `
    <article class="item">
      <h3>${a.name}</h3>
      <p><strong>What:</strong> ${a.what}</p>
      <p><strong>Why:</strong> ${a.why}</p>
      <p><strong>File:</strong> <code>${a.file}</code></p>
      <p><strong>Output:</strong> <code>${a.out}</code></p>
      <button data-action="${a.name}">Record Action</button>
    </article>
  `).join('');

  el.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => addAudit(`Action acknowledged: ${button.dataset.action}`));
  });
}

function renderQueue(queue) {
  const view = document.getElementById('queueView');
  const buckets = [
    ['ready', 'Ready for public artifact generation'],
    ['gated', 'Restricted preview only'],
    ['hold', 'Blocked from publication'],
  ];

  view.innerHTML = buckets.map(([bucket, label]) => {
    const items = queue[bucket] || [];
    return `
      <article class="item">
        <strong>${bucket.toUpperCase()}</strong>
        <p class="muted">${label}</p>
        ${items.length ? items.map((i) => `<p><code>${i.id}</code> — ${i.title} (${i.reason})</p>`).join('') : '<p class="muted">No entries.</p>'}
      </article>
    `;
  }).join('');
}

function renderAuthority(settings) {
  document.getElementById('operatorBadge').textContent = `${settings.role} · ${settings.credential} · ${settings.status}`;
  document.getElementById('authorityState').textContent = `${settings.role} · ${settings.credential} · ${settings.status}`;
}

async function init() {
  const [defaultState, codexDumps, musings, queue] = await Promise.all([
    loadJson(paths.state),
    loadJson(paths.codexDumps),
    loadJson(paths.musings),
    loadJson(paths.queue),
  ]);

  const state = getMergedState(defaultState);
  renderAuthority(state.settings);
  renderIntake(codexDumps);
  renderReview(musings, state);
  renderBuildControls();
  renderQueue(queue);
  renderAudit();
}

init().catch((error) => {
  console.error(error);
  addAudit('Initialization error: check local file paths and JSON validity.');
});
