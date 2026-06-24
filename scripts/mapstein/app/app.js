const $ = (s) => document.querySelector(s);
let selectedDocType = "";
let globalSearch = "";

function matchesSearch(text) {
  if (!globalSearch) return true;
  return (text || "").toLowerCase().includes(globalSearch.toLowerCase());
}

function matchesDocType(item) {
  return !selectedDocType || (item.doc_type === selectedDocType);
}

async function loadTimeline() {}
async function loadCooccurrence() {}
async function loadBridgeScores() {}

document.addEventListener("DOMContentLoaded", async () => {
  const filter = $("#docTypeFilter");
  if (filter) {
    filter.addEventListener("change", async (e) => {
      selectedDocType = e.target.value;
      await loadTimeline();
      await loadCooccurrence();
      await loadBridgeScores();
    });
  }
});
