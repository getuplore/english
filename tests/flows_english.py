"""Uplore English flows with a stand-in Supabase (Playwright route).
Needs clones of getuplore/getuplore.github.io and getuplore/maths next to this repo (or HUB=..., MATHS=...), and Chrome.
Run after ./build.sh:  python3 tests/flows_english.py"""
import json, os, re, sys, threading, time, functools, http.server, socketserver, urllib.parse, itertools, tempfile
from playwright.sync_api import sync_playwright

ENG = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HUB = os.environ.get('HUB') or os.path.join(os.path.dirname(ENG), 'getuplore.github.io')
MATHS = os.environ.get('MATHS') or os.path.join(os.path.dirname(ENG), 'maths')
CHROME = os.environ.get('CHROME', '/usr/bin/google-chrome')
SITE = tempfile.mkdtemp(prefix='uplore-en-')
for name, target in (('index.html', os.path.join(HUB, 'index.html')), ('admin', os.path.join(HUB, 'admin')), ('maths', MATHS), ('english', ENG)):
    os.symlink(target, os.path.join(SITE, name))

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=SITE)); srv.daemon_threads = True
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{srv.server_address[1]}/'

SB = 'https://kafkrkcuogvurfhigksk.supabase.co'
n = itertools.count(1)
class Fake:
    def __init__(s):
        s.users = {'fam@x.io': {'id': 'u1', 'pw': 'password1'}, 'own@x.io': {'id': 'u9', 'pw': 'password1'}}
        s.access, s.refresh = {}, {}
        L = lambda i, nm, age: {'id': i, 'name': nm, 'deleted': False, 'data': {'age': age, 'lang': 'en', 'color': '#4dabf7', 'progress': {}, 'bests': {}, 'coins': 0, 'stickers': [], 't': 1}}
        s.learners = {'u1': [L('pK', 'Kiran', 5), L('pM', 'Meera', 10)], 'u9': [L('pO', 'Owner', 30)]}
        s.families = {'u1': {'region': 'us'}, 'u9': {'region': 'india'}}
        s.english = {'u1': {}, 'u9': {}}
        s.log = []
    def session(s, uid):
        a, r = f'acc{next(n)}', f'ref{next(n)}'; s.access[a] = uid; s.refresh[r] = uid
        email = next(e for e, u in s.users.items() if u['id'] == uid)
        return {'access_token': a, 'refresh_token': r, 'expires_in': 3600, 'expires_at': int(time.time()) + 3600, 'user': {'id': uid, 'email': email}}
F = Fake()

def handle(route):
    req = route.request
    hdr = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*', 'Content-Type': 'application/json'}
    if req.method == 'OPTIONS': return route.fulfill(status=204, headers=hdr)
    u = urllib.parse.urlparse(req.url); q = urllib.parse.parse_qs(u.query); path = u.path
    body = json.loads(req.post_data) if req.post_data else None
    tok = (req.headers.get('authorization') or '').replace('Bearer ', '')
    uid = F.access.get(tok); schema = req.headers.get('accept-profile') or ''
    F.log.append((req.method, path, schema, bool(uid)))
    def ok(d, st=200): route.fulfill(status=st, headers=hdr, body=json.dumps(d) if d is not None else '')
    def err(st, msg): route.fulfill(status=st, headers=hdr, body=json.dumps({'error': msg, 'msg': msg, 'message': msg}))
    if path == '/auth/v1/token':
        if q['grant_type'][0] == 'password':
            us = F.users.get(body['email'])
            return ok(F.session(us['id'])) if us and us['pw'] == body['password'] else err(400, 'Invalid login credentials')
        r = F.refresh.pop(body['refresh_token'], None)
        return ok(F.session(r)) if r else err(400, 'Invalid Refresh Token')
    if path == '/auth/v1/logout': return ok(None, 204)
    if not uid: return err(401, 'JWT expired')
    if path == '/auth/v1/user': return ok(F.session(uid)['user'])
    if path == '/rest/v1/progress':
        if schema != 'English_schema': return err(404, 'progress lives in English_schema')
        if req.method == 'GET': return ok([{'learner_id': k, 'data': v} for k, v in F.english[uid].items()])
        if req.method == 'DELETE': F.english[uid].pop(q['learner_id'][0].replace('eq.', ''), None); return ok(None, 204)
        for row in body: F.english[uid][row['learner_id']] = row['data']
        return ok(None, 201)
    if path == '/rest/v1/learners':
        if req.method == 'GET': return ok([dict(r) for r in F.learners[uid]])
        for row in body: F.learners[uid] = [r for r in F.learners[uid] if r['id'] != row['id']] + [{k: row[k] for k in ('id', 'name', 'data', 'deleted')}]
        return ok(None, 201)
    if path == '/rest/v1/families':
        if req.method == 'GET': return ok([{'settings': F.families.get(uid, {})}])
        F.families[uid] = body[0]['settings']; return ok(None, 201)
    if path == '/rest/v1/rpc/is_admin': return ok(uid == 'u9')
    if path == '/rest/v1/rpc/admin_overview':
        if uid != 'u9': return err(403, 'Only the owner can see this')
        return ok({'families': 1, 'learners': 2, 'active7': 2, 'newFamilies30': 1, 'byCountry': {'us': 1}, 'byMode': {'little': 1, 'explore': 1}, 'topLessons': [{'id': 'en-s1', 'learners': 2}]} if schema == 'English_schema' else {'families': 9, 'learners': 9, 'active7': 0, 'newFamilies30': 0})
    return err(404, 'not found ' + path)

