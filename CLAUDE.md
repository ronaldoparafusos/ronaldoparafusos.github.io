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
   `function massPage`, `function rpMerge`, `function galEdH`, `function shrinkImg`, `function srDesc`, `function hrsH`, `function featFill`, `function brAuto`, `function novFit`, `function novSet`, `function bnPick`, `function rpFetchSite`, `function bnPicksH`, `function bnSwipe`, `function bnTick`, `function repOpen`, `function avOpen`, `function topLock`, `function bibFoot`, o CSS `/* Rodapé organizado:` e o CSS `/* === Cabeçalho: Televendas`.
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
- `topLock()` (12/11/2026): o Chrome do iPhone ignora o "manual" e devolve a rolagem antiga depois de carregar; nos primeiros segundos (4 s do início, e mais 2,5 s depois do `load` e da lista carregar: `topLock.renew()`), se a página rolar sozinha sem o cliente tocar, volta ao topo. Não remover. Como o CSS tem `scroll-behavior:smooth`, as voltas ao topo usam `toY()` (rolagem "instant"); não trocar por `scrollTo(0,0)`, que fica animado e é interrompido.

## Avisos de erro (12/11/2026)

- Cliente: "Encontrou algum erro neste produto?" (`repLink`, na página do produto) e "Reportar problema no site" (rodapé, `legalFoot`) abrem `repOpen(pid)`.
  Envia pela RPC `aviso_enviar` para a tabela `avisos` do Supabase (só texto; 5 por aparelho/dia, 60/dia no banco; resolvidos somem em 90 dias). Só admin lê (RLS com `admins`).
- Dono: botão "Avisos de erro (n)" no modo edição abre `avOpen()` (ver produto, marcar resolvido, apagar); `avCount()` usa a RPC pública `avisos_novos` (só o número).
- Uma tarefa programada diária consulta `avisos_novos` e avisa o dono no celular; ele liga o computador e libera a correção. **Não corrigir avisos sem a liberação do dono.**
- Termos: cláusula 13.4.1. Não remover essas funções.

## Domínio próprio (12/11/2026, pedido do dono)

- Endereço oficial: **https://ronaldoparafusos.com.br** (registrado no Registro.br, no CNPJ da loja). O antigo `ronaldoparafusos.github.io` redireciona sozinho.
- Arquivo `CNAME` na raiz com `ronaldoparafusos.com.br`: **nunca apagar nem alterar** (sem ele o site volta para o endereço antigo).
- DNS no Registro.br (modo avançado): 4 registros A (185.199.108.153, .109, .110, .111) e CNAME `www` → `ronaldoparafusos.github.io`. Não mexer.
- Domínio extra **ronaldoparafusos.com** (Hostinger, conta do dono, vence ~12/11/2027, renovação R$ 94,99): só redireciona (301) para https://ronaldoparafusos.com.br, configurado em hPanel → DNS → Redirecionamentos. Não precisa de nada neste repositório; não adicionar ao CNAME.
- Google Search Console: propriedade de domínio `ronaldoparafusos.com.br` verificada (12/11/2026) por registro TXT `google-site-verification=...` no DNS do Registro.br; sitemap enviado (129 páginas). Não apagar esse TXT.
- Search Console (conta ronaldoparafusos@gmail.com): "Mudança de endereço" de ronaldoparafusos.github.io para ronaldoparafusos.com.br confirmada em 13/11/2026. Não cancelar e não remover a propriedade antiga por pelo menos 180 dias.
- Links absolutos (canonical, og:url, og:image, JSON-LD, sitemap.xml, robots.txt, termos.html) usam o domínio novo. Ao criar página ou link absoluto novo, use `https://ronaldoparafusos.com.br`.

## Revisão de marcas, títulos e nomes populares (12/11/2026, Lotes 33-35)

- Marcas: "marcas" que eram nome de produto (Carburador, Retentor, Filtro Ar, Intercooler...) ficaram sem marca; Flach só fica em carregadores/eletrônicos (niples e válvulas de pé sem marca até o dono informar). Não voltar.
- Títulos: padrão "4,8 x 350 mm" (com espaço e unidade), polegadas "1.1/2"", acentos, sem marca repetida no fim. Abraçadeiras: nylon = "Abraçadeira de Nylon Preta 4,8 mm x 300 mm" (largura x comprimento) e a descrição explica em cm; rosca sem fim = "Abraçadeira Rosca Sem Fim 9 mm para 13 a 19 mm (1/2" a 3/4")".
- Descrição termina com "Também conhecido como: ..." (nomes do dia a dia para a busca achar, ex.: enforca-gato). Não repetir o que já está no nome/descrição.
- Lote que só corrige texto não pode virar "Novidade": usar `up` = up atual do Supabase + 1 nos itens alterados (o `rpMerge` só mantém o `up` do lote se for maior). Itens com `et` (editados no painel) não aceitam lote: corrigir direto na tabela `site` (SQL) e atualizar `updated_at`.

