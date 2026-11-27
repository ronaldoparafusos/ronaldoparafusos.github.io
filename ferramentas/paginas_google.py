#!/usr/bin/env python3
"""(26/11/2026, pedido do dono) Páginas SEM redirecionamento automático (o redirecionamento fazia o Google tratar como desvio
para a página inicial); o botão "Abrir no catálogo completo" leva à categoria/marca no site completo.
Gera páginas simples (que o Google consegue ler) para cada categoria e para as marcas principais,
e atualiza o sitemap.xml. Rodar na raiz do repositório:  python3 ferramentas/paginas_google.py
As páginas leem a lista de produtos do JSON <script id="data"> do index.html."""
import json, re, unicodedata, html, datetime, os, shutil, urllib.parse
SITE = "https://ronaldoparafusos.com.br"
MIN_MARCA = 15  # marcas com pelo menos esse número de produtos ganham página
s = open("index.html", encoding="utf-8").read()
M = '<script id="data" type="application/json">'
a = s.index(M) + len(M); b = s.index("</script>", a)
d = json.loads(s[a:b])
# (26/11/2026) Usa a lista mais nova do Supabase (inclui edições feitas no painel); se não conseguir, fica com o index.html
try:
    import urllib.request
    cfg = open("config.js", encoding="utf-8").read()
    u_ = re.search(r'url:\s*"([^"]+)"', cfg).group(1); k_ = re.search(r'key:\s*"([^"]+)"', cfg).group(1)
    rq = urllib.request.Request(u_ + "/rest/v1/site?select=data", headers={"apikey": k_})
    d2 = json.loads(urllib.request.urlopen(rq, timeout=60).read())[0]["data"]
    if len(d2.get("prods") or []) > 100: d = d2; print("dados: Supabase")
except Exception as ex:
    print("dados: index.html (Supabase indisponível:", ex, ")")
prods = [p for p in d["prods"] if p.get("n")]
dels = set(d.get("del") or [])
prods = [p for p in prods if p["id"] not in dels]
cats = d["cats"]
def slug(n):
    n = unicodedata.normalize("NFD", n.lower()); n = "".join(c for c in n if unicodedata.category(c) != "Mn")
    return re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9]+", "-", n))
e = html.escape
def ppath(p):
    """Endereço da página própria do produto (26/11/2026)."""
    return f"produto/{(slug(str(p['n']).strip())[:70].strip('-') or 'item')}-{slug(str(p['id']))}"
today = datetime.date.today().isoformat()
CSS = """*{box-sizing:border-box}body{margin:0;font:16px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1d2024;background:#f4f3ef}
a{color:#2b4ea2}header{background:#fff;border-bottom:4px solid #f5c518}header .w{display:flex;align-items:center;gap:14px;padding:10px 16px}
header img{height:44px;width:auto}.w{max-width:1100px;margin:0 auto;padding:16px}h1{font-size:28px;margin:8px 0}
.btn{display:inline-block;background:#f5c518;color:#1d2024;font-weight:700;text-decoration:none;padding:11px 18px;border-radius:8px;border:2px solid #1d2024;margin:6px 8px 6px 0}
.btn.b{background:#2b4ea2;color:#fff;border-color:#2b4ea2}ul.l{list-style:none;padding:0;margin:14px 0;display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px}
ul.l a{display:flex;flex-direction:column;height:100%;background:#fff;border:1px solid #ddd;border-radius:10px;padding:8px;text-decoration:none;color:#1d2024}ul.l a:hover{border-color:#2b4ea2;box-shadow:0 2px 8px rgba(0,0,0,.08)}
ul.l .f{aspect-ratio:1/1;background:#fff;border-radius:6px;display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:8px}
ul.l .f img{width:100%;height:100%;object-fit:contain}ul.l .f.s{background:#eef1f7}ul.l .f.s img{width:45%;height:auto;opacity:.5}
ul.l .n{font-size:14px;line-height:1.3}ul.l .m{font-size:12px;color:#555;margin-top:4px}ul.l .v{margin-top:auto;padding-top:6px;font-size:12.5px;color:#2b4ea2;font-weight:600}
.dica{background:#fff8dc;border:1px solid #f5c518;border-radius:8px;padding:8px 12px;font-size:14px}
nav.c{display:flex;flex-wrap:wrap;gap:6px;margin:20px 0}nav.c a{background:#fff;border:1px solid #ccc;border-radius:20px;padding:6px 12px;text-decoration:none;font-size:14px}
footer{background:#2b4ea2;color:#fff;margin-top:30px}footer a{color:#fff}small{color:#555}"""
def nav_html():
    return '<nav class="c" aria-label="Categorias">' + "".join(
        f'<a href="/categoria/{slug(c["n"])}/">{e(c["n"])}</a>' for c in cats) + "</nav>"
