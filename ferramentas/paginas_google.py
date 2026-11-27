#!/usr/bin/env python3
"""Gera as páginas do site para o Google e o boot.js. Rodar na raiz do repositório:  python3 ferramentas/paginas_google.py

(27/11/2026, pedido do dono) Cada página (produto, categoria, marca, contato, perguntas frequentes, 404) é o PRÓPRIO SITE:
  - o HTML traz o conteúdo escrito (título, foto, descrição, ficha, links, JSON-LD), que é o que o Google lê;
  - em seguida carrega /boot.js + /app.js + /app.css e o site monta o visual completo NO MESMO ENDEREÇO (sem redirecionar).
  - Nunca redirecionar para "/#..." (regra de 26/11: o Google trata como desvio e não indexa).
  - Nunca gravar preço (campo "p", "po" e qualquer preço) em página, boot.js ou "pre".
Gera também: boot.js (configurações, categorias, marcas, perguntas e o "ver" do dados.json), 404.html, llms.txt e sitemap.xml.
Lista de produtos: Supabase (tem as edições do painel); se o dados.json tiver lote mais novo, usa o dados.json."""
import json, re, unicodedata, html, datetime, os, shutil, urllib.parse, urllib.request, hashlib
SITE = "https://ronaldoparafusos.com.br"
MIN_MARCA = 3   # marcas com pelo menos 3 produtos ganham página
LOGO = "/img/0839075d551e07b4f116e808714a3049.webp"
WA = "5563984514163"
e = html.escape

dj = json.load(open("dados.json", encoding="utf-8"))
d = dj
try:
    cfg = open("config.js", encoding="utf-8").read()
    u_ = re.search(r'url:\s*"([^"]+)"', cfg).group(1); k_ = re.search(r'key:\s*"([^"]+)"', cfg).group(1)
    rq = urllib.request.Request(u_ + "/rest/v1/site?select=data", headers={"apikey": k_})
    sb = json.loads(urllib.request.urlopen(rq, timeout=90).read())[0]["data"]
    if len(sb.get("prods") or []) > 100:
        if (dj.get("ver") or 0) > (sb.get("ver") or 0):
            # lote novo ainda não gravado no Supabase: produtos do dados.json, mas mantém as edições do painel ("et")
            et = {p["id"]: p for p in sb["prods"] if p.get("et")}
            dl = set(sb.get("del") or []) | set(dj.get("del") or [])
            ids = set()
            pr = []
            for p in dj["prods"]:
                if p["id"] in dl: continue
                pr.append(et.get(p["id"], p)); ids.add(p["id"])
            pr += [p for p in sb["prods"] if p["id"] not in ids and p["id"] not in dl and (p.get("et") or p.get("ts"))]
            d = dict(sb); d["prods"] = pr; print("dados: dados.json (lote novo) + edições do Supabase")
        else:
            d = sb; print("dados: Supabase")
except Exception as ex:
    print("dados: dados.json (Supabase indisponível:", ex, ")")

dels = set(d.get("del") or [])
prods = [p for p in d["prods"] if p.get("n") and p["id"] not in dels]
cats = d["cats"]
catn = {c["id"]: c["n"] for c in cats}
FAQ = json.load(open("ferramentas/faq.json", encoding="utf-8"))

def slug(n):
    n = unicodedata.normalize("NFD", str(n).lower()); n = "".join(c for c in n if unicodedata.category(c) != "Mn")
    return re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9]+", "-", n))
def ppath(p):
    return f"produto/{(slug(str(p['n']).strip())[:70].strip('-') or 'item')}-{slug(str(p['id']))}"
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
        u = img_url(x)
        if u and u not in out: out.append(u)
    return out
def big_img(p):
    """Foto maior (a 1ª da galeria costuma ter 800-900 px; a capa "-p" tem 400 px) para o Google e o compartilhamento."""
    g = galeria(p)
    for u in g:
        if not u.endswith("-p.webp"): return u
    return g[0] if g else ""
def absu(u): return u if u.startswith("http") else SITE + u
def pdate(p):
    t = p.get("up") or p.get("ts")
    try: return datetime.datetime.utcfromtimestamp(int(t) / 1000).date().isoformat()
    except Exception: return None
