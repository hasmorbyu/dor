// Central state for the single-page experience. No backend — everything
// lives in memory for the session, except the secret-fragment count, which
// persists in localStorage because the easter egg is meant to survive a
// reload/replay ("counts globally across the whole site").

export const SCREEN_ORDER = [
  'prelude',
  'coldOpen',
  'roast',
  'memories',
  'award',
  'rakhiNote',
  'gifts',
  'quiz',
  'finale',
];

const SECRET_KEY = 'dor:secretFragments';
const SECRET_SEEN_KEY = 'dor:secretRevealed';

function loadSecretFragments() {
  try {
    const raw = localStorage.getItem(SECRET_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveSecretFragments(set) {
  try {
    localStorage.setItem(SECRET_KEY, JSON.stringify([...set]));
  } catch {
    /* localStorage unavailable — the easter egg just won't persist across reloads */
  }
}

export const state = {
  screenIndex: 0,
  marks: [], // ordered list of thread-mark ids gained so far this session
  secretFragmentsFound: loadSecretFragments(),
  secretRevealed: localStorage.getItem(SECRET_SEEN_KEY) === '1',
  roastRevealed: new Set(),
  memoriesOpened: new Set(),
  giftsUnwrapped: new Set(),
  quizAnswered: new Set(),
};

export function currentScreenId() {
  return SCREEN_ORDER[state.screenIndex];
}

export function goToIndex(i) {
  state.screenIndex = Math.max(0, Math.min(SCREEN_ORDER.length - 1, i));
}

export function goToId(id) {
  const i = SCREEN_ORDER.indexOf(id);
  if (i >= 0) state.screenIndex = i;
}

export function canGoBack() {
  return state.screenIndex > 0;
}

export function registerSecretTap(fragmentId) {
  if (state.secretFragmentsFound.has(fragmentId)) return { justCompleted: false, total: state.secretFragmentsFound.size };
  state.secretFragmentsFound.add(fragmentId);
  saveSecretFragments(state.secretFragmentsFound);
  const total = state.secretFragmentsFound.size;
  const justCompleted = total === 5 && !state.secretRevealed;
  return { justCompleted, total };
}

export function markSecretRevealed() {
  state.secretRevealed = true;
  try {
    localStorage.setItem(SECRET_SEEN_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function resetForReplay() {
  // Replay restarts the story beats, but the secret thread fragment is a
  // site-wide discovery, not a per-playthrough one — it stays found.
  state.screenIndex = 0;
  state.marks = [];
  state.roastRevealed = new Set();
  state.memoriesOpened = new Set();
  state.giftsUnwrapped = new Set();
  state.quizAnswered = new Set();
}