def page(path, title, h1, intro, items, app_hash):
    url = f"{SITE}/{path}/"
    def foto(p):
        im = str(p.get("img") or "")
        if not im: return '<span class="f s"><img src="/favicon-192.png" alt="" loading="lazy" width="80" height="80"></span>'
        if not im.startswith("http"): im = "/" + im.lstrip("/")
        return f'<span class="f"><img src="{e(im)}" alt="{e(p["n"])}" loading="lazy" decoding="async" width="200" height="200"></span>'
    lis = "".join(f'<li><a href="/{ppath(p)}/">{foto(p)}<span class="n">{e(p["n"])}</span>'
                  + (f'<span class="m">{e(p["brand"])}</span>' if p.get("brand") else "")
                  + '<span class="v">Ver detalhes ›</span></a></li>' for p in sorted(items, key=lambda p: p["n"].lower()))
    ld = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Ronaldo Parafusos", "item": SITE + "/"},
        {"@type": "ListItem", "position": 2, "name": h1, "item": url}]}
    doc = f"""<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title><meta name="description" content="{e(intro[:155])}"><link rel="canonical" href="{url}">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:title" content="{e(title)}"><meta property="og:url" content="{url}"><meta property="og:image" content="{SITE}/img/og-ronaldo-parafusos-v5.jpg">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
<style>{CSS}</style></head><body>
<header><div class="w"><a href="/"><img src="/img/0839075d551e07b4f116e808714a3049.webp" alt="Ronaldo Parafusos"></a></div></header>
<main class="w"><p><small><a href="/">Início</a> › {e(h1)}</small></p><h1>{e(h1)}</h1><p>{e(intro)}</p>
<p><a class="btn" href="/{app_hash}">Abrir no catálogo completo</a><a class="btn b" href="https://wa.me/5563984514163">Pedir orçamento no WhatsApp</a></p>
<p class="dica">Toque no produto para ver a foto grande, a descrição e a ficha técnica.</p>
<ul class="l">{lis}</ul>{nav_html()}</main>
<footer><div class="w"><b>Ronaldo Parafusos</b> · Av. Pedro Ludovico Teixeira, 2034 - Centro, Colinas do Tocantins (TO) · <a href="tel:+556334761955">(63) 3476-1955</a> · <a href="https://wa.me/5563984514163">WhatsApp (63) 98451-4163</a> · <a href="/contato/">Contato</a> · <a href="/termos.html">Termos de Uso</a></div></footer>
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
# ---------- Páginas de produto (26/11/2026) ----------
# Uma página leve por produto em /produto/<nome>-<id>/ (nome, marca, código, foto, descrição; NUNCA preço).
# Sem redirecionamento automático (redirecionar para "/#p-id" faria o Google tratar a página como desvio para a
# página inicial e não indexar o produto); o botão grande leva ao catálogo completo. CSS compartilhado em /produto/p.css.
PCSS = CSS + """.pp{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:22px;background:#fff;border:1px solid #ddd;border-radius:12px;padding:16px}
.pp .fo{aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;background:#fff}.pp .fo img{max-width:100%;max-height:100%;object-fit:contain}
.pp h1{font-size:24px}.pp .mc{color:#555;margin:4px 0 12px}.pp .tx{white-space:pre-line}.pp .ft{white-space:pre-line;background:#f7f7f7;border-radius:8px;padding:10px;font-size:14px}
.gl{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.gl img{width:72px;height:72px;object-fit:contain;border:1px solid #ddd;border-radius:6px;background:#fff}
@media(max-width:700px){.pp{grid-template-columns:1fr}}"""
os.makedirs("produto", exist_ok=True)
open("produto/p.css", "w", encoding="utf-8").write(PCSS)
for old_ in os.listdir("produto"):
    if os.path.isdir(os.path.join("produto", old_)): shutil.rmtree(os.path.join("produto", old_))
catn = {c["id"]: c["n"] for c in cats}
def img_url(im):
    im = str(im or "")
    if not im: return ""
    return im if im.startswith("http") else "/" + im.lstrip("/")
def galeria(p):
    g = p.get("gal") or []
    if isinstance(g, str):
        g = re.findall(r"'([^']+)'|\"([^\"]+)\"", g); g = [x[0] or x[1] for x in g]
    out = []
    for x in [p.get("img")] + list(g):
        u_ = img_url(x)
        if u_ and u_ not in out: out.append(u_)
    return out
purls = []
for p in sorted(prods, key=lambda x: x["id"]):
    pid = str(p["id"]); nome = str(p["n"]).strip()
    if not re.fullmatch(r"[A-Za-z0-9_-]{1,40}", pid) or not nome: continue
    path = ppath(p)
    url = f"{SITE}/{path}/"
    marca = str(p.get("brand") or "").strip(); cod = str(p.get("code") or "").strip()
    cn = catn.get(p.get("c"), ""); fotos = galeria(p)
    desc = str(p.get("d") or "").strip(); ficha = str(p.get("s") or "").strip()
    meta = (nome + (" - " + marca if marca else "") + ". " + (desc or f"{cn} na Ronaldo Parafusos, Colinas do Tocantins (TO).")).replace("\n", " ")[:155]
    titulo = f"{nome}{' ' + marca if marca and marca.lower() not in nome.lower() else ''} | Ronaldo Parafusos"
    bc = [{"@type": "ListItem", "position": 1, "name": "Ronaldo Parafusos", "item": SITE + "/"}]
    if cn: bc.append({"@type": "ListItem", "position": 2, "name": cn, "item": f"{SITE}/categoria/{slug(cn)}/"})
    bc.append({"@type": "ListItem", "position": len(bc) + 1, "name": nome, "item": url})
    ld = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": bc}
    principal = (f'<img src="{e(fotos[0])}" alt="{e(nome)}" width="500" height="500" decoding="async">' if fotos
                 else '<img src="/favicon-192.png" alt="" width="120" height="120">')
    mini = "".join(f'<img src="{e(f)}" alt="{e(nome)} - foto {i + 2}" loading="lazy" width="72" height="72">' for i, f in enumerate(fotos[1:6]))
    wa = "https://wa.me/5563984514163?text=" + urllib.parse.quote(f"Olá! Vi no site e quero saber preço e disponibilidade: {nome}" + (f" (código {cod})" if cod else ""))
    doc = f"""<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(titulo)}</title><meta name="description" content="{e(meta)}"><link rel="canonical" href="{url}">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:title" content="{e(titulo)}"><meta property="og:url" content="{url}"><meta property="og:image" content="{e(SITE + fotos[0] if fotos and fotos[0].startswith('/') else (fotos[0] if fotos else SITE + '/img/og-ronaldo-parafusos-v5.jpg'))}">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script><link rel="stylesheet" href="/produto/p.css"></head><body>
<header><div class="w"><a href="/"><img src="/img/0839075d551e07b4f116e808714a3049.webp" alt="Ronaldo Parafusos" width="160" height="44"></a></div></header>
<main class="w"><p><small><a href="/">Início</a>{f' › <a href="/categoria/{slug(cn)}/">{e(cn)}</a>' if cn else ''} › {e(nome)}</small></p>
<div class="pp"><div><div class="fo">{principal}</div>{f'<div class="gl">{mini}</div>' if mini else ''}</div>
<div><h1>{e(nome)}</h1><p class="mc">{e(marca) + ' · ' if marca else ''}{'Código ' + e(cod) if cod else ''}</p>
{f'<p class="tx">{e(desc)}</p>' if desc else ''}{f'<p class="ft">{e(ficha)}</p>' if ficha else ''}
<p><a class="btn" href="/#p-{e(pid)}">Ver no catálogo completo</a><a class="btn b" href="{e(wa)}">Consultar preço no WhatsApp</a></p>
<p><small>Loja física em Colinas do Tocantins (TO). Preço e disponibilidade pelo WhatsApp (63) 98451-4163 ou telefone (63) 3476-1955.</small></p></div></div>
{nav_html()}</main>
<footer><div class="w"><b>Ronaldo Parafusos</b> · Av. Pedro Ludovico Teixeira, 2034 - Centro, Colinas do Tocantins (TO) · <a href="tel:+556334761955">(63) 3476-1955</a> · <a href="https://wa.me/5563984514163">WhatsApp (63) 98451-4163</a> · <a href="/contato/">Contato</a> · <a href="/termos.html">Termos de Uso</a></div></footer>
</body></html>"""
    os.makedirs(path, exist_ok=True)
    open(f"{path}/index.html", "w", encoding="utf-8").write(doc)
    purls.append(url)
print(len(purls), "páginas de produto")
# (26/11/2026, pedido do dono) Página de contato: telefone, WhatsApp, e-mail, endereço e horário escritos, para o Google
# (e a IA do Google) mostrar as formas de contato da loja. Dados iguais ao JSON-LD do index.html e à variável HRS.
os.makedirs("contato", exist_ok=True)
LD_C = {"@context": "https://schema.org", "@type": "HardwareStore", "name": "Ronaldo Parafusos", "url": SITE + "/",
        "image": SITE + "/img/og-ronaldo-parafusos-v5.jpg", "logo": SITE + "/favicon-512.png",
        "telephone": "+55-63-3476-1955", "email": "ronaldoparafusos@gmail.com",
        "contactPoint": [{"@type": "ContactPoint", "telephone": "+55-63-98451-4163", "contactType": "customer service", "name": "WhatsApp", "areaServed": "BR", "availableLanguage": "Portuguese"},
                         {"@type": "ContactPoint", "telephone": "+55-63-3476-1955", "contactType": "sales", "areaServed": "BR", "availableLanguage": "Portuguese"}],
        "address": {"@type": "PostalAddress", "streetAddress": "Av. Pedro Ludovico Teixeira, 2034 - Centro", "addressLocality": "Colinas do Tocantins", "addressRegion": "TO", "postalCode": "77761-670", "addressCountry": "BR"},
        "openingHoursSpecification": [{"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "07:00", "closes": "18:00"},
                                      {"@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "07:00", "closes": "12:00"}],
        "hasMap": "https://www.google.com/maps?cid=1146969919196213478",
        "sameAs": ["https://www.instagram.com/ronaldoparafusos/", "https://www.facebook.com/RONALDOPARAFUSOS2017/", "https://www.google.com/maps?cid=1146969919196213478"]}
CONTATO = f"""<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Contato | Ronaldo Parafusos - Colinas do Tocantins (TO)</title>
<meta name="description" content="Fale com a Ronaldo Parafusos: WhatsApp (63) 98451-4163, telefone (63) 3476-1955, e-mail ronaldoparafusos@gmail.com. Av. Pedro Ludovico Teixeira, 2034 - Centro, Colinas do Tocantins (TO). Seg a sex 7h às 18h, sáb 7h às 12h.">
<link rel="canonical" href="{SITE}/contato/"><link rel="icon" href="/favicon.ico" sizes="any"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:title" content="Contato | Ronaldo Parafusos"><meta property="og:url" content="{SITE}/contato/"><meta property="og:image" content="{SITE}/img/og-ronaldo-parafusos-v5.jpg">
<script type="application/ld+json">{json.dumps(LD_C, ensure_ascii=False)}</script>
<style>{CSS}.ct{{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));margin:18px 0}}.ct a.c{{display:block;border:1px solid #dde3ee;border-radius:12px;padding:16px;text-decoration:none;color:#202124;background:#fff}}.ct b{{display:block;color:#2b4ea2;font-size:18px;margin-bottom:4px}}table{{border-collapse:collapse}}td{{padding:4px 14px 4px 0}}</style></head>
<body><header><div class="w"><a href="/"><img src="/img/0839075d551e07b4f116e808714a3049.webp" alt="Ronaldo Parafusos" width="160" height="44"></a></div></header>
<main class="w"><h1>Contato da Ronaldo Parafusos</h1>
<p>Parafusos, ferramentas, ferragens e materiais em Colinas do Tocantins (TO). Fale com a gente pelo canal que preferir:</p>
<div class="ct">
<a class="c" href="https://wa.me/5563984514163"><b>WhatsApp</b>(63) 98451-4163<br><small>Orçamentos, preços e disponibilidade</small></a>
<a class="c" href="tel:+556334761955"><b>Telefone</b>(63) 3476-1955</a>
<a class="c" href="mailto:ronaldoparafusos@gmail.com"><b>E-mail</b>ronaldoparafusos@gmail.com</a>
<a class="c" href="https://www.google.com/maps?cid=1146969919196213478"><b>Endereço</b>Av. Pedro Ludovico Teixeira, 2034 - Centro<br>Colinas do Tocantins (TO) - CEP 77761-670<br><small>Ver no Google Maps</small></a>
<a class="c" href="https://www.instagram.com/ronaldoparafusos/"><b>Instagram</b>@ronaldoparafusos</a>
<a class="c" href="https://www.facebook.com/RONALDOPARAFUSOS2017/"><b>Facebook</b>Ronaldo Parafusos</a>
</div>
<h2>Horário de funcionamento</h2>
<table><tr><td>Segunda a sexta</td><td><b>7h às 18h</b></td></tr><tr><td>Sábado</td><td><b>7h às 12h</b></td></tr><tr><td>Domingo</td><td>Fechado</td></tr></table>
<p><a class="btn" href="/">Ver o catálogo de produtos</a><a class="btn b" href="https://wa.me/5563984514163">Chamar no WhatsApp</a></p>
</main>
<footer><div class="w"><b>Ronaldo Parafusos</b> · Av. Pedro Ludovico Teixeira, 2034 - Centro, Colinas do Tocantins (TO) · <a href="tel:+556334761955">(63) 3476-1955</a> · <a href="/termos.html">Termos de Uso</a></div></footer>
</body></html>
"""
open("contato/index.html", "w", encoding="utf-8").write(CONTATO)
sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
def add(u, f, pr): sm.append(f"  <url>\n    <loc>{u}</loc>\n    <lastmod>{today}</lastmod>\n    <changefreq>{f}</changefreq>\n    <priority>{pr}</priority>\n  </url>")
add(SITE + "/", "weekly", "1.0")
add(SITE + "/contato/", "monthly", "0.8")
for u in urls: add(u, "weekly", "0.7" if "/categoria/" in u else "0.6")
for u in purls: add(u, "monthly", "0.5")
# termos.html fica fora do sitemap e com noindex (pedido do dono, 25/11/2026: cliente vindo do Google tem que cair nos produtos)
sm.append("</urlset>")
open("sitemap.xml", "w", encoding="utf-8").write("\n".join(sm) + "\n")
print(len(urls), "páginas")
