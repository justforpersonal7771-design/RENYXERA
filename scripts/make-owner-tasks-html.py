"""Builds docs/open-work/owner-tasks.html from OWNER-TASKS.md.
Ticking a box in the page strikes the line and is remembered in the browser (localStorage).
Run: python scripts/make-owner-tasks-html.py
"""
import html, re, os

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = os.path.join(root, 'docs', 'open-work', 'OWNER-TASKS.md')
out = os.path.join(root, 'docs', 'open-work', 'owner-tasks.html')
lines = open(src, encoding='utf-8').read().split('\n')


def inline(t):
    t = html.escape(t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', t)
    return t


body = []
n = 0
for l in lines:
    s = l.strip()
    if not s or s == '---':
        continue
    if s.startswith('# '):
        body.append('<h1>%s</h1>' % inline(s[2:]))
    elif s.startswith('## '):
        body.append('<h2>%s</h2>' % inline(s[3:]))
    elif s.startswith('- [') or re.match(r'^(- \[[ x]\].*)', s):
        pass
    if s.startswith('- [') or s.startswith('  - ['):
        indent = ' sub' if l.startswith('  ') else ''
        # a line can hold several boxes, e.g. "- [ ] GitHub  - [ ] Cloudflare"
        for m in re.finditer(r'\[( |x)\] (.+?)(?=\s{2}- \[[ x]\]|$)', s):
            n += 1
            done = ' checked' if m.group(1) == 'x' else ''
            body.append('<label class="t%s"><input type="checkbox" data-id="t%d"%s> <span>%s</span></label>' % (indent, n, done, inline(m.group(2))))
    elif not s.startswith('#'):
        body.append('<p>%s</p>' % inline(s))

page = '''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Owner tasks</title>
<style>
:root{--bg:#fff;--fg:#1c1b22;--mut:#6b6880;--line:#e6e4ef;--acc:#6d4aff}
@media(prefers-color-scheme:dark){:root{--bg:#14131a;--fg:#ecebf3;--mut:#9a98ad;--line:#2a2835;--acc:#a790ff}}
body{margin:0;padding:16px;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,sans-serif}
h1{font-size:22px}h2{font-size:17px;margin-top:28px;border-bottom:1px solid var(--line);padding-bottom:6px}
.t{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);cursor:pointer}.sub{margin-left:28px}
.t input{margin-top:4px;accent-color:var(--acc);width:18px;height:18px;flex:none}
.t:has(input:checked) span{text-decoration:line-through;color:var(--mut)}
code{background:var(--line);padding:1px 5px;border-radius:4px}a{color:var(--acc)}p{color:var(--mut)}
#c{position:sticky;top:0;background:var(--bg);padding:6px 0;font-weight:600}
</style></head><body><div id="c"></div>%s
<script>
const K='renyxera-owner-tasks';let s={};try{s=JSON.parse(localStorage.getItem(K)||'{}')}catch(e){}
const bx=[...document.querySelectorAll('input[data-id]')];
function show(){document.getElementById('c').textContent=bx.filter(b=>b.checked).length+' of '+bx.length+' done'}
bx.forEach(b=>{if(b.dataset.id in s)b.checked=s[b.dataset.id];b.onchange=()=>{s[b.dataset.id]=b.checked;try{localStorage.setItem(K,JSON.stringify(s))}catch(e){}show()}});show();
</script></body></html>''' % '\n'.join(body)
open(out, 'w', encoding='utf-8').write(page)
print('boxes', n, '->', out)