SAFE = ["id", "c", "n", "code", "un", "brand", "d", "img", "s", "gal", "more", "cg", "cmp", "ts", "up", "nw", "rt", "rv", "bc", "ref", "et"]
def safe(p):
    """Produto SEM preço para o "pre" das páginas (regra sem exceção: preço nunca fica público)."""
    o = {k: p[k] for k in SAFE if k in p}
    o["p"] = ""
    return o
def jdump(o): return json.dumps(o, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")

# ---------- cabeçalho comum (copiado do index.html: CSP, Supabase público, fontes, ícones) ----------
ix = open("index.html", encoding="utf-8").read()
CSP = re.search(r'<meta http-equiv="Content-Security-Policy"[^>]*>', ix).group(0)
CFG = re.search(r'<script>/\* Configuração do Supabase.*?</noscript>', ix, re.S).group(0)
ICONS = "".join(re.findall(r'<link rel="(?:icon|apple-touch-icon)"[^>]*>', ix))
STH = f'<header class="sth"><div class="w"><a href="/"><img src="{LOGO}" alt="Ronaldo Parafusos" width="174" height="48"></a></div></header>'
STF = ('<footer class="stf"><div class="w"><b>Ronaldo Parafusos</b> · Av. Pedro Ludovico Teixeira, 2034 - Centro, Colinas do Tocantins (TO) · '
       '<a href="tel:+556334761955">(63) 3476-1955</a> · <a href="https://wa.me/5563984514163">WhatsApp (63) 98451-4163</a> · '
       '<a href="/contato/">Contato</a> · <a href="/perguntas-frequentes/">Perguntas frequentes</a> · <a href="/termos.html">Termos de Uso</a></div></footer>')
def nav_html():
    return '<nav class="c" aria-label="Categorias">' + "".join(
        f'<a href="/categoria/{slug(c["n"])}/">{e(c["n"])}</a>' for c in cats if c["id"] in CATS_OK) + "</nav>"
def shell(path, title, desc, main, lds=(), og=None, pre=None, robots="index, follow, max-image-preview:large", canon=True):
    url = f"{SITE}/{path}/" if path else SITE + "/"
    og = og or SITE + "/img/og-ronaldo-parafusos-v5.jpg"
    ld = "".join(f'<script type="application/ld+json">{jdump(x)}</script>' for x in lds)
    return (f'<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">{CSP}<base href="/">'
            f'<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>{e(title)}</title>'
            f'<meta name="description" content="{e(desc[:158])}"><meta name="robots" content="{robots}">'
            + (f'<link rel="canonical" href="{url}">' if canon else "") +
            f'<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Ronaldo Parafusos">'
            f'<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc[:200])}">'
            + (f'<meta property="og:url" content="{url}">' if canon else "") +
            f'<meta property="og:image" content="{e(og)}"><meta name="twitter:card" content="summary_large_image">{ICONS}{ld}{CFG}'
            f'<link rel="stylesheet" href="/app.css"></head><body><div id="root"><div class="stp">{STH}'
            f'<main id="sm" class="stc">{main}</main>{STF}</div></div>'
            '<dialog id="dlg"><form id="f" method="dialog"></form></dialog><dialog id="det"></dialog>'
            + (f'<script id="pre" type="application/json">{jdump(pre)}</script>' if pre is not None else "") +
            '<script src="/boot.js"></script><script src="/app.js"></script></body></html>')
def write(path, doc):
    os.makedirs(path, exist_ok=True)
    open(f"{path}/index.html", "w", encoding="utf-8").write(doc)
def bc_ld(items):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(items)]}
def card(p):
    im = img_url(p.get("img"))
    f = (f'<span class="f"><img src="{e(im)}" alt="{e(p["n"])}" loading="lazy" decoding="async" width="200" height="200"></span>' if im
         else '<span class="f"><img src="/favicon-192.png" alt="" loading="lazy" width="80" height="80"></span>')
    return (f'<li><a href="/{ppath(p)}/">{f}<span class="n">{e(p["n"])}</span>'
            + (f'<span class="m">{e(p["brand"])}</span>' if p.get("brand") else "") + '</a></li>')
def ordem(items):
    return sorted(items, key=lambda p: (0 if p.get("img") else 1, p["n"].lower()))

