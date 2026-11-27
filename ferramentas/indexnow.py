#!/usr/bin/env python3
"""(27/11/2026) Avisa Bing/Yandex/Seznam etc. (IndexNow) quais páginas mudaram, para aparecerem logo nas buscas
(o Bing também abastece a busca do ChatGPT e do Copilot). Uso: python3 ferramentas/indexnow.py <commit-base>
A chave fica no arquivo /4a818b9ce70e0a09f7150d258830d7d6.txt na raiz (não apagar). O Google não usa IndexNow (usa o sitemap)."""
import json, re, subprocess, sys, urllib.request
SITE = "https://ronaldoparafusos.com.br"; KEY = "4a818b9ce70e0a09f7150d258830d7d6"
base = sys.argv[1] if len(sys.argv) > 1 else "HEAD~1"
try:
    nomes = subprocess.run(["git", "diff", "--name-only", base, "HEAD"], capture_output=True, text=True, check=True).stdout.split()
except Exception as ex:
    print("IndexNow: sem histórico para comparar:", ex); sys.exit(0)
urls = []
for f in nomes:
    if f == "index.html": urls.append(SITE + "/")
    elif re.fullmatch(r"(produto|categoria|marca|servicos)/[^/]+/index\.html|(contato|perguntas-frequentes)/index\.html", f):
        urls.append(f"{SITE}/{f[:-len('index.html')]}")
urls = list(dict.fromkeys(urls))[:10000]
if not urls: print("IndexNow: nenhuma página mudou."); sys.exit(0)
import time
ok = 0; erro = None
for i in range(0, len(urls), 100):  # o IndexNow recusa (403) pedidos muito grandes: manda de 100 em 100
    body = json.dumps({"host": "ronaldoparafusos.com.br", "key": KEY, "keyLocation": f"{SITE}/{KEY}.txt", "urlList": urls[i:i + 100]}).encode()
    try:
        urllib.request.urlopen(urllib.request.Request("https://api.indexnow.org/indexnow", data=body, headers={"Content-Type": "application/json; charset=utf-8"}), timeout=60)
        ok += len(urls[i:i + 100])
    except Exception as ex:
        erro = erro or ex
    time.sleep(1)
print("IndexNow:", ok, "de", len(urls), "páginas avisadas", f"(erro: {erro}; não é grave, o sitemap continua valendo)" if erro else "")
