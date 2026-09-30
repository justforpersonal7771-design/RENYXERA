"""Step 6: local review tool for FLAGGED questions only.

    python scripts/pyq/review.py EC --paper EC_2026
    -> open http://localhost:8765

Each flagged question shows the official PDF page next to our rendered version (MathJax),
the flags, the official answer and the cropped images. Approve it as-is, or edit the text /
options and approve. Decisions are saved to data/pyq/<BRANCH>/reviews/<paper>.json, which
build.py applies (reviewer edits win). Runs only on your machine; nothing is uploaded.
"""
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import PYQ, WORK, read_json, write_json  # noqa: E402

PAGE = r"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>PYQ review</title>
<script>window.MathJax={tex:{inlineMath:[['\\(','\\)']],displayMath:[['\\[','\\]'],['$$','$$']]}};</script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js" async></script>
<style>
:root{--bg:#f7f7fb;--card:#fff;--line:#e4e4ee;--ink:#1d1d2b;--muted:#6b6b80;--ok:#0a7d4f;--warn:#b45309;--brand:#6d28d9}
@media (prefers-color-scheme:dark){:root{--bg:#0f0f16;--card:#181824;--line:#2a2a3a;--ink:#ececf4;--muted:#9a9ab0}}
body{margin:0;font:14px/1.5 system-ui,sans-serif;background:var(--bg);color:var(--ink)}
header{position:sticky;top:0;background:var(--card);border-bottom:1px solid var(--line);padding:10px 16px;display:flex;gap:12px;align-items:center;z-index:2}
main{max-width:1500px;margin:0 auto;padding:16px}.q{background:var(--card);border:1px solid var(--line);border-radius:14px;margin:0 0 16px;overflow:hidden}
.q.done{opacity:.55}.head{display:flex;gap:10px;align-items:center;padding:10px 14px;border-bottom:1px solid var(--line)}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:0}@media (max-width:900px){.grid{grid-template-columns:1fr}}
.col{padding:12px 14px;min-width:0}.col+.col{border-left:1px solid var(--line)}img.page{width:100%;border:1px solid var(--line);border-radius:8px}
.flags{color:var(--warn);font-size:13px;margin:0;padding-left:18px}.opt{padding:6px 8px;border:1px solid var(--line);border-radius:8px;margin:6px 0}
.opt.ok{border-color:var(--ok)}.figs img{max-width:100%;border:1px dashed var(--line);border-radius:6px;margin:4px 0;display:block}
textarea{width:100%;min-height:90px;font:12px ui-monospace,monospace;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink);padding:8px;box-sizing:border-box}
button{font:inherit;padding:7px 14px;border-radius:9px;border:0;cursor:pointer}.approve{background:var(--ok);color:#fff}.edit{background:var(--line);color:var(--ink)}
.pill{font-size:12px;padding:2px 8px;border-radius:99px;background:var(--line)}.muted{color:var(--muted)}
</style></head><body><header><b>PYQ review</b><span id="meta" class="muted"></span><span style="flex:1"></span><span id="count" class="pill"></span></header><main id="list"></main>
<script>
const esc=s=>String(s??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const withImgs=(t,paper)=>esc(t).replace(/\[IMAGE_Q_(\d{2})_([A-D]|\d+)\]/g,(m,q,n)=>`<img src="/img/${paper}/Q${q}_${n}.png" alt="${m}" style="max-width:100%;display:block;margin:6px 0">`).replace(/\n/g,'<br>');
async function load(){const d=await (await fetch('/data')).json();document.getElementById('meta').textContent=`${d.paper} · ${d.flagged.length} flagged of ${d.total}`;
 const list=document.getElementById('list');list.innerHTML='';let done=0;
 for(const it of d.flagged){const r=d.reviews[it.qno];if(r)done++;const q=it.q||{question_text:'(missing)',options:[]};const k=it.key;
  const correct=new Set((k.answer.options||[]));const el=document.createElement('section');el.className='q'+(r?' done':'');
  el.innerHTML=`<div class="head"><b>Q${it.qno}</b><span class="pill">${k.type} · ${k.marks} mark(s) · key ${esc(k.raw)}</span>${r?`<span class="pill" style="color:var(--ok)">✓ ${r.status}</span>`:''}</div>
  <div class="grid"><div class="col"><div class="muted">Official PDF (page ${(it.pages||[]).join(', ')})</div>${(it.pages||[]).map(p=>`<img class="page" src="/page/${String(p).padStart(3,'0')}">`).join('')}</div>
  <div class="col"><ul class="flags">${it.flags.map(f=>`<li>${esc(f)}</li>`).join('')}</ul><div class="muted">Our version</div><div class="qt">${withImgs(q.question_text,d.paper)}</div>
  ${(q.options||[]).map(o=>`<div class="opt ${correct.has(o.option_id)?'ok':''}"><b>${o.option_id}.</b> ${withImgs(o.text,d.paper)}</div>`).join('')}
  ${k.answer.nat?`<div class="opt ok">NAT answer: ${k.answer.nat.map(r=>r.join(' to ')).join(' or ')}</div>`:''}
  <details style="margin-top:10px"><summary>Edit text / options (JSON)</summary><textarea id="e${it.qno}">${esc(JSON.stringify({question_text:q.question_text,options:q.options},null,1))}</textarea>
  <button class="edit" data-q="${it.qno}" data-edit="1">Save edits &amp; approve</button></details>
  <p><button class="approve" data-q="${it.qno}">Approve as shown</button></p></div></div>`;list.appendChild(el);}
 document.getElementById('count').textContent=`${done}/${d.flagged.length} reviewed`;
 list.querySelectorAll('button[data-q]').forEach(b=>b.onclick=async()=>{const qno=b.dataset.q;let edits=null;
  if(b.dataset.edit){try{edits=JSON.parse(document.getElementById('e'+qno).value)}catch(e){alert('Invalid JSON: '+e.message);return}}
  await fetch('/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({qno,status:'approved',edits})});load();});
 if(window.MathJax&&MathJax.typesetPromise)MathJax.typesetPromise();}
load();
</script></body></html>"""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("branch")
    ap.add_argument("--paper", required=True)
    ap.add_argument("--port", type=int, default=8765)
    a = ap.parse_args()
    code, pid = a.branch.upper(), a.paper
    work = WORK / code / pid
    rev_path = PYQ / code / "reviews" / f"{pid}.json"

    class H(BaseHTTPRequestHandler):
        def log_message(self, *args):  # quiet
            pass

        def send(self, code_, body: bytes, ctype: str):
            self.send_response(code_)
            self.send_header("Content-Type", ctype)
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            if self.path == "/":
                return self.send(200, PAGE.encode(), "text/html; charset=utf-8")
            if self.path == "/data":
                val = read_json(work / "validated.json", {}) or {}
                qs = {q["qno"]: q for q in (read_json(work / "questions.pass_a.json", {}) or {}).get("questions", [])}
                flagged = [{**v, "q": qs.get(v["qno"])} for v in val.get("questions", []) if v["flags"]]
                data = {"paper": pid, "total": val.get("total", 0), "flagged": flagged, "reviews": read_json(rev_path, {}) or {}}
                return self.send(200, json.dumps(data, ensure_ascii=False).encode(), "application/json")
            if self.path.startswith("/page/"):
                p = work / "pages" / f"p{self.path.rsplit('/', 1)[-1]}.png"
                return self.send(200, p.read_bytes(), "image/png") if p.exists() else self.send(404, b"", "text/plain")
            if self.path.startswith("/img/"):
                _, _, paper, name = self.path.split("/", 3)
                p = PYQ / code / "images" / paper / Path(name).name
                return self.send(200, p.read_bytes(), "image/png") if p.exists() else self.send(404, b"", "text/plain")
            return self.send(404, b"", "text/plain")

        def do_POST(self):
            if self.path != "/save":
                return self.send(404, b"", "text/plain")
            body = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))) or b"{}")
            reviews = read_json(rev_path, {}) or {}
            reviews[str(body["qno"])] = {"status": "approved", "edits": body.get("edits"), "at": datetime.now(timezone.utc).isoformat(timespec="seconds")}
            write_json(rev_path, reviews)
            return self.send(200, b"{}", "application/json")

    print(f"Review {pid}: open http://localhost:{a.port}  (Ctrl+C to stop)")
    ThreadingHTTPServer(("127.0.0.1", a.port), H).serve_forever()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