# ---------- boot.js (o site monta o topo na hora, sem esperar a lista de 4 MB) ----------
boot = {k: d.get(k) for k in ("s", "cats", "banners", "brands", "f", "v") if d.get(k) is not None}
boot["ver"] = dj.get("ver") or 0
boot["faq"] = FAQ
open("boot.js", "w", encoding="utf-8").write("/* Gerado por ferramentas/paginas_google.py: não editar à mão. Sem preços. */\nwindow.RP_BOOT=" + jdump(boot) + ";\n")

# ---------- categorias e marcas ----------
for base in ("categoria", "marca"):
    if os.path.isdir(base): shutil.rmtree(base)
CATS_OK = {p.get("c") for p in prods}
lists = []  # (url, lastmod, freq, prio)
def lastmod(items):
    ds = [x for x in (pdate(p) for p in items) if x]
    return max(ds) if ds else None
for c in cats:
    it = ordem([p for p in prods if p.get("c") == c["id"]])
    if not it: continue
    n = c["n"]; path = f"categoria/{slug(n)}"; url = f"{SITE}/{path}/"
    og = next((absu(big_img(p)) for p in it if big_img(p)), None)
    desc = f"{n} no Ronaldo Parafusos, em Colinas do Tocantins (TO): {len(it)} itens com foto e ficha técnica. Entrega grátis em Colinas. Orçamento pelo WhatsApp."
    main = (f'<p class="bcs"><a href="/">Início</a> › {e(n)}</p><h1>{e(n)}</h1><p>{e(desc)}</p>'
            f'<p><a class="sbt b" href="https://wa.me/{WA}">Pedir orçamento no WhatsApp</a></p>'
            f'<ul class="l">{"".join(card(p) for p in it)}</ul>{nav_html()}')
    il = {"@context": "https://schema.org", "@type": "CollectionPage", "name": n, "url": url,
          "mainEntity": {"@type": "ItemList", "numberOfItems": len(it), "itemListElement": [
              {"@type": "ListItem", "position": i + 1, "url": f"{SITE}/{ppath(p)}/", "name": p["n"]} for i, p in enumerate(it[:30])]}}
    write(path, shell(path, f"{n} | Ronaldo Parafusos - Colinas do Tocantins", desc, main,
                      [bc_ld([("Ronaldo Parafusos", SITE + "/"), (n, url)]), il], og, [safe(p) for p in it[:48]]))
    lists.append((url, lastmod(it), "weekly", "0.8"))
bc = {}
for p in prods:
    if p.get("brand"): bc.setdefault(p["brand"].strip(), []).append(p)
for bn, it in sorted(bc.items(), key=lambda x: -len(x[1])):
    if len(it) < MIN_MARCA or not slug(bn): continue
    it = ordem(it); path = f"marca/{slug(bn)}"; url = f"{SITE}/{path}/"
    if os.path.exists(path): continue
    og = next((absu(big_img(p)) for p in it if big_img(p)), None)
    desc = f"Produtos {bn} no Ronaldo Parafusos, em Colinas do Tocantins (TO): {len(it)} itens com foto e ficha técnica. Orçamento pelo WhatsApp."
    main = (f'<p class="bcs"><a href="/">Início</a> › {e(bn)}</p><h1>Produtos {e(bn)}</h1><p>{e(desc)}</p>'
            f'<ul class="l">{"".join(card(p) for p in it)}</ul>{nav_html()}')
    write(path, shell(path, f"{bn} | Ronaldo Parafusos - Colinas do Tocantins", desc, main,
                      [bc_ld([("Ronaldo Parafusos", SITE + "/"), (f"Produtos {bn}", url)])], og, [safe(p) for p in it[:48]]))
    lists.append((url, lastmod(it), "weekly", "0.6"))

# ---------- páginas de produto ----------
for old in os.listdir("produto") if os.path.isdir("produto") else []:
    pth = os.path.join("produto", old)
    if os.path.isdir(pth): shutil.rmtree(pth)
    elif old == "p.css": os.remove(pth)
os.makedirs("produto", exist_ok=True)
def titulo(p):
    nome = str(p["n"]).strip(); marca = str(p.get("brand") or "").strip()
    return f"{nome}{' ' + marca if marca and marca.lower() not in nome.lower() else ''}"
