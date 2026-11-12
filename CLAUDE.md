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
   `function massPage`, `function rpMerge`, `function galEdH`, `function shrinkImg`, `function srDesc`, `function hrsH`, `function featFill`, `function brAuto`, `function novFit`, `function novSet`, `function bnPick`, `function rpFetchSite`, `function bnPicksH`, `function bnSwipe`, `function bnTick`, `function repOpen`, `function avOpen`, o CSS `/* Rodapé organizado:` e o CSS `/* === Cabeçalho: Televendas`.
   Se algum sumiu, você partiu de uma cópia antiga: pare e refaça a partir do passo 1.
4. Rode `git diff --stat` e confira que só mudou o que você pretendia.
5. Se o `git push` for recusado porque o repositório mudou, baixe de novo e reaplique só a sua mudança.

## Toda mudança gera uma regra (pedido do dono, 12/11/2026)

- **Cada alteração no site (função nova, mudança de layout, comportamento, arquivo novo) deve virar uma regra curta**
  aqui neste CLAUDE.md e/ou no doc do Projeto ("claude/regras-do-site.md", "claude/desempenho-do-site.md", "claude/backups-do-site.md"):
  o que foi feito, nome da função/arquivo, e o que não pode ser desfeito. Função nova importante entra na lista de conferência do passo 3.
- **Faça tudo otimizado e funcional:** código enxuto, sem duplicar funções, imagens leves, sem baixar dados à toa
  (a lista de produtos só é baixada do Supabase quando muda: `rpFetchSite`, ver "claude/desempenho-do-site.md"), testar no site publicado antes de avisar o dono.
- **Não abuse da memória:** registre só o essencial, em poucas linhas; detalhes ficam nos docs do Projeto e neste arquivo, não repetidos em vários lugares.
- Toda gravação na tabela `site` do Supabase precisa atualizar `updated_at` (senão os aparelhos continuam com a lista antiga).
- O backup diário (repositório privado `ronaldoparafusos/backups`) copia este repositório inteiro automaticamente; não precisa fazer nada, mas não quebre o site com arquivos enormes (limite do GitHub Pages: 1 GB).

## Fotos e vídeos (plano grátis)

- O dono pediu: **toda foto ou vídeo que ele mandar para adicionar ao site deve ser reduzido antes**, para não gastar o plano grátis
  (Supabase: 1 GB de arquivos e 5 GB de tráfego por mês; GitHub Pages: site até 1 GB).
- Fotos: no máximo 1600 px no lado maior, em WebP (qualidade ~80), de preferência abaixo de 300 KB. O painel já faz isso sozinho (`shrinkImg()`).
- Vídeos: o ideal é o dono postar no YouTube ou Instagram e colar o link em "Vídeo e sobre" (só carrega quando o cliente toca).
  Se for preciso hospedar o arquivo, comprima (720p, H.264, sem som se for de fundo, poucos MB) e nunca use autoplay de vídeo pesado.

## Horário e avaliação no Google

- O horário detalhado do rodapé vem da variável `HRS` no index.html (conferido no perfil do Google em 11/11/2026: seg a sex 7h-18h, sáb 7h-12h, dom fechado).
  Se o horário mudar, atualize `HRS` e o JSON-LD do `<head>`.
- O botão "Avaliar no Google" usa `GREV_DEF` = link oficial `search.google.com/local/writereview?placeid=ChIJfRbYfmhZJ5MR5rC_iRDb6g8` (Place ID da loja; abre direto a avaliação no celular e no computador). Se o dono colar outro link no campo de avaliação do painel (`S.s.grev`), vale o dele.

## Rolagem ao recarregar (12/11/2026)

- `history.scrollRestoration="manual"` + `scrollTo(0,0)` no carregamento: ao recarregar (inclusive puxando a tela no celular) o site começa do topo.
  Antes, o navegador devolvia a rolagem antes de a lista carregar e os Destaques apareciam cortados. Ao voltar para a página inicial, `route()` devolve a rolagem salva em `HOMEY`. Não remover.

## Avisos de erro (12/11/2026)

- Cliente: "Encontrou algum erro neste produto?" (`repLink`, na página do produto) e "Reportar problema no site" (rodapé, `legalFoot`) abrem `repOpen(pid)`.
  Envia pela RPC `aviso_enviar` para a tabela `avisos` do Supabase (só texto; 5 por aparelho/dia, 60/dia no banco; resolvidos somem em 90 dias). Só admin lê (RLS com `admins`).
- Dono: botão "Avisos de erro (n)" no modo edição abre `avOpen()` (ver produto, marcar resolvido, apagar); `avCount()` usa a RPC pública `avisos_novos` (só o número).
- Uma tarefa programada diária consulta `avisos_novos` e avisa o dono no celular; ele liga o computador e libera a correção. **Não corrigir avisos sem a liberação do dono.**
- Termos: cláusula 13.4.1. Não remover essas funções.

## Nunca apague nem altere sem pedido do dono

`google1c91dc630ad29760.html`, `sitemap.xml`, `robots.txt`, `termos.html`, `CLAUDE.md`, as tags de SEO do `<head>`
e a imagem `img/og-ronaldo-parafusos-v5.jpg`.

## Avise o dono

Depois de publicar, diga em uma linha o que mudou. Os detalhes de cada recurso estão no documento
"claude/regras-do-site.md" do Projeto "site loja" no claude.ai.
