#!/usr/bin/env python3
"""(28/11/2026, pedido do dono) Melhora as descrições genéricas dos produtos ("Ferramenta manual.", "Item para casa e manutenção."...).
Para cada produto cuja descrição é repetida em 5 ou mais produtos, monta um texto novo com:
  1) para que serve o tipo de produto (regras TIPOS abaixo: conhecimento geral, sem inventar especificação);
  2) os dados que o próprio produto já tem na ficha (marca, medida, material, rosca, tensão...);
  3) o "Também conhecido como ..." que já existia (é usado pela busca).
Não mexe em descrição específica (escrita para um produto só), nem em produto editado no painel (et), nem em preço.
Uso: python3 ferramentas/descricoes.py  -> grava dados.json com up = up do Supabase + 1 nos itens alterados (não vira Novidade) e ver novo."""
import json, re, unicodedata, collections, time, urllib.request

def nn(s):
    s = unicodedata.normalize("NFD", str(s).lower()); return "".join(c for c in s if unicodedata.category(c) != "Mn")

# (expressão no nome sem acento, frase). A primeira que bater vale; as mais específicas vêm antes.
TIPOS = [
 (r"^chave (de )?fenda|^chave philips|^chave phillips", "Chave para apertar e soltar parafusos de fenda, com ponta temperada e cabo que dá firmeza na mão."),
 (r"^chave combinada", "Chave combinada: uma ponta de boca aberta e outra de estrela na mesma medida, para apertar e soltar porcas e parafusos sextavados."),
 (r"^chave (de )?boca|^chave fixa", "Chave de boca para apertar e soltar porcas e parafusos sextavados em montagem e manutenção."),
 (r"^chave estrela", "Chave estrela, que abraça a porca ou o parafuso sextavado por todos os lados e evita espanar."),
 (r"^chave (hexagonal|allen|l\b)", "Chave hexagonal (tipo Allen) para parafusos com sextavado interno, muito usada em máquinas, móveis e bicicletas."),
 (r"^chave torx", "Chave Torx (estrela de 6 pontas) para parafusos com encaixe Torx, comuns em máquinas, eletrodomésticos e veículos."),
 (r"^chave soquete|^soquete|^jogo (de )?soquete", "Soquete para apertar e soltar porcas e parafusos sextavados, usado com catraca, cabo T ou chave de impacto."),
 (r"^chave canhao", "Chave canhão (chave de cano) para porcas e parafusos em lugares fundos ou de difícil acesso."),
 (r"^chave (de )?biela", "Chave de biela, em formato de tubo com duas medidas, para porcas em lugares fundos."),
 (r"^chave (de )?roda", "Chave de roda para apertar e soltar os parafusos ou porcas das rodas de veículos."),
 (r"^chave (inglesa|ajustavel)", "Chave ajustável (chave inglesa), que regula a abertura para servir em porcas e parafusos de várias medidas."),
 (r"^chave (de )?grifo|^chave grifo", "Chave grifo para apertar e segurar canos, tubos e conexões redondas."),
 (r"^chave (de )?vela", "Chave de vela para tirar e colocar a vela de ignição do motor."),
 (r"^chave (de )?corrente|^chave cinta", "Chave de corrente para segurar e girar tubos e peças redondas."),
 (r"^chave (de )?teste|^chave teste", "Chave de teste para verificar se há tensão (energia) em tomadas, fios e equipamentos."),
 (r"^chave .*(motosserra|rocadeira)", "Chave para manutenção de motosserras e roçadeiras: apertar a corrente, o sabre e trocar a vela."),
 (r"^jogo (de )?chave|^jogo de chaves|^kit (de )?ferramentas", "Jogo de chaves em várias medidas para ter sempre a ferramenta certa à mão em casa, na oficina e no campo."),
 (r"^jogo (de )?escova|^escova.*(motor|furadeira|esmerilhadeira|carvao)|^escovas? de carvao", "Escovas de carvão para motores elétricos de ferramentas: quando gastas, a ferramenta perde força ou para de funcionar."),
 (r"^jogo (de )?junta|^junta", "Junta de vedação que evita vazamento de ar, óleo ou combustível entre as peças do motor ou do equipamento."),
 (r"^jogo (de )?(broca|brocas)|^kit (de )?brocas", "Jogo de brocas em várias medidas para furar com furadeira ou parafusadeira."),
 (r"^jogo (de )?bits|^bits?\b|^ponta (de )?parafusadeira|^ponta phillips", "Bits (pontas) para parafusadeira e chave de catraca, para apertar e soltar parafusos com rapidez."),
 (r"^jogo (de )?extrator|^extrator", "Extrator para retirar parafusos quebrados ou espanados."),
 (r"^jogo (de )?aneis|^anel elastico|^anel trava|^anel (de )?retencao", "Anel elástico (trava) que prende peças em eixos ou furos e impede que saiam do lugar."),
 (r"^anel (de )?vedacao|^anel o\b|^oring|^o ring", "Anel de vedação (o-ring) de borracha que impede vazamento de água, ar, óleo ou gás nas conexões e peças."),
 (r"^anel (de )?compressao|^anel (do )?pistao|^aneis", "Anéis de pistão que vedam a câmara de combustão do motor e garantem a compressão."),
 (r"^broca", "Broca para furar com furadeira ou parafusadeira. O material indicado (madeira, metal, concreto) e a medida estão no nome."),
 (r"^parafuso.*(telha)", "Parafuso para fixar telhas metálicas ou de fibrocimento em estruturas de madeira ou metal."),
 (r"^parafuso.*(soberba|atarraxante|madeira|chipboard|mdf)", "Parafuso de rosca soberba (atarraxante), que abre a própria rosca em madeira, MDF e bucha."),
 (r"^parafuso.*(allen|cabeca cilindrica)", "Parafuso com sextavado interno (Allen), usado em máquinas, motores, moldes e montagens que pedem bom aperto."),
 (r"^parafuso.*(francês|frances|carroceria)", "Parafuso francês (de carroceria), com cabeça abaulada e pescoço quadrado que trava na madeira."),
 (r"^parafuso.*(sextavad)", "Parafuso de cabeça sextavada para fixar estruturas metálicas, máquinas, implementos e madeira."),
 (r"^parafuso", "Parafuso para fixação em montagem, manutenção e construção. Medida e tipo de rosca no nome e na ficha."),
 (r"^porca", "Porca para uso com parafusos e barras roscadas. Use a mesma rosca e medida do parafuso."),
 (r"^arruela", "Arruela que distribui a força do aperto, protege a superfície e ajuda a evitar que a porca ou o parafuso afrouxe."),
 (r"^barra roscada|^vergalhao", "Barra roscada para montagens, fixação de estruturas, suportes e chumbamento."),
 (r"^prisioneiro", "Prisioneiro (parafuso sem cabeça, roscado nas duas pontas) para fixar peças de motor e máquinas."),
 (r"^chumbador|^parabolt", "Chumbador para fixar peças, suportes e máquinas em concreto e alvenaria."),
 (r"^bucha", "Bucha para fixar parafusos em parede, concreto ou alvenaria com segurança."),
 (r"^prego", "Prego para fixar madeira em construção, marcenaria, cercas e reparos."),
 (r"^rebite", "Rebite para unir chapas e peças com rebitadeira, sem precisar de solda."),
 (r"^pino|^contra.?pino|^cupilha", "Pino de fixação e trava para eixos, articulações e implementos."),
 (r"^grampo.*(cerca|galvanizado)|^grampo x|^grampo leve|^grampo (para )?madeiramento", "Grampo para fixar arame em mourões e madeira, em cercas e uso rural."),
 (r"^grampo (de )?marceneiro|^grampo sargento|^grampo tipo", "Grampo para prender peças com firmeza enquanto cola, corta, fura ou solda."),
 (r"^grampo.*grampeador|^grampos", "Grampos para grampeador."),
 (r"^disco (de )?corte", "Disco de corte para esmerilhadeira, para cortar metal, inox ou outros materiais conforme o nome."),
 (r"^disco (de )?(lixa|flap)|^disco flap", "Disco de lixa (flap) para esmerilhadeira, para desbastar, rebarbar e dar acabamento em metal e madeira."),
 (r"^disco diamantado", "Disco diamantado para cortar concreto, cerâmica, porcelanato, pedra e alvenaria com serra mármore ou esmerilhadeira."),
 (r"^disco (de )?desbaste", "Disco de desbaste para esmerilhadeira, para remover material e rebarbas de solda em metal."),
 (r"^disco (de )?serra|^serra circular", "Disco de serra para cortar madeira e outros materiais com serra circular."),
 (r"^disco", "Disco para esmerilhadeira, lixadeira ou serra, conforme o tipo indicado no nome."),
 (r"^rebolo", "Rebolo para moto esmeril, usado para afiar ferramentas e desbastar metal."),
 (r"^lixa", "Lixa para preparar e dar acabamento em superfícies. O número indica a grossura: quanto maior, mais fina."),
 (r"^serra copo", "Serra copo para abrir furos redondos grandes, como passagem de tubos, caixas elétricas e fechaduras."),
 (r"^serra tico|^lamina (de )?serra tico|^lamina tico", "Lâmina para serra tico-tico, para cortes retos e curvos."),
 (r"^arco de serra|^serra manual|^lamina (de )?serra|^serra fita", "Serra para cortar metal, madeira ou cano à mão."),
 (r"^serrote", "Serrote para cortar madeira à mão."),
 (r"^fio (de )?nylon|^carretel", "Fio de nylon (ou carretel) para roçadeira, para roçar grama, mato e capim."),
 (r"^cabo flex|^cabo (eletrico|pp|triplex|duplex)|^fio\b", "Cabo elétrico para instalações e ligação de equipamentos. A bitola (mm²) indica a corrente que suporta."),
 (r"^cabo (de )?aco", "Cabo de aço para amarração, tração, içamento e cercas."),
 (r"^cabo (do )?acelerador", "Cabo do acelerador para roçadeiras, motosserras e outras máquinas."),
 (r"^cabo (para |de )?(martelo|machado|enxada|cavadeira|picareta|foice|marreta|lima|ferramenta)|^cabo arqueado|^cabo (de )?madeira", "Cabo de reposição para ferramentas manuais."),
 (r"^corda", "Corda para amarração, carga, uso rural e uso geral."),
 (r"^corrente.*(motosserra)|^corrente \d|^corrente para", "Corrente para motosserra. Confira o passo, a bitola e o número de elos do seu sabre."),
 (r"^corrente", "Corrente para amarração, segurança e uso geral."),
 (r"^sabre", "Sabre (espada) para motosserra, a guia por onde a corrente corre. Confira o tamanho e o encaixe da sua máquina."),
 (r"^lima", "Lima para afiar correntes de motosserra, ferramentas e dar acabamento em metal."),
 (r"^carburador", "Carburador, peça que mistura ar e combustível para o motor funcionar. Confira o modelo da sua máquina."),
 (r"^reparo (de |do )?carburador|^kit reparo|^reparo", "Kit de reparo com as peças de vedação e desgaste para recuperar o componente indicado no nome."),
 (r"^filtro (de )?ar", "Filtro de ar que impede a entrada de poeira no motor e ajuda a manter a força e a vida útil."),
 (r"^filtro (de )?(combustivel|gasolina)", "Filtro de combustível que segura sujeiras antes de chegarem ao carburador ou à bomba."),
 (r"^filtro (de )?oleo", "Filtro de óleo que retém impurezas e protege o motor."),
 (r"^filtro", "Filtro de reposição para máquinas e equipamentos."),
 (r"^vela", "Vela de ignição, que gera a faísca para o motor funcionar. Confira o modelo indicado para a sua máquina."),
 (r"^pistao|^pitao|^kit cilindro|^cilindro", "Peça do conjunto cilindro e pistão do motor. Confira o modelo e o diâmetro da sua máquina."),
 (r"^virabrequim|^biela", "Peça do conjunto do virabrequim do motor. Confira o modelo da sua máquina."),
 (r"^tampa (do )?tanque", "Tampa de tanque de combustível ou de óleo de reposição."),
 (r"^tampa (de )?partida|^partida|^arranque|^cordinha|^corda de partida", "Peça do sistema de partida (arranque) retrátil do motor."),
 (r"^mola", "Mola de reposição para máquinas, ferramentas e equipamentos."),
 (r"^embreagem|^tambor|^pinhao|^coroa", "Peça da transmissão (embreagem, tambor ou pinhão) que leva a força do motor até a corrente ou o eixo."),
 (r"^silencioso|^silenciador|^escape|^escapamento", "Silencioso (escapamento) que reduz o barulho e direciona os gases do motor."),
 (r"^bobina|^modulo", "Bobina (módulo) de ignição, que gera a energia da faísca da vela."),
 (r"^retentor", "Retentor que segura o óleo ou a graxa dentro do equipamento e impede a entrada de sujeira."),
 (r"^rolamento", "Rolamento que reduz o atrito e permite o giro suave de eixos e rodas."),
 (r"^valvula (de )?retencao", "Válvula de retenção que deixa a água passar só em um sentido e impede o retorno."),
 (r"^valvula (de )?pe", "Válvula de pé (de fundo) com crivo, usada na ponta da sucção da bomba para manter a escorva e segurar sujeiras."),
 (r"^valvula.*pneu", "Válvula (bico) para pneus e câmaras de ar."),
 (r"^valvula", "Válvula para controle ou vedação de água, ar ou gás na instalação."),
 (r"^registro", "Registro para abrir e fechar a passagem de água na instalação hidráulica."),
 (r"^torneira", "Torneira para pia, tanque, jardim ou uso geral."),
 (r"^engate rapido|^engate", "Engate para ligar e desligar mangueiras e equipamentos com facilidade."),
 (r"^adaptador (escama|mangueira)|^espigao", "Adaptador com escama (espigão) para ligar mangueira a rosca ou conexão."),
 (r"^adaptador (de )?soquete|^adaptador (de )?impacto", "Adaptador para usar soquetes de um encaixe em catraca ou chave de outro encaixe."),
 (r"^adaptador", "Adaptador para unir peças, conexões ou acessórios de medidas ou tipos diferentes."),
 (r"^(conexao|joelho|cotovelo|curva|te\b|tee|luva (femea|roscavel|soldavel|reducao)|uniao|niple|bujao|cap\b|reducao)", "Conexão para instalações hidráulicas, de irrigação, ar ou gás. Medida e tipo de rosca conforme o nome."),
 (r"^mangueira", "Mangueira para condução de água, ar, gás ou outros fluidos, conforme o tipo e a medida no nome."),
 (r"^mangote", "Mangote para sucção e recalque de água em motobombas e irrigação."),
 (r"^abracadeira", "Abraçadeira para prender mangueiras, cabos e tubos com firmeza."),
 (r"^bomba.*(oleo|graxa|engraxar)", "Bomba manual para aplicar óleo ou graxa em máquinas, veículos e implementos."),
 (r"^bomba.*(submersa|periferica|centrifuga|multiestagio|agua|anauger|thebe)", "Bomba d'água para captação, abastecimento, irrigação ou pressurização, conforme o modelo."),
 (r"^bomba.*(encher|\bar\b)", "Bomba para encher pneus, bolas e boias."),
 (r"^bomba", "Bomba de reposição para máquinas e motores, conforme o modelo indicado."),
 (r"^motobomba", "Motobomba para puxar água de rio, poço ou reservatório e levar para irrigação, limpeza e abastecimento."),
 (r"^motor", "Motor para acionar bombas, máquinas e equipamentos."),
 (r"^macho", "Macho para abrir rosca interna em furos, usado com desandador."),
 (r"^cossinete|^tarraxa", "Cossinete (tarraxa) para abrir rosca externa em barras e tubos."),
 (r"^alicate", "Alicate para segurar, apertar, dobrar e cortar arames e peças."),
 (r"^martelo", "Martelo para pregar, bater e ajustar peças."),
 (r"^marreta", "Marreta para serviços pesados de impacto em construção, demolição e campo."),
 (r"^talhadeira|^ponteiro", "Talhadeira (ponteiro) para quebrar, abrir rasgos e cortar concreto, alvenaria e metal com martelo ou marreta."),
 (r"^formao", "Formão para entalhar, desbastar e fazer encaixes em madeira."),
 (r"^trena", "Trena para medir distâncias em obras, marcenaria e uso geral."),
 (r"^nivel", "Nível para conferir se superfícies e peças estão retas (no nível ou no prumo)."),
 (r"^esquadro", "Esquadro para conferir e marcar ângulos retos."),
 (r"^paquimetro", "Paquímetro para medir com precisão diâmetros, espessuras e profundidades."),
 (r"^multimetro|^voltimetro", "Multímetro para medir tensão, corrente e resistência em instalações e aparelhos elétricos."),
 (r"^tesoura", "Tesoura para corte em jardinagem, poda, chapas ou uso geral, conforme o modelo."),
 (r"^estilete", "Estilete para cortar papel, papelão, plástico e materiais finos."),
 (r"^faca|^facao|^canivete", "Lâmina de corte para uso no campo, na cozinha ou em serviços gerais."),
 (r"^machado|^machadinha", "Machado para cortar e rachar lenha e madeira."),
 (r"^enxada|^enxadao|^picareta|^cavadeira|^pa\b|^forcado|^rastelo|^ancinho", "Ferramenta de campo e jardinagem para cavar, capinar, carregar e preparar o solo."),
 (r"^botina|^bota", "Calçado de segurança para trabalho em obras, indústria, oficina e campo."),
 (r"^luva", "Luva de proteção para as mãos no trabalho."),
 (r"^oculos", "Óculos de segurança que protegem os olhos de partículas, respingos e poeira."),
 (r"^capacete", "Capacete de segurança para proteger a cabeça em obras e serviços."),
 (r"^mascara|^respirador", "Máscara de proteção respiratória contra poeiras e partículas."),
 (r"^protetor auricular|^abafador", "Protetor auricular para reduzir o barulho e proteger a audição."),
 (r"^tinta|^esmalte|^rural\b|^lazzudur|^brasiline|^primer|^fundo", "Tinta para pintura e proteção de superfícies. Cor e embalagem conforme o nome do produto."),
 (r"^verniz|^seladora|^laca", "Verniz (acabamento) para proteger e dar brilho à madeira e outras superfícies."),
 (r"^massa", "Massa para preparar, corrigir e nivelar superfícies antes da pintura."),
 (r"^thinner|^aguarras|^removedor|^solvente", "Solvente para diluir tintas e limpar ferramentas e superfícies."),
 (r"^trincha|^pincel|^rolo", "Ferramenta de pintura para aplicar tinta, verniz e seladores."),
 (r"^adesivo|^cola", "Adesivo (cola) para unir peças e materiais conforme o tipo indicado."),
 (r"^silicone|^veda|^vedacalha|^espuma", "Produto de vedação para fechar frestas, juntas e evitar vazamentos."),
 (r"^graxa|^oleo|^lubrificante|^desengripante|^spray", "Lubrificante ou produto de manutenção para proteger e fazer as peças trabalharem melhor."),
 (r"^dobradica", "Dobradiça para portas, portões, janelas e móveis."),
 (r"^puxador", "Puxador para portas, gavetas e móveis."),
 (r"^fechadura|^cadeado|^ferrolho|^trinco|^tranca|^tramela", "Ferragem de segurança para trancar portas, portões, janelas e cadeados."),
 (r"^rodizio|^roda|^roldana", "Rodízio (roda) para carrinhos, móveis e equipamentos se movimentarem com facilidade."),
 (r"^lampada", "Lâmpada para iluminação de casas, comércios e áreas externas."),
 (r"^luminaria|^refletor|^lanterna", "Iluminação para casas, comércios, obras e áreas externas."),
 (r"^disjuntor|^dps", "Proteção elétrica para o quadro de energia: desliga o circuito em sobrecarga ou surto."),
 (r"^tomada|^interruptor|^plug|^plugue|^benjamim|^extensao", "Material elétrico para ligar aparelhos e instalações com segurança."),
 (r"^terminal", "Terminal elétrico para fazer a ligação dos fios com segurança."),
 (r"^fita isolante", "Fita isolante para isolar emendas e fios elétricos."),
 (r"^fita", "Fita adesiva ou de vedação para uso geral."),
 (r"^eletrodo", "Eletrodo para solda elétrica, conforme o tipo e a bitola indicados."),
 (r"^arame", "Arame para cercas, amarração e uso rural."),
 (r"^tela", "Tela para cercamento, proteção e uso rural ou na construção."),
 (r"^lona", "Lona para cobertura, proteção e uso rural."),
 (r"^cinta", "Cinta para amarração e fixação de cargas."),
 (r"^gancho|^mosquetao|^esticador|^manilha|^sapatilha", "Acessório para amarração, içamento e fixação de cabos e correntes."),
 (r"^suporte", "Suporte para fixação e apoio, conforme o uso indicado no nome."),
 (r"^tubo|^cano", "Tubo para instalações hidráulicas, elétricas ou de irrigação, conforme o tipo."),
 (r"^caixa", "Caixa para instalação, armazenamento ou proteção, conforme o tipo indicado."),
 (r"^aspersor|^microaspersor|^gotejador", "Peça de irrigação para molhar plantas, hortas e lavouras."),
 (r"^pulverizador|^atomizador", "Pulverizador para aplicar defensivos, adubos líquidos e produtos de limpeza."),
 (r"^escova", "Escova para limpeza, remoção de ferrugem ou acabamento, conforme o tipo."),
 (r"^bico", "Bico de reposição conforme o equipamento indicado no nome."),
 (r"^ponta montada", "Ponta montada (pedra de esmeril com haste) para retificadeira e furadeira, para desbastar e dar acabamento."),
 (r"^mandril", "Mandril que prende brocas e acessórios na furadeira."),
 (r"^ferro (de )?(soldar|solda)", "Ferro de solda para soldar fios e componentes eletrônicos com estanho."),
 (r"^ferro pua|^pua", "Ferro pua (broca para madeira) para furos em madeira com arco de pua ou furadeira."),
 (r"^saca", "Ferramenta saca para retirar peças presas sem danificar."),
 (r"^sem fim|^rosca sem fim", "Abraçadeira de rosca sem fim para prender mangueiras e tubos."),
 (r"^kit", "Kit com as peças indicadas no nome."),
]
TRX = [(re.compile(rx), t) for rx, t in TIPOS]
CAMPOS = ["Medida", "Medidas", "Bitola", "Comprimento", "Tamanho", "Material", "Matéria-prima", "Acabamento", "Rosca", "Sistema da Rosca", "Passo Rosca",
          "Tensão", "Potência", "Volume", "Peso/conteúdo", "Cor", "Modelo", "Classe Resistência", "Tipo da Cabeça", "Tipo de Fenda", "Capacidade"]