tc = {}
for p in prods: tc[titulo(p).lower()] = tc.get(titulo(p).lower(), 0) + 1
purls = []
for p in sorted(prods, key=lambda x: x["id"]):
    pid = str(p["id"]); nome = str(p["n"]).strip()
    if not re.fullmatch(r"[A-Za-z0-9_]{1,40}", pid) or not nome: continue
    path = ppath(p); url = f"{SITE}/{path}/"
    marca = str(p.get("brand") or "").strip(); cod = str(p.get("code") or "").strip()
    cn = catn.get(p.get("c"), ""); fotos = galeria(p); big = big_img(p)
    desc = str(p.get("d") or "").strip(); ficha = str(p.get("s") or "").strip()
    t = titulo(p)
    if tc[t.lower()] > 1: t += f" (código {cod or pid})"   # títulos únicos para o Google
    meta = (nome + (" - " + marca if marca else "") + (f", código {cod}" if cod else "") + ". "
            + (desc or f"{cn} no Ronaldo Parafusos.") + " Colinas do Tocantins (TO), entrega grátis em Colinas.").replace("\n", " ")
    crumbs = [("Ronaldo Parafusos", SITE + "/")] + ([(cn, f"{SITE}/categoria/{slug(cn)}/")] if cn else []) + [(nome, url)]
    lds = [bc_ld(crumbs)]
    if big:
        lds.append({"@context": "https://schema.org", "@type": "WebPage", "name": t, "url": url, "description": meta[:300],
                    "primaryImageOfPage": {"@type": "ImageObject", "url": absu(big), "caption": nome},
                    "image": [absu(f) for f in fotos[:6]]})
    principal = (f'<img src="{e(big or fotos[0])}" alt="{e(nome)}" width="500" height="500" decoding="async">' if fotos
                 else '<img src="/favicon-192.png" alt="" width="120" height="120">')
    mini = "".join(f'<img src="{e(f)}" alt="{e(nome)} - foto {i + 2}" loading="lazy" width="72" height="72">' for i, f in enumerate([f for f in fotos if f != (big or fotos[0])][:5]))
    wa = f"https://wa.me/{WA}?text=" + urllib.parse.quote(f"Olá! Vi no site e quero saber preço e disponibilidade: {nome}" + (f" (código {cod})" if cod else ""))
    main = (f'<p class="bcs"><a href="/">Início</a>{f" › <a href=\"/categoria/{slug(cn)}/\">{e(cn)}</a>" if cn else ""} › {e(nome)}</p>'
            f'<div class="spp"><div><div class="fo">{principal}</div>{f"<div class=\"gl\">{mini}</div>" if mini else ""}</div>'
            f'<div><h1>{e(nome)}</h1><p>{e(marca) + " · " if marca else ""}{"Código " + e(cod) if cod else ""}</p>'
            + (f'<p class="tx">{e(desc)}</p>' if desc else "") + (f'<p class="ft">{e(ficha)}</p>' if ficha else "") +
            f'<p><a class="sbt b" href="{e(wa)}">Consultar preço no WhatsApp</a></p>'
            '<p>Entrega grátis em Colinas do Tocantins. Respondemos no WhatsApp em 2 a 10 minutos (em horário de atendimento).</p></div></div>'
            + nav_html())
    write(path, shell(path, t + " | Ronaldo Parafusos", meta, main, lds, absu(big) if big else None, [safe(p)]))
    purls.append((url, pdate(p)))
print(len(purls), "páginas de produto,", len(lists), "categorias/marcas")