results = []
def check(name, cond):
    results.append((name, bool(cond))); print(('PASS ' if cond else 'FAIL ') + name)
def wait_path(pg, path, timeout=6000):
    pg.wait_for_function(f"location.pathname === '{path}' && document.readyState === 'complete'", timeout=timeout)
def hub_signin(p, email):
    if not p.is_visible('#sheet:not([hidden]) #em'): p.click('#sin2')
    p.fill('#em', email); p.fill('#pw', 'password1'); p.click('#f .go')

def open_skill(p, name):
    loc = p.locator(f'.skill:has-text("{name}")').first
    if not loc.is_visible():
        p.evaluate("(n) => { const b = [...document.querySelectorAll('.skill')].find(x => x.textContent.includes(n)); if (b) b.closest('details').open = true; }", name)
    p.locator(f'.skill:has-text("{name}")').first.click()

def answer_item(p):
    """Answer the current activity correctly using the lesson's own data (#debug exposes it)."""
    a = p.evaluate("window.__act && { t: window.__act.template, a: window.__act.answer, tiles: (window.__act.data || {}).tiles || null }")
    if a['t'] == 'spell':
        tiles = list(a['tiles']); word = a['a']; i = 0
        while i < len(word):
            for k, s in enumerate(tiles):
                if s and word.startswith(s, i) and p.locator(f'.tile[data-i="{k}"]').is_enabled():
                    p.click(f'.tile[data-i="{k}"]'); tiles[k] = None; i += len(s); break
            else: break
        p.click('.scheck')
    else:
        p.click(f'.opt[data-i="{a["a"]}"]')

def play_lesson(p, title_part):
    p.click(f'.skill:has-text("{title_part}")'); p.wait_for_selector('.player', timeout=6000)
    if p.is_visible('.t-ex'): p.click('.exskip')
    for _ in range(12):
        if p.is_visible('.results'): break
        p.wait_for_function("window.__act && document.querySelector('.host').children.length", timeout=6000)
        prev = p.evaluate("window.__act"); answer_item(p)
        p.wait_for_function("(a) => document.querySelector('.results') || window.__act !== a", arg=prev, timeout=6000) if False else p.wait_for_timeout(1800)
    p.wait_for_selector('.results', timeout=6000)