def ficha(p):
    o = collections.OrderedDict()
    for l in str(p.get("s") or "").split("\n"):
        if ":" in l:
            k, v = l.split(":", 1); k = k.strip(); v = v.strip()
            if v and k not in o: o[k] = v
    return o

def nova(p, velho):
    n = nn(p["n"]); t = None
    for rx, frase in TRX:
        if rx.search(n): t = frase; break
    f = ficha(p); partes = []
    b = str(p.get("brand") or f.get("Marca") or "").strip()
    if b and nn(b) not in n: partes.append(f"Marca {b}")
    for k in CAMPOS:
        if k in f and nn(f[k]) not in n and len(partes) < 4:
            partes.append(f"{k[0].lower() + k[1:]} {f[k]}")
    tam = ""
    m = re.search(r"Também conhecido como:?[^\n]*", velho or "")
    if m: tam = m.group(0).strip()
    base = t or (velho.split("Também conhecido")[0].strip() if velho else "")
    txt = base
    if partes:
        frase = ", ".join(partes); frase = frase[0].upper() + frase[1:]
        txt += (" " if txt else "") + frase + ("" if frase.endswith(".") else ".")
    if tam and tam not in txt: txt += " " + tam
    return txt.strip()

if __name__ == "__main__":
    d = json.load(open("dados.json", encoding="utf-8"))
    cfg = open("config.js", encoding="utf-8").read()
    u_ = re.search(r'url:\s*"([^"]+)"', cfg).group(1); k_ = re.search(r'key:\s*"([^"]+)"', cfg).group(1)
    sb = json.loads(urllib.request.urlopen(urllib.request.Request(u_ + "/rest/v1/site?select=data", headers={"apikey": k_}), timeout=120).read())[0]["data"]
    live = {p["id"]: p for p in sb["prods"]}
    c = collections.Counter(str(p.get("d") or "").split("Também conhecido")[0].strip() for p in d["prods"])
    mud = 0; sem_tipo = collections.Counter()
    for p in d["prods"]:
        lv = live.get(p["id"])
        if lv and lv.get("et"): continue
        velho = str(p.get("d") or "").strip()
        if c[velho.split("Também conhecido")[0].strip()] < 5: continue
        novo = nova(p, velho)
        if novo and novo != velho:
            if not any(rx.search(nn(p["n"])) for rx, _ in TRX): sem_tipo[nn(p["n"]).split(" ")[0]] += 1
            p["d"] = novo
            p["up"] = max(int(p.get("up") or 0), int((lv or {}).get("up") or 0)) + 1
            mud += 1
    d["ver"] = int(time.time() * 1000)
    json.dump(d, open("dados.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print(mud, "descrições melhoradas; sem tipo (só os dados da ficha):", sum(sem_tipo.values()))
