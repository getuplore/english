// Family account (shared with Uplore and Maths) and backup of English progress to the English tables.
// Signing in happens on the Uplore home page; English only reads the session and renews it when needed.
import { english, setEnglish, onSave, profiles, blank } from './store.js';

export const SUPABASE_URL = 'https://kafkrkcuogvurfhigksk.supabase.co';
const BASE = (() => { try { return (location.hostname === 'localhost' && localStorage.getItem('pipmaths.sburl')) || SUPABASE_URL; } catch (e) { return SUPABASE_URL; } })();
const KEY = 'sb_publishable_OYg8qCsdnHd0Dx_3JXcpBw_ZqBApST6';
const SKEY = 'pipmaths.session', PKEY = 'uplore.english.synced', SCHEMA = 'English_schema';

let session = read(SKEY), synced = read(PKEY) || {}, status = { state: session ? 'idle' : 'off', at: null, error: null }, adminCache = null;
const statusFns = [];
function read(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
function keep(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function setStatus(patch) { Object.assign(status, patch); statusFns.forEach(f => { try { f(status); } catch (e) {} }); }
export const onStatus = fn => { statusFns.push(fn); };
export const cloudStatus = () => status;
export const signedIn = () => !!session;

class CloudError extends Error { constructor(msg, code) { super(msg); this.code = code; } }
async function call(path, { method = 'GET', body, headers = {}, schema = SCHEMA, retry = true } = {}) {
  if (session) await fresh();
  const h = { apikey: KEY, 'Content-Type': 'application/json', ...headers };
  if (path.startsWith('/rest/')) { h['Accept-Profile'] = schema; h['Content-Profile'] = schema; }
  if (session) h.Authorization = 'Bearer ' + session.access_token;
  let r;
  try { r = await fetch(BASE + path, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) }); }
  catch (e) { throw new CloudError('No internet connection', 'offline'); }
  if (r.status === 401 && session && retry) { await refresh(true); return call(path, { method, body, headers, schema, retry: false }); }
  const text = await r.text(); let data = null; try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
  if (!r.ok) throw new CloudError((data && (data.message || data.msg || data.error)) || 'Something went wrong (' + r.status + ')', r.status);
  return data;
}

// ---------- Sessions (the same rules as Maths) ----------
let epoch = 0;
function saveSession(d) {
  if (!d || !d.access_token) return;
  session = { access_token: d.access_token, refresh_token: d.refresh_token, expires_at: d.expires_at || Math.floor(Date.now() / 1000) + (d.expires_in || 3600), user: d.user || (session && session.user) };
  keep(SKEY, session); adminCache = null;
}
async function fresh() { if (session && session.expires_at - 60 < Date.now() / 1000) await refresh(); }
function adoptStored() {
  const s = read(SKEY);
  if (!s || !session || !s.access_token || s.refresh_token === session.refresh_token) return false;
  if (s.user && session.user && s.user.id !== session.user.id) return false;
  session = { ...s, user: s.user || session.user }; adminCache = null; return true;
}
let refreshing = null;
function refresh(force) {
  if (!session) return Promise.resolve();
  if (!refreshing) refreshing = (async () => {
    const e0 = epoch;
    if (adoptStored() && session.expires_at - 60 > Date.now() / 1000) { setTimeout(() => { refreshing = null; }, 0); return; }
    try {
      const r = await fetch(BASE + '/auth/v1/token?grant_type=refresh_token', { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: session.refresh_token }) });
      const d = await r.json().catch(() => null);
      if (!r.ok) throw new CloudError('refused', r.status);
      if (e0 === epoch && session) saveSession(d);
    } catch (e) {
      if ([400, 401, 403].includes(e.code) && e0 === epoch && !adoptStored()) { epoch++; session = null; keep(SKEY, null); synced = {}; keep(PKEY, null); setStatus({ state: 'off', error: 'Signed out: please sign in again.' }); }
      if (e.code === undefined) e.code = 'offline';
      throw e;
    } finally { setTimeout(() => { refreshing = null; }, 0); }
  })();
  return force ? refreshing : refreshing.catch(() => {});
}
// Another tab signed in or out or renewed the session. Returns 'gone', 'changed' (another account) or 'same'.
export function checkSession() {
  const s = read(SKEY);
  if (!s || !s.access_token) { if (session) { epoch++; session = null; synced = {}; adminCache = null; } return 'gone'; }
  if (!session || (s.user && session.user && s.user.id !== session.user.id)) return 'changed';
  if (s.access_token !== session.access_token) { session = { ...s, user: s.user || session.user }; adminCache = null; }
  synced = read(PKEY) || {};
  return 'same';
}

// ---------- Sync: one row per learner in English_schema.progress ----------
const body = d => { const { t, ...rest } = d || {}; return JSON.stringify(rest); };
let timer = null, running = null, lastPull = 0;
onSave(() => {
  if (!session) return;
  const E = english();
  for (const id of Object.keys(E)) if (synced[id] !== body(E[id])) E[id].t = Date.now();
  clearTimeout(timer); timer = setTimeout(() => syncNow({ pull: false }), 2500);
});
export async function syncNow({ pull = true } = {}) {
  if (!session) return;
  if (running) return running;
  running = (async () => {
    setStatus({ state: 'syncing', error: null });
    try {
      const uid = session.user && session.user.id || (session.user = await call('/auth/v1/user')).id;
      const ids = new Set(profiles().map(p => p.id));
      const E = { ...english() };
      if (pull) {
        const rows = await call('/rest/v1/progress?select=learner_id,data');
        for (const r of rows || []) {
          const local = E[r.learner_id], remote = r.data || {};
          if (!local || (remote.t || 0) > (local.t || 0)) { E[r.learner_id] = { ...blank(), ...remote }; synced[r.learner_id] = body(E[r.learner_id]); }
        }
        setEnglish(E); lastPull = Date.now();
      }
      // Only learners of this family (others may linger on a shared device).
      const out = Object.keys(E).filter(id => ids.has(id) && synced[id] !== body(E[id]) && (E[id].sessions || []).length + Object.keys(E[id].progress || {}).length > 0)
        .map(id => ({ family_id: uid, learner_id: id, data: E[id] }));
      if (out.length) await call('/rest/v1/progress?on_conflict=family_id,learner_id', { method: 'POST', body: out, headers: { Prefer: 'resolution=merge-duplicates,return=minimal' } });
      if (!session) return false;
      out.forEach(o => { synced[o.learner_id] = body(o.data); }); keep(PKEY, synced);
      setStatus({ state: 'idle', at: Date.now(), error: null });
      return true;
    } catch (e) {
      setStatus({ state: e.code === 'offline' ? 'offline' : 'error', error: e.message });
      return false;
    } finally { running = null; }
  })();
  return running;
}
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => { if (!document.hidden && session && Date.now() - lastPull > 60000) syncNow().then(ok => ok && window.dispatchEvent(new Event('en-synced'))); });
  window.addEventListener('online', () => { if (session) syncNow({ pull: false }); });
}

// ---------- Admin (the owner's account; checked by the server) ----------
export async function isAdmin() {
  if (!session) return false;
  if (adminCache === true) return true;
  try { adminCache = !!(await call('/rest/v1/rpc/is_admin', { method: 'POST', body: {}, schema: 'Math_schema' })) || null; } catch (e) { return false; }
  return adminCache === true;
}
export const isAdminCached = () => adminCache === true;
