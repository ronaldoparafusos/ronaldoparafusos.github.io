# Site Ronaldo Parafusos: regras para TODAS as conversas

Várias conversas do Claude mexem neste repositório ao mesmo tempo (cadastro de lotes, layout, termos etc.).
Entre 11/11/2026 08:40 e 13:16, os commits "Lote 21", "Lote 22" e "Lote 23" publicaram uma cópia antiga do `index.html`
e apagaram mudanças feitas por outras conversas (cabeçalho, menu Categorias, aviso legal, edição em massa, novidades).
O dono pediu que isso não aconteça mais.

## Antes de publicar qualquer coisa

1. **Baixe a versão mais recente logo antes de editar:** `git fetch origin main && git reset --hard origin/main`.
   Nunca reaproveite um `index.html` guardado antes (na conversa, em /tmp ou em outra pasta).
2. **Lotes de produtos:** troque **somente** o JSON dentro de
   `<script id="data" type="application/json">...</script>` (procure pelas marcas de texto, nunca por número de linha).
   Não reescreva CSS, JavaScript nem o resto do arquivo. Mantenha nos produtos os campos `ts`, `up`, `et` e a lista `del`.
   Aumente o `ver` (Date.now()) para o site saber que há dados novos.
3. **Antes do commit, confira** que o `index.html` ainda contém:
   `function tvH`, `function catBar`, `function kcContact`, `function waFab`, `function legalFoot`,
   `function massPage`, `function rpMerge`, `function galEdH`, `function shrinkImg`, `function srDesc`, `function hrsH`, o CSS `/* Rodapé organizado:` e o CSS `/* === Cabeçalho: Televendas`.
   Se algum sumiu, você partiu de uma cópia antiga: pare e refaça a partir do passo 1.
4. Rode `git diff --stat` e confira que só mudou o que você pretendia.
5. Se o `git push` for recusado porque o repositório mudou, baixe de novo e reaplique só a sua mudança.

## Fotos e vídeos (plano grátis)

- O dono pediu: **toda foto ou vídeo que ele mandar para adicionar ao site deve ser reduzido antes**, para não gastar o plano grátis
  (Supabase: 1 GB de arquivos e 5 GB de tráfego por mês; GitHub Pages: site até 1 GB).
- Fotos: no máximo 1600 px no lado maior, em WebP (qualidade ~80), de preferência abaixo de 300 KB. O painel já faz isso sozinho (`shrinkImg()`).
- Vídeos: o ideal é o dono postar no YouTube ou Instagram e colar o link em "Vídeo e sobre" (só carrega quando o cliente toca).
  Se for preciso hospedar o arquivo, comprima (720p, H.264, sem som se for de fundo, poucos MB) e nunca use autoplay de vídeo pesado.

## Horário e avaliação no Google

- O horário detalhado do rodapé vem da variável `HRS` no index.html (conferido no perfil do Google em 11/11/2026: seg a sex 7h-18h, sáb 7h-12h, dom fechado).
  Se o horário mudar, atualize `HRS` e o JSON-LD do `<head>`.
- O botão "Avaliar no Google" usa `GREV_DEF` (abre direto a janela de escrever avaliação). Se o dono colar outro link no campo de avaliação do painel (`S.s.grev`), vale o dele.

## Nunca apague nem altere sem pedido do dono

`google1c91dc630ad29760.html`, `sitemap.xml`, `robots.txt`, `termos.html`, `CLAUDE.md`, as tags de SEO do `<head>`
e a imagem `img/og-ronaldo-parafusos-v5.jpg`.

## Avise o dono

Depois de publicar, diga em uma linha o que mudou. Os detalhes de cada recurso estão no documento
"claude/regras-do-site.md" do Projeto "site loja" no claude.ai.