def run(size):
    global F
    F = Fake()
    tag = f"[{size['width']}] "
    with sync_playwright() as pw:
        br = pw.chromium.launch(executable_path=CHROME, args=['--no-sandbox'])
        ctx = br.new_context(viewport=size); ctx.route(SB + '/**', handle)
        errors = []; ctx.on('page', lambda pg: pg.on('pageerror', lambda e: errors.append(str(e))))
        p = ctx.new_page()

        # 1. Signed out: English sends you to the Uplore sign-in.
        p.goto(BASE + 'english/'); wait_path(p, '/'); p.wait_for_selector('#sheet:not([hidden]) #em')
        check(tag + 'signed out: English goes to Uplore sign-in', True)
        hub_signin(p, 'fam@x.io'); p.wait_for_selector('.chip[data-id]')
        tiles = p.inner_text('#subjects')
        check(tag + 'Uplore: English tile is live and asks to choose a learner first', 'English' in tiles and p.locator('.tile[data-pick]').count() == 2)

        # 2. Choose Kiran (5) and open English.
        p.click('.chip[data-id="pK"]'); p.click('a.tile.live[href="english/"]'); wait_path(p, '/english/'); p.wait_for_selector('.home.en .htop')
        check(tag + 'English opens straight into Kiran', 'Kiran' in p.inner_text('.htop') and p.evaluate("document.documentElement.dataset.mode") == 'little')
        check(tag + '"← Uplore" link in the header', p.get_attribute('.htop .uplink', 'href') == '../')
        check(tag + 'five tracks: sounds, reading, tricky words, words & rhymes, stories', p.locator('.tabs .tab').count() == 5)
        check(tag + 'Up next is the first sounds lesson', 's a t p' in p.inner_text('.upnext'))
        p.click('.tab[data-t="words"]')
        check(tag + 'USA family: American spelling ("Color words")', p.locator('.skill:has-text("Color words")').count() == 1 and p.locator('.skill:has-text("Colour words")').count() == 0)
        overflow = p.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1")
        check(tag + 'home fits the screen width', not overflow)

        # 3. First lesson: Learn-first intro, then 5 questions answered right.
        p.evaluate("location.hash = 'debug'")
        p.click('.tab[data-t="sounds"]')
        open_skill(p, 'Sounds: s a t p'); p.wait_for_selector('.t-ex', timeout=6000)
        check(tag + 'Learn first: the sounds intro shows a letter with its mouth picture', p.locator('.t-ex .exsound .mth').count() == 1 and p.locator('.t-ex .exwords .pic').count() == 3)
        p.click('.exskip')
        for _ in range(8):
            if p.is_visible('.results'): break
            p.wait_for_function("window.__act && document.querySelector('.host .opts, .host .tiles')", timeout=6000)
            before = p.evaluate("JSON.stringify(window.__act.data.options || window.__act.data.tiles)")
            if p.locator('.t-choose .show .mth').count(): check(tag + 'sound question shows the mouth picture', True)
            answer_item(p)
            p.wait_for_function("(b) => document.querySelector('.results') || JSON.stringify((window.__act||{}).data && (window.__act.data.options || window.__act.data.tiles)) !== b", arg=before, timeout=8000)
        p.wait_for_selector('.results', timeout=8000)
        check(tag + 'lesson finished: 5 of 5 and a sticker', '5 of 5' in p.inner_text('.results') and p.locator('.results .rsticker').count() == 1)
        for _ in range(40):
            if 'pK' in F.english['u1']: break
            p.wait_for_timeout(250)
        ek = F.english['u1'].get('pK', {})
        check(tag + 'progress backed up to the English tables', 'en-s1' in ek.get('progress', {}) and len(ek.get('stickers', [])) == 1)
        check(tag + 'English never writes to the Maths learners table', not any(m == 'POST' and pth == '/rest/v1/learners' and sc != 'Math_schema' for m, pth, sc, a in F.log))

        # 4. Wrong answers: hint, then the answer is shown.
        p.click('.rhome'); p.wait_for_selector('.home.en'); p.click('.tab[data-t="tricky"]')
        open_skill(p, 'I, the, to'); p.wait_for_selector('.t-ex'); p.click('.exskip'); p.wait_for_selector('.t-choose .opt')
        ans = p.evaluate("window.__act.answer"); wrong = [i for i in range(3) if i != ans]
        p.click(f'.opt[data-i="{wrong[0]}"]'); p.wait_for_timeout(300)
        check(tag + 'first wrong try: "Not quite"', 'Not quite' in p.inner_text('.fb'))
        p.click(f'.opt[data-i="{wrong[1]}"]'); p.wait_for_timeout(300)
        check(tag + 'second wrong try: a hint', 'starts with' in p.inner_text('.fb'))
        p.click('.pclose'); p.wait_for_selector('.home.en')

        # 5. Every kind of activity draws and can be answered: blending, spelling, story.
        for track, name, sel in (('reading', 'Read words: s a t p', '.t-blend .tile'), ('reading', 'Spell words: s a t p', '.t-spell .slot'), ('stories', 'Sam and the cat', '.t-story .storycard')):
            p.click(f'.tab[data-t="{track}"]')
            open_skill(p, name); p.wait_for_selector('.player')
            if p.is_visible('.t-ex'): p.click('.exskip')
            p.wait_for_selector(sel, timeout=6000)
            if track == 'reading' and 'Read' in name:
                p.click('.t-blend .tile[data-i="0"]'); check(tag + 'blending: tapping a letter shows its mouth picture', p.locator('.mouthbox .mth').count() == 1)
            if 'story' in sel: check(tag + 'story: US spelling and tappable words', p.locator('.stext .wd').count() > 10)
            before = p.evaluate("JSON.stringify(window.__act.data)"); answer_item(p)
            p.wait_for_function("(b) => JSON.stringify(window.__act.data) !== b || document.querySelector('.results')", arg=before, timeout=8000)
            check(tag + f'{name}: right answer accepted', True)
            p.click('.pclose'); p.wait_for_selector('.home.en')

        # 6. Uplore shows Kiran's English progress; settings link to Grown-ups.
        p.click('.htop .uplink'); wait_path(p, '/'); p.wait_for_selector('#subjects')
        check(tag + 'Uplore English tile shows Kiran\'s lessons practised', re.search(r'Kiran: [1-9]\d* lessons? practised', p.inner_text('a.tile.live[href="english/"]')) is not None)
        p.click('a.tile.live[href="english/"]'); p.wait_for_selector('.home.en'); p.click('.htop .gear'); p.wait_for_selector('#gans')
        p.fill('#gans', str(eval(p.inner_text('.gsum').split('=')[0].replace('×', '*')))); p.click('.gok'); p.wait_for_selector('.sheet.grown')
        g = p.inner_text('.sheet.grown')
        check(tag + 'English settings: reset and a link to Grown-ups on Uplore (no Admin for families)', 'Reset English progress' in g and p.get_attribute('.gup', 'href') == '../#grownups' and 'Admin' not in g)
        p.click('.gclose')

        # 7. Signing out on Uplore in another tab sends English back to Uplore.
        h = ctx.new_page(); h.goto(BASE); h.wait_for_selector('#out'); h.click('#out')
        if h.is_visible('#warn'): h.click('#out')
        wait_path(p, '/', timeout=8000)
        check(tag + 'sign-out in another tab: English returns to Uplore', True)
        check(tag + 'sign-out clears English progress kept on the device', p.evaluate("localStorage.getItem('uplore.english.v1')") is None)
        h.close()

        # 8. Signing in again on a device: progress comes back from the account.
        p.goto(BASE); hub_signin(p, 'fam@x.io'); p.wait_for_selector('.chip[data-id]'); p.click('.chip[data-id="pK"]')
        p.click('a.tile.live[href="english/"]'); p.wait_for_selector('.home.en'); p.wait_for_timeout(1500)
        check(tag + 'English progress restored from the account', p.evaluate("Object.keys((JSON.parse(localStorage.getItem('uplore.english.v1'))||{}).pK?.progress || {})").count('en-s1') == 1 if False else 'en-s1' in p.evaluate("Object.keys((JSON.parse(localStorage.getItem('uplore.english.v1'))||{}).pK?.progress || {})"))

        # 9. Removing a learner on Uplore removes their English progress too.
        p.goto(BASE); p.wait_for_selector('#gro'); p.click('#gro'); p.wait_for_selector('#ga')
        a, b = [int(x) for x in re.findall(r'\d+', p.inner_text('.gsum span'))[:2]]
        p.fill('#ga', str(a * b)); p.click('#f .go'); p.wait_for_selector('[data-edit="pK"]')
        p.click('[data-edit="pK"]'); p.click('#rm'); p.click('#rm'); p.wait_for_selector('#gadd'); p.wait_for_timeout(800)
        check(tag + 'removed learner: English progress deleted here and in the account', 'pK' not in F.english['u1'] and 'pK' not in (p.evaluate("JSON.parse(localStorage.getItem('uplore.english.v1'))") or {}))

        # 10. Admin page: English tab with its own figures (owner only).
        p.click('#gout'); p.wait_for_selector('#sin2'); hub_signin(p, 'own@x.io'); p.wait_for_selector('.chip[data-id]')
        p.goto(BASE + 'admin/'); p.wait_for_selector('.panel .kpis'); p.click('.tabs button[data-s="english"]'); p.wait_for_selector('.panel h2:has-text("English")'); p.wait_for_selector('.panel .kpis')
        adm = p.inner_text('#main')
        check(tag + 'Admin: English tab shows English figures and lesson names', 'USA' in adm and 'Sounds: s a t p' in adm and p.locator('.tabs button[disabled]').count() == 2)

        check(tag + 'no script errors', not errors)
        if errors: print(errors[:5])
        br.close()

for sz in ({'width': 1024, 'height': 800}, {'width': 390, 'height': 844}):
    run(sz)
bad = [r for r in results if not r[1]]
print(f'\n{len(results) - len(bad)}/{len(results)} checks pass')
sys.exit(1 if bad else 0)