# ---------- contato ----------
LD_C = {"@context": "https://schema.org", "@type": "HardwareStore", "name": "Ronaldo Parafusos", "legalName": "Ronaldo Parafusos Ltda ME",
        "taxID": "28.453.578/0001-12", "url": SITE + "/",
        "image": SITE + "/img/og-ronaldo-parafusos-v5.jpg", "logo": SITE + "/favicon-512.png",
        "telephone": "+55-63-3476-1955", "email": "ronaldoparafusos@gmail.com",
        "paymentAccepted": "Cartão de crédito, Cartão de débito, Pix, Dinheiro",
        "contactPoint": [{"@type": "ContactPoint", "telephone": "+55-63-98451-4163", "contactType": "customer service", "name": "WhatsApp", "areaServed": "BR", "availableLanguage": "Portuguese"},
                         {"@type": "ContactPoint", "telephone": "+55-63-3476-1955", "contactType": "sales", "areaServed": "BR", "availableLanguage": "Portuguese"}],
        "address": {"@type": "PostalAddress", "streetAddress": "Av. Pedro Ludovico Teixeira, 2034 - Centro", "addressLocality": "Colinas do Tocantins", "addressRegion": "TO", "postalCode": "77761-670", "addressCountry": "BR"},
        "geo": {"@type": "GeoCoordinates", "latitude": -8.054911, "longitude": -48.482806},
        "openingHoursSpecification": [{"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "07:00", "closes": "18:00"},
                                      {"@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "07:00", "closes": "12:00"}],
        "hasMap": "https://www.google.com/maps?cid=1146969919196213478",
        "sameAs": ["https://www.instagram.com/ronaldoparafusos/", "https://www.facebook.com/RONALDOPARAFUSOS2017/", "https://www.google.com/maps?cid=1146969919196213478"]}
MAPA = "https://www.google.com/maps?q=-8.054911,-48.482806&z=17&output=embed"
main = ('<p class="bcs"><a href="/">Início</a> › Contato</p><h1>Contato do Ronaldo Parafusos</h1>'
        '<p>Respondemos no WhatsApp em 2 a 10 minutos (em horário de atendimento). Entrega grátis em Colinas do Tocantins.</p>'
        f'<p><a class="sbt b" href="https://wa.me/{WA}">Chamar no WhatsApp</a><a class="sbt" href="/#produtos">Ver todos os produtos</a></p>'
        '<ul class="ctl">'
        f'<li><b>WhatsApp:</b> <a href="https://wa.me/{WA}">(63) 98451-4163</a> (orçamentos, preços e disponibilidade)</li>'
        '<li><b>Telefone:</b> <a href="tel:+556334761955">(63) 3476-1955</a> (também atende WhatsApp)</li>'
        '<li><b>E-mail:</b> <a href="mailto:ronaldoparafusos@gmail.com">ronaldoparafusos@gmail.com</a></li>'
        '<li><b>Endereço:</b> Av. Pedro Ludovico Teixeira, 2034 - Centro, Colinas do Tocantins (TO), CEP 77761-670 · <a href="https://www.google.com/maps?cid=1146969919196213478">Abrir no Google Maps</a></li>'
        '<li><b>Instagram:</b> <a href="https://www.instagram.com/ronaldoparafusos/">@ronaldoparafusos</a> · <b>Facebook:</b> <a href="https://www.facebook.com/RONALDOPARAFUSOS2017/">Ronaldo Parafusos</a></li>'
        '<li><b>Formas de pagamento:</b> cartão de crédito, cartão de débito, Pix e dinheiro</li>'
        '<li><b>Empresa:</b> Ronaldo Parafusos Ltda ME · CNPJ 28.453.578/0001-12</li></ul>'
        '<h2>Horário de funcionamento</h2><p>Segunda a sexta: 7h às 18h · Sábado: 7h às 12h · Domingo: fechado</p>'
        f'<h2>Como chegar</h2><button type="button" class="sbt" data-map="{MAPA}">Ver o mapa aqui</button>'
        '<p><a class="sbt" href="/perguntas-frequentes/">Perguntas frequentes</a></p>')
write("contato", shell("contato", "Contato | Ronaldo Parafusos - Colinas do Tocantins (TO)",
      "Fale com o Ronaldo Parafusos: WhatsApp (63) 98451-4163, telefone (63) 3476-1955, e-mail ronaldoparafusos@gmail.com. Av. Pedro Ludovico Teixeira, 2034 - Centro, Colinas do Tocantins (TO).",
      main, [LD_C, bc_ld([("Ronaldo Parafusos", SITE + "/"), ("Contato", SITE + "/contato/")])]))

# ---------- perguntas frequentes ----------
main = ('<p class="bcs"><a href="/">Início</a> › Perguntas frequentes</p><h1>Perguntas frequentes</h1><p><a class="sbt" href="/#produtos">Ver todos os produtos</a></p><div class="faqp">'
        + "".join(f'<details><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in FAQ)
        + f'</div><p><a class="sbt b" href="https://wa.me/{WA}">Tirar outra dúvida no WhatsApp</a><a class="sbt" href="/contato/">Contato</a></p>')
LD_F = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
    {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ]}
write("perguntas-frequentes", shell("perguntas-frequentes", "Perguntas frequentes | Ronaldo Parafusos - Colinas do Tocantins",
      "Dúvidas sobre orçamento, entrega grátis em Colinas do Tocantins, formas de pagamento, oficina de motosserras e outras máquinas, horário e contato do Ronaldo Parafusos.",
      main, [LD_F, bc_ld([("Ronaldo Parafusos", SITE + "/"), ("Perguntas frequentes", SITE + "/perguntas-frequentes/")])]))

# ---------- 404 (o próprio site: busca, categorias e WhatsApp; abre também produto novo antes da página dele existir) ----------
main = ('<h1>Página não encontrada</h1><p>Este endereço não existe ou o produto saiu do catálogo. Use a busca no topo, escolha uma categoria abaixo ou fale com a gente.</p>'
        f'<p><a class="sbt" href="/">Ir para a página inicial</a><a class="sbt b" href="https://wa.me/{WA}">Chamar no WhatsApp</a></p>' + nav_html())
open("404.html", "w", encoding="utf-8").write(shell("", "Página não encontrada | Ronaldo Parafusos", "Página não encontrada.", main, robots="noindex, follow", canon=False))

# ---------- llms.txt (resumo para as IAs; sem preço) ----------
LL = ["# Ronaldo Parafusos", "",
      "> Loja de parafusos, ferragens, ferramentas, peças e oficina em Colinas do Tocantins (TO), Brasil. O site é um catálogo: sem venda online e sem preços; orçamento pelo WhatsApp.", "",
      "- Oficina: conserto de motosserras, roçadeiras, motobombas, motores estacionários, compressores e outras máquinas; venda de peças.",
      "- Entrega grátis em Colinas do Tocantins. Também pode retirar na loja.",
      "- Pagamento: cartão de crédito, cartão de débito, Pix e dinheiro. Compras em quantidade: consultar os vendedores.",
      "- WhatsApp (63) 98451-4163 (responde em 2 a 10 minutos em horário de atendimento) · Telefone (63) 3476-1955 · ronaldoparafusos@gmail.com",
      "- Endereço: Av. Pedro Ludovico Teixeira, 2034 - Centro, Colinas do Tocantins (TO), CEP 77761-670",
      "- Horário: segunda a sexta 7h às 18h; sábado 7h às 12h; domingo fechado.",
      "- Empresa: Ronaldo Parafusos Ltda ME, CNPJ 28.453.578/0001-12", "",
      "## Páginas principais", "",
      f"- [Catálogo]({SITE}/): {len(prods)} produtos com foto, marca, código e ficha técnica",
      f"- [Contato]({SITE}/contato/)", f"- [Perguntas frequentes]({SITE}/perguntas-frequentes/)", "", "## Categorias", ""]
LL += [f"- [{c['n']}]({SITE}/categoria/{slug(c['n'])}/)" for c in cats if c["id"] in CATS_OK]
LL += ["", f"Lista completa de páginas: {SITE}/sitemap.xml", ""]
open("llms.txt", "w", encoding="utf-8").write("\n".join(LL))

# ---------- sitemap (data de cada página = última alteração do produto, não a data de hoje) ----------
today = datetime.date.today().isoformat()
sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
def add(u, lm, f, pr):
    sm.append(f"  <url>\n    <loc>{u}</loc>\n" + (f"    <lastmod>{lm}</lastmod>\n" if lm else "") + f"    <changefreq>{f}</changefreq>\n    <priority>{pr}</priority>\n  </url>")
allm = lastmod(prods)
add(SITE + "/", allm, "daily", "1.0")
add(SITE + "/contato/", None, "monthly", "0.8")
add(SITE + "/perguntas-frequentes/", None, "monthly", "0.7")
for u, lm, f, pr in lists: add(u, lm, f, pr)
for u, lm in purls: add(u, lm, "monthly", "0.6")
# termos.html fica fora do sitemap e com noindex (pedido do dono, 25/11/2026)
sm.append("</urlset>")
open("sitemap.xml", "w", encoding="utf-8").write("\n".join(sm) + "\n")
print(len(sm) - 3, "endereços no sitemap")
