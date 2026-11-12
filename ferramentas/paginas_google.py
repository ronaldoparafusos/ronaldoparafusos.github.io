#!/usr/bin/env python3
"""Gera páginas simples (que o Google consegue ler) para cada categoria e para as marcas principais,
e atualiza o sitemap.xml. Rodar na raiz do repositório:  python3 ferramentas/paginas_google.py
As páginas leem a lista de produtos do JSON <script id="data"> do index.html."""
import json, re, unicodedata, html, datetime, os, shutil
SITE = "https://ronaldoparafusos.com.br"
MIN_MARCA = 15  # marcas com pelo menos esse número de produtos ganham página
s = open("index.html", encoding="utf-8").read()
M = '<script id="data" type="application/json">'
a = s.index(M) + len(M); b = s.index("</script>", a)
d = json.loads(s[a:b])
prods = [p for p in d["prods"] if p.get("n")]
dels = set(d.get("del") or [])
prods = [p for p in prods if p["id"] not in dels]
cats = d["cats"]
def slug(n):
    n = unicodedata.normalize("NFD", n.lower()); n = "".join(c for c in n if unicodedata.category(c) != "Mn")
    return re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9]+", "-", n))
e = html.escape
today = datetime.date.today().isoformat()
CSS = """*{box-sizing:border-box}body{margin:0;font:16px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1d2024;background:#f4f3ef}
a{color:#2b4ea2}header{background:#fff;border-bottom:4px solid #f5c518}header .w{display:flex;align-items:center;gap:14px;padding:10px 16px}
header img{height:44px;width:auto}.w{max-width:1100px;margin:0 auto;padding:16px}h1{font-size:28px;margin:8px 0}
.btn{display:inline-block;background:#f5c518;color:#1d2024;font-weight:700;text-decoration:none;padding:11px 18px;border-radius:8px;border:2px solid #1d2024;margin:6px 8px 6px 0}
.btn.b{background:#2b4ea2;color:#fff;border-color:#2b4ea2}ul.l{list-style:none;padding:0;margin:14px 0;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:6px}
ul.l a{display:block;background:#fff;border:1px solid #ddd;border-radius:8px;padding:9px 11px;text-decoration:none;color:#1d2024}ul.l a:hover{border-color:#2b4ea2}
nav.c{display:flex;flex-wrap:wrap;gap:6px;margin:20px 0}nav.c a{background:#fff;border:1px solid #ccc;border-radius:20px;padding:6px 12px;text-decoration:none;font-size:14px}
footer{background:#2b4ea2;color:#fff;margin-top:30px}footer a{color:#fff}small{color:#555}"""
def nav_html():
    return '<nav class="c" aria-label="Categorias">' + "".join(
        f'<a href="/categoria/{slug(c["n"])}/">{e(c["n"])}</a>' for c in cats) + "</nav>"
def page(path, title, h1, intro, items, app_hash):
    url = f"{SITE}/{path}/"
    lis = "".join(f'<li><a href="/#p-{e(p["id"])}">{e(p["n"])}</a></li>' for p in sorted(items, key=lambda p: p["n"].lower()))
    ld = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Ronaldo Parafusos", "item": SITE + "/"},
        {"@type": "ListItem", "position": 2, "name": h1, "item": url}]}
    doc = f"""<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title><meta name="description" content="{e(intro[:155])}"><link rel="canonical" href="{url}">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:title" content="{e(title)}"><meta property="og:url" content="{url}"><meta property="og:image" content="{SITE}/img/og-ronaldo-parafusos-v5.jpg">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script><style>{CSS}</style></head><body>
<header><div class="w"><a href="/"><img src="/img/0839075d551e07b4f116e808714a3049.png" alt="Ronaldo Parafusos"></a></div></header>
<main class="w"><p><small><a href="/">Início</a> › {e(h1)}</small></p><h1>{e(h1)}</h1><p>{e(intro)}</p>
<p><a class="btn" href="/{app_hash}">Ver com fotos no catálogo</a><a class="btn b" href="https://wa.me/5563984514163">Pedir orçamento no WhatsApp</a></p>
<ul class="l">{lis}</ul>{nav_html()}</main>
<footer><div class="w"><b>Ronaldo Parafusos</b> · Av. Pedro Ludovico Teixeira, 2034 - Centro, Colinas do Tocantins (TO) · <a href="tel:+556334761955">(63) 3476-1955</a> · <a href="/termos.html">Termos de Uso</a></div></footer>
</body></html>"""
    os.makedirs(path, exist_ok=True)
    open(f"{path}/index.html", "w", encoding="utf-8").write(doc)
    return url
for base in ("categoria", "marca"):
    if os.path.isdir(base): shutil.rmtree(base)
urls = []
for c in cats:
    it = [p for p in prods if p.get("c") == c["id"]]
    if not it: continue
    n = c["n"]
    urls.append(page(f"categoria/{slug(n)}", f"{n} | Ronaldo Parafusos - Colinas do Tocantins",
        n, f"{n} na Ronaldo Parafusos, em Colinas do Tocantins (TO): {len(it)} itens. Consulte preço e disponibilidade pelo WhatsApp ou telefone.",
        it, f"#cat-{c['id']}"))
bc = {}
for p in prods:
    if p.get("brand"): bc.setdefault(p["brand"], []).append(p)
for bn, it in sorted(bc.items(), key=lambda x: -len(x[1])):
    if len(it) < MIN_MARCA: continue
    urls.append(page(f"marca/{slug(bn)}", f"{bn} | Ronaldo Parafusos - Colinas do Tocantins",
        f"Produtos {bn}", f"Produtos {bn} na Ronaldo Parafusos, em Colinas do Tocantins (TO): {len(it)} itens. Consulte preço e disponibilidade pelo WhatsApp ou telefone.",
        it, f"#marca-{slug(bn)}"))
sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
def add(u, f, pr): sm.append(f"  <url>\n    <loc>{u}</loc>\n    <lastmod>{today}</lastmod>\n    <changefreq>{f}</changefreq>\n    <priority>{pr}</priority>\n  </url>")
add(SITE + "/", "weekly", "1.0")
for u in urls: add(u, "weekly", "0.7" if "/categoria/" in u else "0.6")
add(SITE + "/termos.html", "yearly", "0.3")
sm.append("</urlset>")
open("sitemap.xml", "w", encoding="utf-8").write("\n".join(sm) + "\n")
print(len(urls), "páginas")