## Categoria "Caça e pesca" e itens retirados (12/11/2026)

- Categoria `cp` "Caça e pesca" (ícone `ICONS.peixe`): anzóis, linhas, molinetes, carretilhas, varas, iscas, viveiro e chapéu de pescador. Marcas conferidas (Albatroz = linha Kara/Sammy; Maruri; Taue; Pinnacle; Marine Sports). Categoria nova precisa ir também para `data->cats` da tabela `site` (o lote não leva categorias).
- O dono pediu para tirar do site: bebidas, higiene pessoal, combustíveis (diesel, gasolina, etanol, Arla), jet ski, camisetas, itens de escritório e informática, cadeiras, bicicletas, cooktop e fogão. Estão em `del` no Supabase; não recadastrar.

## Fotos das varas e linha Platinum (12/11/2026, Lotes 38-40)

- Na página do produto a galeria é `gal` inteira (a 1ª foto é a grande); `img` é a capa da lista. Ao trocar a foto principal, coloque a nova também como 1ª de `gal` e não repita a mesma foto em tamanhos diferentes (-p e -1).
- Fotos novas das varas (vara inteira à mostra, sem marca d'água de outra loja): `img/rp-<código>-v.webp` (800 px). Não voltar para as fotos com zoom só no rótulo nem para fotos de outro modelo (ex.: Kara 1802 em vara de 1,35 m).
- Linhas "Platinum" = Ottoni Platinum XT (monofilamento, 100 m; nº 30 = 0,30 mm), marca Ottoni.

## Celular, títulos, Google e logos das marcas (12/11/2026, Lotes 41-42)

- Celular (até 760 px): o botão de categorias mostra só o ☰ (texto "Categorias" fica escondido por CSS, `.kcbl`), e no lugar dos atalhos da barra azul aparece a logo com o nome (`.kclg`, usa `S.s.lg.hm` em fundo branco). A barra fica fixa ao rolar (header sticky). Não voltar.
- Botões "Ver todas as marcas" e "Ver todas as novidades" não mostram número. Títulos dos cartões em até 4 linhas (`.sc h3`), destaques 3.
- Google: favicon da loja (`favicon.ico`, `favicon-48/192/512.png`, `apple-touch-icon.png`) no lugar do emoji 🔩; JSON-LD `logo` = `favicon-512.png` e `WebSite` com o nome. Não apagar esses arquivos.
- Páginas para o Google: `categoria/<nome>/` e `marca/<nome>/` (HTML simples com a lista de produtos e links para `/#p-<id>`), geradas por `python3 ferramentas/paginas_google.py`, que também refaz o `sitemap.xml`. **Rodar de novo depois de cada lote** (nomes, categorias ou marcas novas).
- Logos das marcas: `img/logos/<slug>.webp` no campo `img` de `brands` do JSON (o `rpFetchSite` copia para as marcas do Supabase que estão sem logo). Marcas de nome duvidoso ficaram sem logo de propósito.
- Nomes: sem abreviações (AC = aço carbono, MA = rosca métrica, MB = rosca métrica fina, ET = enegrecido temperado, cód. = código, SOQ = soquete etc.) e com acentos. Produtos com nome igual levam "(referência X)" e, se a referência também for igual, "código" interno.

## Gratidão a Deus no rodapé (12/11/2026, pedido do dono: família religiosa)

- `bibFoot()` mostra no rodapé, antes do aviso legal, "Gratidão a Deus" e um versículo da lista `BIB` (8 versículos curtos sobre confiança, trabalho honesto e gratidão), trocando um por dia. CSS `.bibf`. Não remover; para trocar ou acrescentar versículos, editar só a lista `BIB`.
- **Regra do dono (família religiosa):** em todo trabalho maior (página ou seção nova, aplicativo, recurso diferente, grande alteração do site) e em toda mensagem de agradecimento, colocar o nome de Deus em algum lugar como forma de agradecimento (passagem bíblica, "Graças a Deus" ou similar), com discrição. Não precisa em pequenas correções.

## Nunca apague nem altere sem pedido do dono

`google1c91dc630ad29760.html`, `CNAME`, `sitemap.xml`, `robots.txt`, `termos.html`, `CLAUDE.md`, as tags de SEO do `<head>`
e a imagem `img/og-ronaldo-parafusos-v5.jpg`.

## Avise o dono

Depois de publicar, diga em uma linha o que mudou. Os detalhes de cada recurso estão no documento
"claude/regras-do-site.md" do Projeto "site loja" no claude.ai.
