
var BOOT=window.RP_BOOT||JSON.parse((document.getElementById("data")||{textContent:"{}"}).textContent),S=BOOT,RPL=true,STATIC=(function(){var e=document.getElementById("sm");return e?e.innerHTML:""})(),HTT="Ronaldo Parafusos | Parafusos, ferragens e ferramentas",canEdit=false,edit=false,dirty=false,cat="",term="",art=null,assets=null,view="",bi=0,bt=null,bpause=false,bfil="",pg="",pv="",F=null,fopen=null;
if(!S.prods)S.prods=[];(function(){var e=document.getElementById("pre");if(e)try{S.prods=JSON.parse(e.textContent)}catch(x){}})();
function $(i){return document.getElementById(i)}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function norm(s){return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}
function uid(){return Date.now().toString(36)+Math.floor(Math.random()*1e4).toString(36)}
function tel(){return "tel:+55"+String(S.s.phone||"").replace(/\D/g,"")}
var INFRAME=(function(){try{return window.self!==window.top}catch(e){return true}})();
function isTouch(){try{return window.matchMedia("(pointer:coarse)").matches}catch(e){return false}}
function fmtPhone(d){d=String(d||"").replace(/\D/g,"");if(d.indexOf("55")===0&&d.length>11)d=d.slice(2);if(d.length===11)return"("+d.slice(0,2)+") "+d.slice(2,7)+"-"+d.slice(7);if(d.length===10)return"("+d.slice(0,2)+") "+d.slice(2,6)+"-"+d.slice(6);return d}
function copyText(txt,done){
  function fb(){var r=false,i=document.createElement("input");i.value=txt;i.setAttribute("readonly","");i.style.cssText="position:fixed;left:-9999px;top:0;opacity:0";document.body.appendChild(i);try{i.focus();i.select();i.setSelectionRange(0,9999);r=document.execCommand("copy")}catch(e){}document.body.removeChild(i);done(r)}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(function(){done(true)},fb)}else fb();
}
function cldEl(){
  var dl=$("cld");
  if(!dl){dl=document.createElement("dialog");dl.id="cld";document.body.appendChild(dl);dl.addEventListener("click",function(e){if(e.target===dl)dl.close()})}
  return dl;
}
function callBox(href){
  var d=String(href||"").replace(/\D/g,""),num=fmtPhone(d),dl=cldEl();
  dl.setAttribute("aria-label","Ligar para a loja");
  var wa=waNum()?'<a class="cwa full" href="'+esc(waHello())+'" target="_blank" rel="noopener">'+WAI+'Chamar no WhatsApp</a>':"";
  dl.innerHTML='<h3>Ligar para a loja</h3><p class="cln" data-num="'+esc(num)+'">'+esc(num)+'</p><p class="note" style="text-align:center">Neste modo de visualização o celular não abre o discador sozinho. Copie o número e cole no telefone, ou chame direto pelo WhatsApp.</p><div class="shg"><button class="cbn cgo full" type="button" data-act="clc" data-id="'+esc(num)+'">Copiar número</button>'+wa+'</div><p class="note" id="clm" role="status"></p><div class="row"><button class="btn dark" type="button" data-act="clx">Fechar</button></div>';
  if(!dl.open)dl.showModal();
}
function mailBox(href){
  var m=String(href||"").replace(/^mailto:/i,"").split("?")[0],dl=cldEl();
  dl.setAttribute("aria-label","Enviar e-mail");
  dl.innerHTML='<h3>Enviar e-mail</h3><p class="cln cml" data-num="'+esc(m)+'">'+esc(m)+'</p><p class="note" style="text-align:center">Neste modo de visualização o celular pode não abrir o aplicativo de e-mail. Se não abrir, copie o endereço.</p><div class="shg"><a class="cgo" data-native="1" href="'+esc(href)+'">'+IC.ml+'Abrir e-mail</a><button class="cbn" type="button" data-act="clc" data-id="'+esc(m)+'" data-m="E-mail copiado!">Copiar e-mail</button></div><p class="note" id="clm" role="status"></p><div class="row"><button class="btn dark" type="button" data-act="clx">Fechar</button></div>';
  if(!dl.open)dl.showModal();
}
function catOf(id){return S.cats.filter(function(c){return c.id===id})[0]}
function render(){CPC=null;clearInterval(bt);theme();if((pg==="cat"&&!catOf(pv))||(pg==="brand"&&!brandBySlug(slug(pv)))){pg="";pv="";location.hash=""}if(view&&!RPL&&!S.prods.some(function(x){return x.id===view})){view="";if(location.hash.indexOf("#p-")===0)location.hash=""}
  var s=S.s,h='<header class="'+hcl()+'"><div class="wrap"><a class="brand" href="#inicio" data-ed="logo">'+brandLogo()+'</a><div class="sw"><input id="hq" class="hs" data-ed="tx:ph" type="search" autocomplete="off" placeholder="'+(VOZ?T("ph"):"Digite ou fale pelo microfone do teclado")+'" aria-label="Buscar produtos" value="'+esc(term)+'">'+micH()+'<div id="sr" class="sr" hidden></div></div><nav>'+(typeof tvH==="function"?tvH():"")+(canEdit?'<button class="btn dark" type="button" data-act="te">'+(edit?"Sair da edição":"Editar site")+'</button>':'')+cartHd()+'</nav></div>'+(typeof catBar==="function"?catBar():"")+'</header>';
  if(canEdit&&edit)h+='<div class="bar"><div class="wrap"><b>Modo de edição <small style="font-weight:400">· dica: clique com o botão direito em qualquer texto, botão, endereço, produto, categoria ou marca para editar</small></b><button class="btn dark sm" type="button" data-act="np">+ Produto</button><button class="btn sm" type="button" data-act="mass">Edição em massa</button><button class="btn sm" type="button" data-act="bsl">Buscas sem resultado</button><button class="btn sm" type="button" data-act="avl">Avisos de erro<span class="avn">'+(typeof AVN!=="undefined"&&AVN?" ("+AVN+")":"")+'</span></button><button class="btn dark sm" type="button" data-act="ec">Categorias</button><button class="btn dark sm" type="button" data-act="es">Textos e contato</button><button class="btn dark sm" type="button" data-act="ebt">Botões de contato</button><button class="btn dark sm" type="button" data-act="ecm">Mensagem do carrinho</button><button class="btn dark sm" type="button" data-act="eb">Destaques</button><button class="btn dark sm" type="button" data-act="em">Marcas</button><button class="btn dark sm" type="button" data-act="ev">Vídeo e sobre</button><button class="btn dark sm" type="button" data-act="efs">Rodapé</button><button class="btn dark sm" type="button" data-act="efl">Links do rodapé</button><button class="btn dark sm" type="button" data-act="eo">Lojas</button><button class="btn sm" type="button" data-act="pub"'+(dirty?'':' disabled')+'>Publicar alterações</button></div></div>';
  var top=h;h+='<main id="inicio">'+home();
  h+=videoSec();h+=faqSec();h+=contactSec()+'</main>'+footer()+'';
  if(view)h=top+'<main id="inicio">'+(prodById(view)?prodPage(view):'<div class="wrap"><p class="ldg">Carregando produto…</p></div>')+'</main>'+footer()+'';else if(pg)h=top+'<main id="inicio">'+(pg==="static"?'<div class="wrap"><div class="stc stin">'+STATIC+'</div></div><div class="stp2"><div class="wrap"><h2 class="sh">Conheça nossos produtos</h2></div>'+homeLite()+'</div>':pg==="compare"?compPage():pg==="cart"?cartPage():pg==="brands"?brandsPage():(pg==="mass"&&canEdit&&typeof massPage==="function")?massPage():listPage())+'</main>'+footer()+'';rTitle();$("root").innerHTML=h+'<div id="cptw">'+cpTrayH()+'</div>'+(typeof waFab==="function"?waFab():"");cpSync();if(pg==="cart")cLive();bindSearch();railInit();if(pg==="mass"&&canEdit&&typeof massBind==="function")massBind();if(view||pg)return;
  startBn();
}
function go(h){var u=hPath(h);if(u){if(location.pathname!==u||location.hash)history.pushState(null,"",u);route();return}if(location.pathname!=="/"&&RTH.test(h)){history.pushState(null,"","/"+h);route();return}if(location.hash===h)route();else location.hash=h}
var RT_HOME=false,HOMEY=0;
function route(){
  if(RT_HOME)HOMEY=window.scrollY;
  var h=location.hash,m,P=location.pathname;view="";pg="";pv="";fmore=0;cpW=null;
  if(h&&RTH.test(h)){var u=hPath(h);if(u){if(u!==P)try{history.replaceState(null,"",u)}catch(e){}P=u;h=""}else if(P!=="/"){try{history.replaceState(null,"","/"+h)}catch(e){}P="/"}}
  if(P!=="/"&&P!=="/index.html"&&(!h||h==="#")){var q=pathRt(P);view=q.v;pg=q.g;pv=q.pv}
  else if(m=/^#p-(.+)$/.exec(h))view=m[1];
  else if(h==="#produtos")pg="all";
  else if(h==="#busca")pg="search";
  else if(h==="#carrinho")pg="cart";else if(h==="#marcas")pg="brands";else if(h==="#edicao-em-massa")pg="mass";else if(h==="#novidades")pg="all";
  else if(m=/^#comparar(?:-(.*))?$/.exec(h)){pg="compare";if(m[1])CMP=m[1].split(",").filter(function(id,i,a){return a.indexOf(id)===i&&prodById(id)}).slice(0,CP_MAX)}
  else if(m=/^#cat-(.+)$/.exec(h)){if(catOf(m[1])){pg="cat";pv=m[1]}}
  else if(m=/^#marca-(.+)$/.exec(h)){var b=brandBySlug(m[1]);if(b){pg="brand";pv=b.n}}
  if(pg==="compare"&&!CMP.length){CPG=null;CPQ="";CPN=20}LN=48;F=newF();if(h==="#novidades")F.nw=true;if(pg==="cat")F.cats=[pv];if(pg==="brand")F.brands=[pv];
  render();
  if(view||pg)toY(0);else if(h.length>1){var t=$(h.slice(1));if(t)t.scrollIntoView()}else toY(HOMEY);
  RT_HOME=!(view||pg)&&h.length<=1;
}
function lines(t){return String(t||"").split("\n").map(function(l){return l.trim()}).filter(Boolean)}
function prodPage(id){
  var p=S.prods.filter(function(x){return x.id===id})[0],c=catOf(p.c)||{i:"🔩",n:"",id:""},g=p.gal&&p.gal.length?p.gal:(p.img?[p.img]:[]),th="";
  g.forEach(function(x,i){th+='<button class="th'+(i?"":" on")+'" type="button" data-act="gi" data-id="'+esc(x)+'" aria-label="Foto '+(i+1)+'"><img src="'+esc(rpImg(x))+'" alt=""></button>'});
  var sp=lines(p.s).filter(function(l){return l.indexOf(":")>0}),mo=lines(p.more),ds=lines(p.d);
  var sim=simOf(p);
  var h='<div class="pp"><div class="wrap"><div class="bc"><a href="#inicio">'+T("bcH")+'</a><span>›</span><button type="button" data-act="gc" data-id="'+esc(c.id)+'">'+esc(c.n)+'</button><span>›</span><span>'+esc(p.n)+'</span></div><div class="pth"><h1 class="pt">'+nmH(p)+'</h1><button class="shb" type="button" data-act="sh" data-id="'+esc(id)+'" aria-label="Compartilhar este produto" title="Compartilhar este produto">'+SHI+'<span class="shl">Compartilhar</span></button></div><p class="meta">'+(p.code?'Código: '+esc(p.code)+'    ':'')+(p.brand?'Marca: <button class="lnk2" type="button" data-act="bf" data-id="'+esc(p.brand)+'">'+esc(p.brand)+'</button>':'')+(p.rt?" "+stars(p.rt):"")+(p.nw?' <span class="nb2">Lançamento</span>':"")+'</p>';
  h+='<div class="top"><div class="gal'+(g.length>1?'':' one')+'">'+(g.length>1?'<div class="ths">'+th+'</div>':'')+'<div class="gm">'+(g.length?'<img id="gmain" src="'+esc(rpImg(g[0]))+'" alt="'+esc(p.n)+'">':catIcon(c))+'</div></div>';
  h+='<div class="box">'+priceBlock(p)+''+(tv("boxP")?"<p>"+T("boxP")+"</p>":"")+boxActs(p)+(cpShow(p)?cpBig(id):"")+ppInfo()+(S.s.hours?'<p>'+esc(S.s.hours)+'</p>':'')+(edit?'<button class="btn sm" type="button" data-act="ep" data-id="'+esc(id)+'">Editar este produto</button>':'')+'</div></div>';
  h+='<div class="sec"><h2>'+T("descT")+'</h2>'+(ds.length?ds.map(function(l){return'<p>'+esc(l)+'</p>'}).join(""):'<p>Consulte nossa equipe para mais informações.</p>')+'</div>';
  if(sp.length)h+='<div class="sec"><h2>'+T("specT")+'</h2><table class="sp">'+sp.map(function(l){var i=l.indexOf(":");return'<tr><th>'+esc(l.slice(0,i).trim())+'</th><td>'+esc(l.slice(i+1).trim())+'</td></tr>'}).join("")+'</table></div>';
  if(mo.length)h+='<div class="sec"><h2>'+T("moreT")+'</h2><ul>'+mo.map(function(l){return'<li>'+esc(l)+'</li>'}).join("")+'</ul></div>';
  h+=(typeof repLink==="function"?repLink(id):"");h+=rvSec(p);h+=cpSimSec(p);
  if(sim.length)h+='<div class="sec"><h2>'+T("simT")+'</h2><div class="car"><button class="arr" type="button" data-act="sl" aria-label="Anterior">‹</button><div id="sim" class="sim">'+sim.map(pcard).join("")+'</div><button class="arr" type="button" data-act="sr" aria-label="Próximo">›</button></div></div>';
  return h+'</div></div>';
}
var BOLT='<svg class="bolt" viewBox="0 0 200 420" role="img" aria-label="Ilustração de um parafuso sextavado"><polygon points="100,6 178,48 178,132 100,174 22,132 22,48" fill="#1d2024"/><polygon points="100,34 154,62 154,118 100,146 46,118 46,62" fill="none" stroke="#ffc20e" stroke-width="6"/><rect x="58" y="174" width="84" height="238" rx="6" fill="#1d2024"/><g stroke="#ffc20e" stroke-width="7"><path d="M58 206l84 -16M58 236l84 -16M58 266l84 -16M58 296l84 -16M58 326l84 -16M58 356l84 -16M58 386l84 -16"/></g></svg>';
if(!S.banners)S.banners=[{t:"Parafusos e ferragens para obra e oficina",d:"Do parafuso ao chumbador: peça seu orçamento.",l:"p",img:""},{t:"Ferramentas e equipamentos",d:"Chaves, furadeiras, esmerilhadeiras e acessórios.",l:"t",img:""},{t:"Proteção para sua equipe",d:"Luvas, óculos, capacetes e botas de segurança.",l:"s",img:""},{t:"Conserto e peças de motosserra",d:"Correntes, sabres e revisão.",l:"mo",img:""}];
if(!S.brands)S.brands=["Bosch","Tork","Toyama","Berliner","Kärcher"];
function showBn(i){var n=document.querySelectorAll("#bn .sl").length||(S.banners||[]).length;if(!n)return;bi=(i+n)%n;var sl=document.querySelectorAll("#bn .sl"),ds=document.querySelectorAll("#bn .dots button"),k;for(k=0;k<sl.length;k++)sl[k].classList.toggle("on",k===bi);for(k=0;k<ds.length;k++){if(k===bi)ds[k].setAttribute("aria-current","true");else ds[k].removeAttribute("aria-current")}}
function startBn(){clearInterval(bt);var b=$("bn");if(!b||document.querySelectorAll("#bn .sl").length<2||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;b.addEventListener("mouseenter",function(){bpause=true});b.addEventListener("mouseleave",function(){bpause=false});b.addEventListener("focusin",function(){bpause=true});b.addEventListener("focusout",function(){bpause=false});BNI=-1;bt=setInterval(bnTick,250)}
function home(){
  var B=(typeof novBanners==="function"?novBanners():[]).concat(S.banners||[]),n=B.length,h="";
  if(bi>=n)bi=0;
  if(n){
    h+='<div class="bn" id="bn" role="region" aria-roledescription="carousel" aria-label="Destaques">';
    B.forEach(function(b,i){if(b.nv&&typeof novSlide==="function"){h+=novSlide(b,i,n);return}var im=!!b.img;h+='<div class="sl c'+(i%4)+(im?" im":"")+(i===bi?" on":"")+'"'+(im?' style="background-image:url('+esc(rpImg(b.img))+')"':"")+' role="group" aria-label="'+(i+1)+' de '+n+'"><div class="wrap sin"><div style="position:relative"><h2>'+esc(b.t)+'</h2><p>'+esc(b.d)+'</p><button class="btn'+((!im&&i%2===0)?" dark":"")+'" type="button" data-act="bgo" data-id="'+esc(b.l||"")+'">'+T("bnBtn")+'</button></div>'+((!im&&typeof bnPick==="function"&&bnPick(b))?(typeof bnPicksH==="function"?bnPicksH(b):bnPickH(bnPick(b))):((!im&&i%2===0)?BOLT:""))+'</div></div>'});
    if(n>1)h+='<button class="nav2 pv" type="button" data-act="bp" aria-label="Anterior">‹</button><button class="nav2 nx" type="button" data-act="bn" aria-label="Próximo">›</button><div class="dots">'+B.map(function(b,i){return'<button type="button" data-act="bd" data-id="'+i+'" aria-label="Destaque '+(i+1)+'"'+(i===bi?' aria-current="true"':"")+'></button>'}).join("")+'</div>';
    h+='</div><div class="stripe" aria-hidden="true"></div>';
  }
  if((S.brands||[]).length)h+='<section class="brands"><div class="wrap"><h2 class="sh">'+T("brandsT")+'</h2><div class="bl">'+brHome()+'</div></div></section>';
  h+='<section style="padding:16px 0"><div class="wrap"><h2 class="sh">'+T("catsT")+'</h2><div class="cats"><a class="ct" href="#produtos"><svg class="ci" viewBox="0 0 48 48" aria-hidden="true" fill="currentColor">'+ICONS.todos+'</svg>'+T("allT")+'</a>'+vcats().map(function(c){return'<button class="ct" type="button" data-act="gc" data-id="'+esc(c.id)+'">'+catIcon(c)+esc(c.n)+'</button>'}).join("")+'</div></div></section>';
  var fl=featList();
  if(fl.all.length&&S.s.feat!=="0")h+='<section style="padding:16px 0"><div class="wrap"><h2 class="sh">'+T("featT")+'</h2><div id="fgrid" class="g4">'+fl.shown.map(pcard).join("")+'</div><p class="frow">'+(fl.more?'<button id="fmbtn" class="btn" type="button" data-act="fmore">'+T("moreB")+'</button>':"")+'<a class="btn dark" href="#produtos">'+T("allB")+'</a></p></div></section>';
  if(typeof novSec==="function")h+=novSec();
  h+=ofiSec();
  return h;
}
var DT={brand:"Ronaldo Parafusos",navProd:"Produtos",navCont:"Contato",call:"Ligar agora",bnBtn:"Ver produtos",brandsT:"Marcas",catsT:"Navegue por categorias",featT:"Mais vendidos",prodT:"Nossos produtos",ph:"Buscar: parafuso, luva, tinta…",contT:"Peça seu orçamento",contP:"Diga o produto e a quantidade que você precisa. Também atendemos pelo Instagram.",foot:"© Ronaldo Parafusos. Ferragens, ferramentas e parafusos.",quote:"Solicitar orçamento",order:"Fazer pedido",quoteB:"Solicitar orçamento via WhatsApp",orderB:"Fazer pedido pelo WhatsApp",noP:"Consulte o preço",cash:"à vista no dinheiro ou Pix",boxP:"Fale com a gente para confirmar disponibilidade e prazo.",descT:"Descrição",specT:"Ficha técnica",moreT:"Mais sobre o produto",simT:"Clientes também procuram",cmpL:"Comparar",cmpOn:"Na comparação",cmpB:"Comparar com outros produtos",cmpBon:"Na comparação (remover)",cmpPg:"Comparar produtos",fInst:"Institucional",fAt:"Atendimento",fSoc:"Siga nossas redes",kcat:"Categorias",fSt:"Nossas lojas",routeT:"Como chegar na loja",allT:"Todos os produtos",moreB:"Ver mais",allB:"Ver todos os produtos",menuT:"Menu",kfT:"Fale com a gente",bcH:"Início",fltT:"Filtros",fltC:"Limpar",fltS:"Mostrar filtros",fltH:"Ocultar filtros",srtT:"Ordenar por",railM:"Ver todas",railL:"Ver menos",fltP:"Preço (R$)",fltR:"Avaliação",fltO:"Outros",fltA:"Todas",flt4:"4 estrelas ou mais",flt3:"3 estrelas ou mais",fltN:"Novidades e lançamentos",fltV:"Mais vendidos",cartT:"Carrinho de orçamento",cartS:"Carrinho",cartAdd:"Adicionar ao carrinho",cartAddS:"+ Carrinho",cartBoxT:"Quer orçar vários produtos?",cartBoxD:"Escolha a quantidade, adicione ao carrinho e, no fim, envie a lista inteira de uma vez pelo WhatsApp.",cartObs:"Observação (ex.: medida, cor)",cartGo:"Ver carrinho",cartOk:"Adicionado ao carrinho",cartEmpty:"Seu carrinho está vazio.",cartEmptyD:"Escolha os produtos, defina a quantidade e toque em “Adicionar ao carrinho”.",cartMore:"Adicionar mais produtos",cartName:"Seu nome (opcional)",cartSend:"Solicitar orçamento via WhatsApp",cartNote:"A lista vai para o WhatsApp da loja com nome, código e quantidade de cada produto. A loja responde com valores e disponibilidade.",cartCopy:"Copiar lista",cartClr:"Limpar carrinho",cartClrQ:"Toque de novo para limpar",cartRm:"Remover"};
var TX=[["brand","Nome da loja (topo da página)"],["navProd","Menu: produtos"],["navCont","Menu: contato"],["call","Botão de ligar"],["bnBtn","Botão dos destaques"],["brandsT","Título: marcas"],["catsT","Título: categorias"],["featT","Título: mais vendidos"],["prodT","Título: lista de produtos"],["ph","Texto da busca"],["contT","Título do contato"],["contP","Frase do contato"],["foot","Texto do rodapé"],["quote","Botão de orçamento (nos cards de produto sem preço)"],["order","Botão de pedido (nos cards de produto com preço)"],["quoteB","Botão de orçamento (página do produto sem preço)"],["orderB","Botão de pedido (página do produto com preço)"],["noP","Texto quando não há preço"],["cash","Texto abaixo do preço (à vista)"],["boxP","Frase na caixa de preço"],["descT","Título: descrição"],["specT","Título: ficha técnica"],["moreT","Título: mais sobre o produto"],["simT","Título: produtos similares"],["cmpL","Botão de comparar (nos cards)"],["cmpOn","Botão de comparar, quando já escolhido"],["cmpB","Botão de comparar (página do produto)"],["cmpBon","Botão de comparar (página do produto), quando já escolhido"],["cmpPg","Título da página de comparação (e item do menu)"],["allT","Botão: todos os produtos (início e menu)"],["moreB","Botão: ver mais (mais vendidos)"],["allB","Botão: ver todos os produtos (mais vendidos)"],["menuT","Menu do celular: título"],["kcat","Título: categorias (menu e rodapé)"],["kfT","Menu do celular: fale com a gente"],["fInst","Rodapé: título Institucional"],["fAt","Rodapé: título Atendimento"],["fSoc","Rodapé: título das redes"],["fSt","Rodapé: título das lojas"],["routeT","Rodapé: texto de como chegar"],["bcH","Caminho no topo das páginas: Início"],["fltT","Lista de produtos: título dos filtros"],["fltC","Filtros: botão limpar"],["fltS","Lista de produtos: botão mostrar filtros"],["fltH","Lista de produtos: botão ocultar filtros"],["srtT","Lista de produtos: ordenar por"],["railM","Categorias: botão ver todas"],["railL","Categorias: botão ver menos"],["fltP","Filtros: título do preço"],["fltR","Filtros: título da avaliação"],["fltO","Filtros: título de outros"],["fltA","Filtros: avaliação todas"],["flt4","Filtros: 4 estrelas"],["flt3","Filtros: 3 estrelas"],["fltN","Filtros: lançamentos"],["fltV","Filtros: mais vendidos"],["cartT","Carrinho: título da página"],["cartS","Carrinho: nome ao lado do ícone no topo"],["cartAdd","Carrinho: botão adicionar"],["cartAddS","Carrinho: botão adicionar (celular, nos cards)"],["cartBoxT","Carrinho: título do quadro no produto"],["cartBoxD","Carrinho: explicação do quadro no produto"],["cartObs","Carrinho: texto do campo de observação"],["cartGo","Carrinho: botão ver carrinho"],["cartOk","Carrinho: aviso ao adicionar"],["cartEmpty","Carrinho: título quando vazio"],["cartEmptyD","Carrinho: explicação quando vazio"],["cartMore","Carrinho: botão adicionar mais produtos"],["cartName","Carrinho: campo do nome"],["cartSend","Carrinho: botão enviar pelo WhatsApp"],["cartNote","Carrinho: explicação abaixo do botão"],["cartCopy","Carrinho: botão copiar lista"],["cartClr","Carrinho: botão limpar"],["cartClrQ","Carrinho: confirmação de limpar"],["cartRm","Carrinho: botão remover item"]];
function tv(k){var v=S.s&&S.s.tx&&S.s.tx[k];return v==null?DT[k]:v}
function T(k){return esc(tv(k))}
function brandH(){var b=String(tv("brand")).trim(),i=b.indexOf(" ");return i<0?esc(b):esc(b.slice(0,i))+" <span>"+esc(b.slice(i+1))+"</span>"}
var LC=null;
function lrow(v){var h='<div class="lr" data-i="'+(v._i==null?-1:v._i)+'">';LC.fields.forEach(function(x){h+='<label>'+esc(x.l)+'</label>';var val=v[x.k]==null?"":v[x.k];
  if(x.t==="area")h+='<textarea data-k="'+x.k+'" rows="2">'+esc(val)+'</textarea>';
  else if(x.t==="select")h+='<select data-k="'+x.k+'">'+x.o.map(function(o){return'<option value="'+esc(o[0])+'"'+(o[0]===val?" selected":"")+'>'+esc(o[1])+'</option>'}).join("")+'</select>';
  else if(x.t==="icon")h+='<div class="ipk"><input type="hidden" data-k="'+x.k+'" value="'+esc(val)+'"><button type="button" class="ipb cur" data-act="ip">'+iconSvg(val)+'<span>Escolher ícone</span></button><div class="ipp" hidden></div></div>';
  else if(x.t==="file")h+='<input type="file" accept="image/*" data-k="'+x.k+'">';
  else h+='<input data-k="'+x.k+'" value="'+esc(val)+'">'});
  return h+'<div class="lrb"><button type="button" class="btn dark sm" data-act="lu">Subir</button><button type="button" class="btn dark sm" data-act="ld">Descer</button><button type="button" class="btn sm" data-act="lx">Remover</button></div></div>'}
function openList(title,fields,items,blank,onSave,note,max){
  var f=$("f");f.keep=false;LC={fields:fields,items:items,blank:blank,max:max||30};
  f.innerHTML='<h3>'+esc(title)+'</h3>'+(note?'<p class="note">'+esc(note)+'</p>':'')+'<div id="lrs">'+items.map(function(it,i){var v=Object.assign({},it);v._i=i;return lrow(v)}).join("")+'</div><button type="button" class="btn dark sm" data-act="la" style="margin-top:12px">+ Adicionar</button><p id="err" class="err" role="alert"></p><div class="row"><button type="button" class="btn dark" data-act="x">Cancelar</button><button type="submit" class="btn">Salvar</button></div>';
  f.onsubmit=async function(e){
    e.preventDefault();var out=[];
    Array.prototype.forEach.call(f.querySelectorAll(".lr"),function(r){var v={};Array.prototype.forEach.call(r.querySelectorAll("[data-k]"),function(el){v[el.getAttribute("data-k")]=el.type==="file"?Array.prototype.slice.call(el.files):el.value.trim()});var i=Number(r.getAttribute("data-i"));out.push({v:v,orig:i>=0?LC.items[i]:null})});
    try{var er=await onSave(out);if(er){$("err").textContent=er;return}}catch(x){$("err").textContent="Não foi possível salvar. Tente de novo.";return}
    $("dlg").close();dirty=true;render();
  };
  $("dlg").showModal();
  if(LFOCUS>=0){var fr=f.querySelector('.lr[data-i="'+LFOCUS+'"]');if(fr){fr.classList.add("hl");fr.scrollIntoView({block:"center"});var fi=fr.querySelector("input:not([type=hidden])");if(fi)fi.focus()}}
  LFOCUS=-1;
}
function banForm(){
  var dest=[["","Todos os produtos"]].concat(S.cats.map(function(c){return[c.id,c.n]}));
  openList("Destaques da página inicial",[{k:"t",l:"Título"},{k:"d",l:"Frase de apoio",t:"area"},{k:"l",l:"Ao clicar, mostrar",t:"select",o:dest},{k:"r",l:"Imagem de fundo atual",t:"select",o:[["","Manter"],["1","Remover"]]},{k:"i",l:"Nova imagem de fundo (opcional, foto larga)",t:"file"}],S.banners||[],{t:"",d:"",l:"",r:""},async function(rows){
    var out=[];
    for(var j=0;j<rows.length;j++){var v=rows[j].v,o=rows[j].orig||{};if(!v.t)continue;var img=o.img||"";if(v.r==="1")img="";if(v.i&&v.i.length){if(!assets)return"Envio de imagens indisponível.";var r=await assets.upload(v.i[0]);img=r.id}out.push({t:v.t,d:v.d,l:v.l,img:img})}
    bi=0;S.banners=out;
  },"Adicione, remova e reordene. Sem nenhum destaque, o banner não aparece.",12);
}
function cbForm(fid,ins){
  var its=cbList().map(function(b){var dl=cbDefL(b.t),own=b.l&&String(b.l).trim();return{id:b.id,t:b.t,l:own||dl||"",sb:b.sb==null?cbDefB(b.t):b.sb,u:b.u||""}});
  if(ins){var ix=its.map(function(b){return b.id}).indexOf(ins.ref);ix=ix<0?its.length:ix+1;its.splice(ix,0,{id:"",t:"ln",l:"Novo botão",sb:"",u:""});LFOCUS=ix}
  else LFOCUS=its.map(function(b){return b.id}).indexOf(fid);
  openList("Botões de contato",[{k:"t",l:"Tipo do botão (define a cor e o ícone)",t:"select",o:Object.keys(CBT).map(function(k){return[k,CBT[k].n]})},{k:"l",l:"Texto do botão"},{k:"sb",l:"Texto pequeno embaixo (opcional)"},{k:"u",l:"Link ou número (vazio = automático, usa os dados de “Textos e contato”)"}],its,{t:"ln",l:"Novo botão",sb:"",u:""},function(rows){
    var out=[],i;
    for(i=0;i<rows.length;i++){var v=rows[i].v,o=rows[i].orig||{},ty=v.t||"ln";
      if(ty==="ln"&&!v.u)return"O botão “"+(v.l||"novo")+"” é do tipo “Outro link”: cole o link dele (https://...).";
      var u=String(v.u||"").trim();if(u&&!/^[\d\s()+\-]+$/.test(u)&&!(ty==="ml"&&u.indexOf("@")>0&&u.indexOf(":")<0)&&!safeUrl(u))return"O link do botão “"+(v.l||ty)+"” precisa começar com https://, tel: ou mailto:.";
      out.push({id:o.id||uid(),t:ty,l:(!v.l||v.l===cbDefL(ty))?"":v.l,sb:(v.sb===cbDefB(ty))?null:v.sb,u:u})}
    S.s.cb=out;
  },"Adicione, remova, reordene e mude o texto e o link de cada botão. Eles aparecem no contato do site e no menu do celular. Sem nenhum botão, a área de contato fica vazia.",14);
}
function cbDel(id){
  var b=cbList().filter(function(x){return x.id===id})[0];if(!b)return;
  var r=cbRes(b);
  openForm("Remover botão",[],"Remover",function(){S.s.cb=cbList().filter(function(x){return x.id!==id})},"Remover o botão “"+((r&&r.t)||cbDefL(b.t)||(CBT[b.t]||CBT.ln).n)+"”? Você pode adicionar de novo depois.");
}
function cbReset(){openForm("Restaurar botões",[],"Restaurar",function(){delete S.s.cb},"Voltar aos botões padrão (WhatsApp, Ligar, Instagram, Facebook, E-mail, Google Maps, Waze)? Os botões que você criou ou mudou serão perdidos.")}
var SPF={phone:{l:"Telefone"},wa:{l:"WhatsApp (só números com DDD). Vazio = os botões de WhatsApp usam o telefone da loja"},insta:{l:"Instagram (sem @)"},email:{l:"E-mail da loja"},addr:{l:"Endereço da loja"},maps:{l:"Link do Google Maps para o “Como chegar” (vazio = o site monta pelo endereço)",u:1},waze:{l:"Link do Waze para o “Como chegar” (vazio = o site monta pelas coordenadas ou pelo endereço)",u:1},geo:{l:"Coordenadas da loja para o Waze: latitude,longitude (ex.: -8.054911,-48.4828062)"},hours:{l:"Horário de atendimento (opcional)"},fb:{l:"Link do Facebook (https://...)",f:1,u:1},yt:{l:"Link do YouTube (opcional)",f:1,u:1},tt:{l:"Link do TikTok (opcional)",f:1,u:1}};
function spGet(k){var d=SPF[k];return d.f?((S.f&&S.f[k])||""):(S.s[k]||"")}
function setPart(title,keys){
  openForm(title,keys.map(function(k){return{k:k,l:SPF[k].l,v:spGet(k)}}),"Salvar",function(v){
    if(keys.indexOf("phone")>=0&&!String(v.phone||"").replace(/\D/g,""))return"Informe um telefone válido.";
    keys.forEach(function(k){var d=SPF[k],x=v[k];if(d.u)x=safeUrl(x);if(k==="insta")x=String(x).replace(/^@+/,"");if(d.f){S.f=S.f||{};S.f[k]=x}else S.s[k]=x});
  },"A mudança vale para o site todo: botões, rodapé, menu e mensagens do WhatsApp.");
}
function setForm(){
  var s=S.s,tx=s.tx||{},fl=[
    {k:"phone",l:"Telefone",v:s.phone},{k:"wa",l:"WhatsApp (só números com DDD). Vazio = os botões de WhatsApp usam o telefone da loja",v:s.wa||""},{k:"insta",l:"Instagram (sem @)",v:s.insta},{k:"email",l:"E-mail da loja",v:s.email||""},{k:"addr",l:"Endereço da loja (usado no botão “Como chegar”)",v:s.addr},{k:"maps",l:"Link do Google Maps para o “Como chegar” (opcional; vazio = o site monta pelo endereço)",v:s.maps||""},{k:"grev",l:"Link para avaliar a loja no Google (opcional; vazio = usa o link do Google Maps)",v:s.grev||""},{k:"waze",l:"Link do Waze para o “Como chegar” (opcional; vazio = o site monta pelas coordenadas ou pelo endereço)",v:s.waze||""},{k:"geo",l:"Coordenadas da loja para o Waze: latitude,longitude (ex.: -8.054911,-48.4828062)",v:s.geo||""},{k:"fb",l:"Link do Facebook (https://...)",v:(S.f&&S.f.fb)||""},{k:"hours",l:"Horário de atendimento (opcional)",v:s.hours},
    {k:"url",l:"Endereço do site (vai no link da mensagem do WhatsApp), ex.: https://seusite.com.br",v:s.url||""},{k:"wm",l:"Mensagem do orçamento no WhatsApp, para produtos sem preço (uma linha por linha; use {produto}, {descricao}, {codigo}, {marca}, {preco}, {link})",t:"area",v:s.wm||WM_DEFAULT},{k:"wmo",l:"Mensagem do pedido no WhatsApp, para produtos com preço (mesmos campos)",t:"area",v:s.wmo||WM_ORDER},{k:"hdr",l:"Estilo do topo do site",t:"select",v:hdrStyle(),o:[["blue","Azul (logo em branco)"],["white","Branco com linha amarela (logo colorida)"],["white2","Branco com faixa azul no alto e linha amarela"],["white3","Branco limpo com sombra suave"]]},{k:"bgm",l:"Fundo do site",t:"select",v:(S.s.bgm==="light"||S.s.bgm==="dark")?S.s.bgm:"auto",o:[["auto","Automático (segue o modo claro/escuro do aparelho do cliente)"],["light","Sempre claro"],["dark","Sempre escuro"]]},{k:"color",l:"Cor de destaque (amarelo da logo)",t:"select",v:cv(s.color,"#ffc20e",YL),o:YL},{k:"colorHex",l:"Cor de destaque personalizada (opcional, ex.: #ffc20e)",v:cx(s.color,YL)},{k:"blue",l:"Cor principal (azul da logo)",t:"select",v:cv(s.blue,"#1d3f94",BL),o:BL},{k:"blueHex",l:"Azul personalizado (opcional, ex.: #1d3f94)",v:cx(s.blue,BL)},
    {k:"feat",l:"Mostrar “Mais vendidos” na página inicial",t:"select",v:s.feat==="0"?"0":"1",o:[["1","Sim"],["0","Não"]]}];
  if(assets){fl.push({k:"lgh",l:"Logo horizontal (topo e rodapé): PNG com fundo transparente, versão para fundo azul",t:"file",a:"image/png,image/webp,image/svg+xml"},{k:"lgi",l:"Ícone quadrado (celular): PNG com fundo transparente, versão para fundo azul",t:"file",a:"image/png,image/webp,image/svg+xml"},{k:"lgm",l:"Logo horizontal colorida (topo branco): PNG transparente, versão para fundo claro",t:"file",a:"image/png,image/webp,image/svg+xml"},{k:"lgn",l:"Ícone colorido (topo branco, celular): PNG transparente, versão para fundo claro",t:"file",a:"image/png,image/webp,image/svg+xml"},{k:"lgr",l:"Logos atuais",t:"select",v:"",o:[["","Manter"],["1","Remover (voltar ao nome em texto)"]]})}
  TX.forEach(function(x){fl.push({k:"tx_"+x[0],l:x[1],v:tx[x[0]]==null?DT[x[0]]:tx[x[0]]})});
  openForm("Textos e contato",fl,"Salvar",async function(v){
    if(!v.phone.replace(/\D/g,""))return"Informe um telefone válido.";
    ["phone","wa","insta","email","addr","hours"].forEach(function(k){S.s[k]=v[k]});S.s.maps=safeUrl(v.maps);S.s.grev=safeUrl(v.grev);S.s.waze=safeUrl(v.waze);S.s.geo=v.geo;S.f=S.f||{};S.f.fb=safeUrl(v.fb);S.s.color=hx(v.colorHex)||v.color;S.s.blue=hx(v.blueHex)||v.blue;
    S.s.hdr=v.hdr;S.s.bgm=(v.bgm==="light"||v.bgm==="dark")?v.bgm:"";S.s.url=v.url;S.s.wm=(v.wm&&v.wm!==WM_DEFAULT)?v.wm:"";S.s.wmo=(v.wmo&&v.wmo!==WM_ORDER)?v.wmo:"";S.s.lg=S.s.lg||{};if(v.lgr==="1")S.s.lg={};
    if(v.lgh&&v.lgh.length){var r1=await assets.upload(v.lgh[0]);S.s.lg.h=r1.id}
    if(v.lgi&&v.lgi.length){var r2=await assets.upload(v.lgi[0]);S.s.lg.i=r2.id}
    if(v.lgm&&v.lgm.length){var r3=await assets.upload(v.lgm[0]);S.s.lg.hm=r3.id}
    if(v.lgn&&v.lgn.length){var r4=await assets.upload(v.lgn[0]);S.s.lg.im=r4.id}
    S.s.feat=v.feat;S.s.tx={};TX.forEach(function(x){S.s.tx[x[0]]=v["tx_"+x[0]]});
  },"Apague o texto de um campo para escondê-lo.");
}
if(!S.f)S.f={links:[{t:"Início",u:"#inicio"},{t:"Produtos",u:"#produtos"},{t:"Fale conosco",u:"#contato"}],stores:[{n:"Ronaldo Parafusos",ph:S.s.phone,ad:S.s.addr||"",map:""}],sac:"",fb:"",yt:"",tt:"",cnpj:"",note:""};
if(!S.v)S.v={t:"",video:"",cols:[]};
function safeUrl(u){u=String(u||"").trim();return /^(https?:\/\/|mailto:|tel:|#)/i.test(u)?u:""}
function ext(u){return /^https?:/i.test(u)?' target="_blank" rel="noopener"':""}
var BST;function bindSearch(){
  var q=$("hq");if(!q)return;
  function show(){
    var t=norm(q.value.trim()),box=$("sr");term=q.value;
    if(pg==="search"){LN=48;listUpd()}
    if(!t){box.hidden=true;box.innerHTML="";return}
    var r=S.prods.filter(function(p){return qm(qhx(p),t)}).map(function(p,i){return{p:p,s:qsc(qhx(p),t),i:i}}).sort(function(a,b){return b.s-a.s||((b.p.img?1:0)-(a.p.img?1:0))||a.i-b.i}).map(function(o){return o.p}),mx=window.innerWidth<=760?8:6;
    var r2=(r.length<mx&&typeof srDesc==="function")?S.prods.filter(function(p){return r.indexOf(p)<0&&srDesc(p,t)}):[];
    function siH(p){var c=catOf(p.c);return'<a class="si" href="'+esc(pHref(p))+'"><b>'+nmH(p)+'</b><span>'+esc(c?c.n:"")+'</span></a>'}
    var h=sgH(t)+r.slice(0,mx).map(siH).join("");
    if(r2.length)h+='<div class="si sih">'+(r.length?'Também citam “'+esc(q.value.trim())+'” na descrição:':'Nenhum produto com esse nome. Estes citam “'+esc(q.value.trim())+'” na descrição:')+'</div>'+r2.slice(0,Math.max(3,mx-r.length)).map(siH).join("");
    var tot=r.length>=12?r.length:r.length+r2.length;
    var r3=[];if(!r.length&&!r2.length){QPT=1;r3=S.prods.filter(function(p){return qm(qhx(p),t)});QPT=0;tot=r3.length;if(r3.length)h='<div class="si sih">Não achamos tudo o que você digitou. Veja itens parecidos:</div>'+r3.slice(0,mx).map(siH).join("")}
    if(!r.length&&!r2.length){clearTimeout(BST);BST=setTimeout(function(){bsLog(q.value)},1500)}
    if(!r.length&&!r2.length&&!r3.length)h=sgH(t)+'<div class="si">Nenhum produto encontrado. Tente outra palavra ou <a href="'+tel()+'">ligue para a loja</a>.</div>';
    else h+='<button class="si all" type="button" data-act="sa">Ver todos os resultados ('+tot+')</button>';
    h+=waAskH(q.value);box.innerHTML=h;box.hidden=false;
  }
  var qtm;q.addEventListener("input",function(){clearTimeout(qtm);qtm=setTimeout(show,90)});
  q.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();term=q.value;if(term.trim())go("#busca")}else if(e.key==="Escape"){$("sr").hidden=true}});
  q.addEventListener("focus",function(){if(q.value.trim())show()});
}
function routeBox(){var m=mapUrl(),w=wazeUrl();if(!m&&!w)return"";return'<div class="ftrt" data-ed="s:addr"><span>'+T("routeT")+'</span>'+(m?'<a class="ftmap" href="'+esc(m)+'" target="_blank" rel="noopener">'+IC.mp+'Google Maps</a>':"")+(w?'<a class="ftmap ftwz" href="'+esc(w)+'" target="_blank" rel="noopener">'+IC.wz+'Waze</a>':"")+'</div>'}
function footer(){
  var s=S.s,f=S.f||{},L=f.links||[],st=f.stores||[],h='<footer class="ft ft2"><div class="wrap">'+footLogo()+'<div class="fg">';
  var waN=(typeof waFabNum==="function"?waFabNum():waNum()),waT=s.wa?esc(s.wa):esc(fmtPhone(waN)),hrs=s.hours||"Segunda a sexta, 7h às 18h · Sábado, 7h às 12h";
  function ci(ic,lbl,val,ed){return'<li'+(ed?' data-ed="'+ed+'"':'')+'><span class="fci">'+ic+'</span><span><small>'+lbl+'</small>'+val+'</span></li>'}
  h+='<div><h4>'+T("fInst")+'</h4><div data-ed="foot:links">'+L.map(function(l){var u=safeUrl(l.u);return u?'<a href="'+esc(u)+'"'+ext(u)+'>'+esc(l.t)+'</a>':'<p>'+esc(l.t)+'</p>'}).join("")+'</div>';
  var so='<a class="ig" href="https://www.instagram.com/'+esc(s.insta)+'/" target="_blank" rel="noopener">'+IC.ig+'Instagram</a>';
  [["fb","Facebook"],["yt","YouTube"],["tt","TikTok"]].forEach(function(x){var u=safeUrl(f[x[0]]);if(u)so+='<a class="'+x[0]+'" href="'+esc(u)+'" target="_blank" rel="noopener">'+(x[0]==="fb"?IC.fb:"")+x[1]+'</a>'});
  h+='<h4 class="fsub">'+T("fSoc")+'</h4><div class="soc" data-ed="s:insta">'+so+'</div></div>';
  h+='<div><h4>'+T("fAt")+'</h4><ul class="fct">'+(typeof fNums==="function"?fNums().map(function(x){return ci(x.ic,x.l,'<a href="tel:+55'+x.d+'">'+esc(x.t)+'</a><span class="fwa"><a class="fwc" href="tel:+55'+x.d+'">'+IC.tel+'Ligar</a><a class="fwc fww" href="https://wa.me/55'+x.d+'" target="_blank" rel="noopener">'+IC.wa+'WhatsApp</a></span>',"s:phone")}).join(""):"")+(s.email?ci(IC.ml,"E-mail",'<a href="mailto:'+esc(s.email)+'">'+esc(s.email)+'</a>',"s:email"):"")+(f.sac?ci(IC.ml,"SAC",'<a href="mailto:'+esc(f.sac)+'">'+esc(f.sac)+'</a>'):"")+ci('<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',"Horário",(typeof hrsH==="function"&&!s.hours)?hrsH():(mapUrl()?'<a class="adrl" href="'+esc(mapUrl())+'" target="_blank" rel="noopener" title="Ver horários e feriados no Google">'+esc(hrs)+'</a><span class="fgh">Ver horários e feriados no Google ›</span>':esc(hrs)),"s:hours")+'</ul></div>';
  h+='<div><h4>Onde estamos</h4><ul class="fct">'+(s.addr?ci(IC.mp,"Endereço",(mapUrl()?'<a class="adrl" href="'+esc(mapUrl())+'" target="_blank" rel="noopener" title="Abrir no mapa">'+esc(s.addr)+'</a>':esc(s.addr)),"s:addr"):"")+'</ul>'+routeBox()+'<p class="fcnpj">'+esc(String(tv("brand")))+(f.cnpj?'<br>CNPJ: '+esc(f.cnpj):'')+'</p></div>';
  h+='</div><div class="fcats"><h4>'+T("kcat")+'</h4><div class="fcl">'+vcats().map(function(c){return'<button class="fl" type="button" data-act="gc" data-id="'+esc(c.id)+'">'+esc(c.n)+'</button>'}).join("")+'</div></div>';
  if(st.length)h+='<div class="stores" data-ed="foot:stores"><h4>'+T("fSt")+'</h4><div class="sg">'+st.map(function(x){var m=safeUrl(x.map);return'<div><b>'+esc(x.n)+'</b>'+(x.ph?'<p><a style="display:inline" href="tel:+55'+esc(x.ph.replace(/\D/g,""))+'">'+esc(x.ph)+'</a></p>':'')+(x.ad?'<p><a style="display:inline" href="'+esc(m||mapUrl()||("https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(x.ad)))+'" target="_blank" rel="noopener">'+esc(x.ad)+'</a></p>':'')+(m?'<a href="'+esc(m)+'" target="_blank" rel="noopener">Ver mapa</a>':'')+'</div>'}).join("")+'</div></div>';
  h+=(typeof bibFoot==="function"?bibFoot():"");h+=(typeof legalFoot==="function"?legalFoot():"");
  h+='<p class="leg" data-ed="foot:legal"><span>'+T("foot")+'</span>'+(f.cnpj?' CNPJ: '+esc(f.cnpj):'')+'</p>'+(f.note?'<p class="leg" data-ed="foot:legal" style="margin-top:8px;border:0;padding:0">'+esc(f.note)+'</p>':'');
  return h+'</div></footer>';
}
function videoSec(){
  var v=S.v||{},cols=(v.cols||[]).filter(function(c){return c.t||c.p}),has=v.video||v.link||cols.length||v.t;
  if(!has)return(canEdit&&edit)?'<section style="padding:16px 0"><div class="wrap"><div class="vph" data-ed="vid">Seção de vídeo da empresa: fica oculta para os clientes até você preencher. Clique em “Vídeo e sobre” na barra de edição.</div></div></section>':"";
  var rm=!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  return'<section style="padding:16px 0"><div class="wrap"><div class="vid" data-ed="vid">'+((v.link&&typeof vidFac==="function"&&vidFac(v.link))?vidFac(v.link):v.video?'<video src="'+esc(rpImg(v.video))+'" muted loop playsinline preload="metadata"'+(rm?" controls":" autoplay")+'></video>'+(rm?"":'<button class="btn sm vp" type="button" data-act="vt">Pausar vídeo</button>'):"")+'<h2>'+esc(v.t||"")+'</h2><div class="vcols">'+cols.map(function(c){return'<div><h3>'+esc(c.t)+'</h3><p>'+esc(c.p)+'</p></div>'}).join("")+'</div></div></div></section>';
}
function videoForm(){
  var v=S.v||{cols:[]},fl=[{k:"t",l:"Título da seção",v:v.t||""},{k:"vl",l:"Link do vídeo no YouTube ou no Instagram (recomendado: não gasta o plano grátis)",v:v.link||""}],i;
  if(assets){if(v.video)fl.push({k:"rm",l:"Vídeo atual",t:"select",v:"",o:[["","Manter"],["1","Remover"]]});fl.push({k:"vf",l:"Ou envie o arquivo do vídeo (MP4 ou WebM, até 20 MB). Atenção: gasta o tráfego do plano grátis a cada visita",t:"file",a:"video/mp4,video/webm"})}
  for(i=0;i<4;i++){var c=(v.cols||[])[i]||{t:"",p:""};fl.push({k:"ct"+i,l:"Bloco "+(i+1)+": título",v:c.t},{k:"cp"+i,l:"Bloco "+(i+1)+": texto",t:"area",v:c.p})}
  openForm("Vídeo e sobre a empresa",fl,"Salvar",async function(x){
    var video=v.video||"";if(x.rm==="1")video="";
    if(x.vf&&x.vf.length){var f=x.vf[0];if(f.size>20*1024*1024)return"O vídeo passa de 20 MB. Comprima o vídeo e tente de novo.";var r=await assets.upload(f);video=r.id}
    var cols=[],j;for(j=0;j<4;j++)cols.push({t:x["ct"+j]||"",p:x["cp"+j]||""});
    if(x.vl&&typeof vidEmb==="function"&&!vidEmb(x.vl))return"Não reconheci o link. Cole o link de um vídeo do YouTube (youtube.com ou youtu.be) ou de um post/reels do Instagram.";
    S.v={t:x.t,video:video,cols:cols,link:x.vl||""};
  },"Melhor jeito: poste o vídeo no YouTube ou no Instagram e cole o link aqui. O vídeo só carrega quando o cliente toca para assistir, sem gastar o plano grátis. Se colocar link e arquivo, vale o link. Sem vídeo, a seção mostra só os textos.");
}
function footForm(){
  var f=S.f||{};
  openForm("Rodapé",[{k:"sac",l:"E-mail do SAC (opcional)",v:f.sac||""},{k:"fb",l:"Link do Facebook (opcional)",v:f.fb||""},{k:"yt",l:"Link do YouTube (opcional)",v:f.yt||""},{k:"tt",l:"Link do TikTok (opcional)",v:f.tt||""},{k:"cnpj",l:"CNPJ (opcional)",v:f.cnpj||""},{k:"note",l:"Aviso legal (opcional)",t:"area",v:f.note||""}],"Salvar",function(v){
    S.f=S.f||{};["sac","fb","yt","tt","cnpj","note"].forEach(function(k){S.f[k]=v[k]});
    ["fb","yt","tt"].forEach(function(k){S.f[k]=safeUrl(S.f[k])});
  },"Telefone, WhatsApp, horário, e-mail e o texto de copyright são editados em “Textos e contato”. Os links precisam começar com https://");
}
function linksForm(){
  openList("Links do rodapé",[{k:"t",l:"Texto"},{k:"u",l:"Link (#produtos, #contato ou https://...)"}],(S.f&&S.f.links)||[],{t:"",u:""},function(rows){
    S.f=S.f||{};S.f.links=rows.filter(function(r){return r.v.t}).map(function(r){return{t:r.v.t,u:safeUrl(r.v.u)}});
  },"Aparecem na coluna Institucional. Sem link, o texto aparece sem clique.",12);
}
function storesForm(){
  openList("Nossas lojas",[{k:"n",l:"Nome da loja"},{k:"ph",l:"Telefone"},{k:"ad",l:"Endereço",t:"area"},{k:"map",l:"Link do mapa (Google Maps)"}],(S.f&&S.f.stores)||[],{n:"",ph:"",ad:"",map:""},function(rows){
    S.f=S.f||{};S.f.stores=rows.filter(function(r){return r.v.n}).map(function(r){return{n:r.v.n,ph:r.v.ph,ad:r.v.ad,map:safeUrl(r.v.map)}});
  },"Adicione, remova e reordene as lojas.",10);
}
S.brands=(S.brands||[]).map(function(b){return typeof b==="string"?{n:b,img:""}:b});
var YL=[["#ffc20e","Amarelo"],["#ff9f1c","Laranja"],["#7ed957","Verde"],["#5bc0eb","Azul claro"],["#ff7a6b","Vermelho claro"]],BL=[["#1d3f94","Azul royal"],["#14295f","Azul marinho"],["#1f5fbf","Azul médio"],["#23272b","Grafite (como antes)"]];
function inL(c,L){return L.some(function(o){return o[0]===c})}
function cv(c,d,L){return c&&inL(c,L)?c:d}
function cx(c,L){return c&&!inL(c,L)?c:""}
function hx(s){s=String(s||"").trim();return /^#[0-9a-f]{6}$/i.test(s)?s:""}
function dk(h,f){var n=parseInt(h.slice(1),16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;return"rgb("+Math.round(r*f)+","+Math.round(g*f)+","+Math.round(b*f)+")"}
function theme(){var st=document.documentElement.style,bl=hx(S.s.blue)||"#1d3f94";st.setProperty("--y",hx(S.s.color)||"#ffc20e");st.setProperty("--steel",bl);st.setProperty("--steel2",dk(bl,.55));if(document.body&&document.body.classList)document.body.classList.toggle("hdw",hdrStyle()!=="blue");var bm=S.s.bgm,de=document.documentElement;if(bm==="light"||bm==="dark")de.setAttribute("data-theme",bm);else de.removeAttribute("data-theme")}
function brandOpts(cur){var o=[["","Sem marca"]],ns=(S.brands||[]).map(function(b){return b.n});ns.forEach(function(n){o.push([n,n])});if(cur&&ns.indexOf(cur)<0)o.push([cur,cur]);return o}
function brandForm(fname,ins){
  var its=(S.brands||[]).slice();
  if(ins){var ix=its.map(function(b){return b.n}).indexOf(ins.ref);ix=ix<0?its.length:(ins.where==="before"?ix:ix+1);var src=ins.dup?its.filter(function(b){return b.n===ins.dup})[0]:null;its.splice(ix,0,src?{n:src.n+" (cópia)",img:src.img||""}:{n:"",img:""});LFOCUS=ix}
  else LFOCUS=its.map(function(b){return b.n}).indexOf(fname);
  openList("Marcas",[{k:"n",l:"Nome da marca (usado nos produtos)"},{k:"r",l:"Logo atual",t:"select",o:[["","Manter"],["1","Remover"]]},{k:"i",l:"Enviar logo (PNG, JPG ou WebP)",t:"file"}],its,{n:"",r:""},async function(rows){
    var out=[],ren={},j;
    for(j=0;j<rows.length;j++){var v=rows[j].v,o=rows[j].orig;if(!v.n)continue;var img=o?(o.img||""):"";if(v.r==="1")img="";if(v.i&&v.i.length){if(!assets)return"Envio de imagens indisponível.";var r=await assets.upload(v.i[0]);img=r.id}
      if(o&&o.n!==v.n)ren[o.n]=v.n;out.push({n:v.n,img:img})}
    S.prods.forEach(function(p){if(p.brand&&ren[p.brand])p.brand=ren[p.brand]});
    if(bfil&&ren[bfil])bfil=ren[bfil];F.brands=F.brands.map(function(b){return ren[b]||b});
    S.brands=out.slice(0,3000);
  },"Cada marca pode ter uma logo (logos com fundo claro ficam melhor). Para ligar a marca a um produto, escolha a marca no cadastro do produto. Ao clicar na marca, o cliente vê só os produtos dela.",3000);
}
var ICONS={
parafuso:'<rect x="5" y="4" width="19" height="7" rx="1.5"/><path d="M9 13h11v23l-5.5 9L9 36z"/><path d="M8.5 19l12-3M8.5 25l12-3M8.5 31l12-3" stroke="var(--tbg)" stroke-width="2.2" fill="none"/><path d="M35 20l8.5 5v10L35 40l-8.5-5V25z"/><circle cx="35" cy="30" r="4.4" fill="var(--tbg)"/>',
cadeado:'<rect x="8" y="21" width="32" height="22" rx="3.5"/><path d="M14 21v-6a10 10 0 0 1 20 0v6h-4.5v-6a5.5 5.5 0 0 0-11 0v6z"/><circle cx="24" cy="30" r="3.4" fill="var(--tbg)"/><rect x="22.4" y="31" width="3.2" height="7" rx="1" fill="var(--tbg)"/>',
ferramentas:'<path d="M5 24h38a2 2 0 0 1 2 2v15a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V26a2 2 0 0 1 2-2z"/><path d="M17 24v-4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4h-3.5v-3.5h-7V24z"/><rect x="20.5" y="29" width="7" height="6" rx="1.2" fill="var(--tbg)"/><path d="M8 17l-1-10 3.2-.6 2.2 10.6z"/><path d="M33.5 3.5a6 6 0 0 0-5.3 8.6L24 16.3l3.7 3.7 4.2-4.2a6 6 0 0 0 8.6-5.2l-3.8 2.3-3.1-3.1 2.4-3.8a6 6 0 0 0-2.5-.5z"/>',
furadeira:'<path d="M4 12h25a4 4 0 0 1 4 4v7H4z"/><path d="M12 23h9l-3.5 19H8z"/><rect x="33" y="14" width="7" height="8" rx="1.2"/><rect x="40" y="16.5" width="6" height="3" rx="1"/><rect x="9" y="15.5" width="12" height="3" rx="1.5" fill="var(--tbg)"/>',
engrenagem:'<circle cx="24" cy="24" r="13"/><rect x="21" y="3" width="6" height="10" rx="1.2"/><rect x="21" y="3" width="6" height="10" rx="1.2" transform="rotate(45 24 24)"/><rect x="21" y="3" width="6" height="10" rx="1.2" transform="rotate(90 24 24)"/><rect x="21" y="3" width="6" height="10" rx="1.2" transform="rotate(135 24 24)"/><rect x="21" y="3" width="6" height="10" rx="1.2" transform="rotate(180 24 24)"/><rect x="21" y="3" width="6" height="10" rx="1.2" transform="rotate(225 24 24)"/><rect x="21" y="3" width="6" height="10" rx="1.2" transform="rotate(270 24 24)"/><rect x="21" y="3" width="6" height="10" rx="1.2" transform="rotate(315 24 24)"/><circle cx="24" cy="24" r="5.5" fill="var(--tbg)"/>',
capacete:'<path d="M6 33c0-10.5 7.5-19 18-19s18 8.5 18 19z"/><rect x="3" y="34" width="42" height="5.5" rx="2.2"/><path d="M24 14v19" stroke="var(--tbg)" stroke-width="2.4" fill="none"/><path d="M16 17.5C13 20 11 24 10.5 29" stroke="var(--tbg)" stroke-width="2" fill="none"/>',
motosserra:'<path d="M3 25h17a4 4 0 0 1 4 4v11H3z"/><rect x="7" y="30" width="11" height="5.5" rx="2.7" fill="var(--tbg)"/><path d="M7 25v-6a3.5 3.5 0 0 1 3.5-3.5H20V19h-9v6z"/><rect x="24" y="27" width="21" height="9" rx="4.5"/><path d="M27 27l1.6-3.4L30.2 27l1.6-3.4L33.4 27l1.6-3.4L36.6 27l1.6-3.4L39.8 27l1.6-3.4L43 27z"/>',
tinta:'<path d="M8 20h32l-3.2 23H11.2z"/><rect x="5" y="15" width="38" height="5.5" rx="2"/><path d="M12.5 15a11.5 11.5 0 0 1 23 0h-3.4a8.1 8.1 0 0 0-16.2 0z"/><path d="M13 26h22" stroke="var(--tbg)" stroke-width="2.2" fill="none"/>',
casa:'<path d="M24 4L2.5 23.5H8V43h32V23.5h5.5z"/><rect x="19.5" y="30" width="9" height="13" rx="1" fill="var(--tbg)"/>',
lampada:'<path d="M24 3a14 14 0 0 0-7.8 25.6V34h15.6v-5.4A14 14 0 0 0 24 3z"/><rect x="16.5" y="36" width="15" height="3.6" rx="1.6"/><rect x="19.5" y="41.3" width="9" height="3.6" rx="1.6"/>',
eletrico:'<circle cx="24" cy="24" r="20"/><rect x="15.5" y="12" width="5" height="12" rx="1.2" fill="var(--tbg)"/><rect x="27.5" y="12" width="5" height="12" rx="1.2" fill="var(--tbg)"/><rect x="16.5" y="30" width="15" height="4" rx="2" fill="var(--tbg)"/>',
hidraulico:'<rect x="3" y="27" width="42" height="9.5" rx="1"/><rect x="3" y="23" width="5.5" height="17.5" rx="1.2"/><rect x="39.5" y="23" width="5.5" height="17.5" rx="1.2"/><rect x="21" y="16" width="6" height="11"/><rect x="11" y="9" width="26" height="7" rx="3.5"/>',
agro:'<path d="M9 37C9 19 21 8 41 6c0 20-11 31-27 31z"/><path d="M13 34L35 13" stroke="var(--tbg)" stroke-width="2.4" fill="none"/><path d="M5 43l8-8" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" fill="none"/>',
todos:'<rect x="5" y="5" width="16" height="16" rx="2.5"/><rect x="27" y="5" width="16" height="16" rx="2.5"/><rect x="5" y="27" width="16" height="16" rx="2.5"/><rect x="27" y="27" width="16" height="16" rx="2.5"/>'
};
var ICL=[["","Sem ícone (usar emoji)"],["parafuso","Parafuso e porca"],["cadeado","Cadeado (ferragens)"],["ferramentas","Caixa de ferramentas"],["furadeira","Furadeira"],["engrenagem","Engrenagem (máquinas)"],["capacete","Capacete (segurança)"],["motosserra","Motosserra"],["tinta","Lata de tinta"],["casa","Casa"],["lampada","Lâmpada"],["eletrico","Tomada (elétrica)"],["hidraulico","Tubo e registro"],["agro","Folha (agro)"],["todos","Quadrados"]];
var DI={p:"parafuso",f:"cadeado",t:"ferramentas",e:"furadeira",m:"engrenagem",s:"capacete",mo:"motosserra",ti:"tinta"};
S.cats.forEach(function(c){if(c.ic===undefined)c.ic=DI[c.id]||""});
function catIcon(c){if(c.img)return'<span class="ci"><img src="'+esc(rpImg(c.img))+'" alt=""></span>';if(c.ic&&ICONS[c.ic])return'<svg class="ci" viewBox="0 0 48 48" aria-hidden="true" fill="currentColor">'+ICONS[c.ic]+'</svg>';return'<span class="ci" aria-hidden="true">'+esc(c.i||"🔧")+'</span>'}
function slug(n){return norm(n).replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}
function brandBySlug(s){return(S.brands||[]).filter(function(b){return slug(b.n)===s})[0]}
function cnt(n){return n===1?"1 produto":n+" produtos"}
function qm(x,t,nofz){var c=qprep(x),ts=qtoks(t),k=0;if(!ts.length)return true;ts.forEach(function(w){if(qtok(c,w,!nofz))k++});return QPT?k>=Math.max(1,Math.ceil(ts.length/2)):k===ts.length}var LN=48;
function rvList(p){return(p.rv||[]).filter(function(r){return r&&Number(r.r)>0})}
function rvAvg(p){var a=rvList(p);if(!a.length)return 0;return Math.round(a.reduce(function(s,r){return s+Number(r.r)},0)/a.length*10)/10}
var GREV_DEF="https://search.google.com/local/writereview?placeid=ChIJfRbYfmhZJ5MR5rC_iRDb6g8";
function gUrl(){return safeUrl((S.s&&S.s.grev)||"")||GREV_DEF}
function googleBtn(){var u=gUrl();return u?'<p class="gbtn"><a class="btn dark sm" href="'+esc(u)+'" target="_blank" rel="noopener">★ Avalie a gente no Google</a></p>':""}
var RVS=0;
function rvSec(p){var a=rvList(p),avg=rvAvg(p),h='<div class="sec" id="avaliacoes"><h2>Avaliações dos clientes</h2>';
 if(a.length)h+='<p class="rvs">'+stars(avg)+' <small>('+a.length+(a.length===1?' avaliação':' avaliações')+')</small></p>'+a.map(function(r){return'<div class="rvi"><b>'+esc(r.n||"Cliente")+'</b> '+stars(r.r)+(r.t?'<p>'+esc(r.t)+'</p>':'')+'</div>'}).join("");
 else h+='<p>Este produto ainda não tem avaliações.</p>';
 var gu=gUrl();if(gu)h+='<div class="rvg"><div class="rvgt"><span class="rvgstar" aria-hidden="true">★★★★★</span><b>Comprou com a gente? Avalie a loja no Google</b><span>Leva 1 minuto e ajuda outros clientes a conhecer o '+esc(String(tv("brand")))+'.</span></div><a class="btn rvgb" href="'+esc(gu)+'" target="_blank" rel="noopener"><span class="rvgs" aria-hidden="true">★★★★★</span> Avaliar no Google</a></div>';
 if(waNum()){RVS=0;h+='<details class="rvd"'+(gu?'':' open')+'><summary><span class="rvdi">'+WAI+'</span>Avaliar só este produto pelo WhatsApp</summary><div class="rvf"><p><b>Avaliar este produto</b></p><div class="rvst" role="group" aria-label="Sua nota">'+[1,2,3,4,5].map(function(i){return'<button type="button" class="rvb" data-act="rvs" data-id="'+i+'" aria-label="'+i+(i>1?' estrelas':' estrela')+'">☆</button>'}).join("")+'</div><input id="rvn" type="text" maxlength="40" placeholder="Seu nome"><textarea id="rvt" rows="3" maxlength="400" placeholder="O que você achou do produto?"></textarea><p class="note" id="rvmsg" hidden>Escolha de 1 a 5 estrelas.</p><button class="btn wa" type="button" data-act="rvsend" data-id="'+esc(p.id)+'">'+WAI+' Enviar avaliação pelo WhatsApp</button><p class="note">Sua avaliação vai para a loja pelo WhatsApp e aparece aqui depois de conferida pela loja.</p></div></details>'}
 return h+'</div>'}
function rvSend(id){var p=prodById(id);if(!p)return;var m=$("rvmsg");if(!RVS){if(m)m.hidden=false;return}if(m)m.hidden=true;
 var nm=(($("rvn")||{}).value||"").trim(),tx=(($("rvt")||{}).value||"").trim();
 var msg="Avaliação de produto\nProduto: "+p.n+(p.code?" (cód. "+p.code+")":"")+"\nNota: "+"★".repeat(RVS)+"☆".repeat(5-RVS)+" ("+RVS+" de 5)"+(nm?"\nNome: "+nm:"")+(tx?"\nComentário: "+tx:"")+"\n"+siteBase()+pHref(p);
 var l=document.createElement("a");l.href="https://wa.me/"+waNum()+"?text="+encodeURIComponent(msg);l.target="_blank";l.rel="noopener";document.body.appendChild(l);l.click();l.remove()}
function nmH(p){return esc(p.n)+(p.brand?' <b class="pbr">'+esc(p.brand)+'</b>':"")}function listCards(it){var h="",sd=false;it.slice(0,LN).forEach(function(p){if(!sd&&pg==="search"&&typeof SRI==="object"&&SRI&&SRI.sec[p.id]){sd=true;h+='<p class="srdiv">'+(SRI.n?'Também citam “'+esc(term.trim())+'” na descrição ou na ficha técnica:':'Nenhum produto com “'+esc(term.trim())+'” no nome. Estes citam essa palavra na descrição ou na ficha técnica:')+'</p>'}h+=cardH(p)});if(it.length>LN)h+='<p class="frow" style="grid-column:1/-1;text-align:center"><button class="btn" type="button" data-act="lmore">Ver mais produtos ('+(it.length-LN)+')</button></p>';return h}
function catForm(fid,ins){
  var its=S.cats.slice();
  if(ins){var ix=its.map(function(c){return c.id}).indexOf(ins.ref);ix=ix<0?its.length:(ins.where==="before"?ix:ix+1);var src=ins.dup?S.cats.filter(function(c){return c.id===ins.dup})[0]:null;its.splice(ix,0,src?{n:src.n+" (cópia)",i:src.i,ic:src.ic,img:src.img||""}:{n:"",i:"🔧",ic:"ferramentas",img:""});LFOCUS=ix}
  else LFOCUS=its.map(function(c){return c.id}).indexOf(fid);
  openList("Categorias",[{k:"n",l:"Nome da categoria"},{k:"ic",l:"Ícone",t:"icon"},{k:"r",l:"Imagem própria atual",t:"select",o:[["","Manter"],["1","Remover"]]},{k:"im",l:"Enviar imagem própria do ícone (opcional, PNG)",t:"file"}],its,{i:"🔧",n:"",ic:"ferramentas",r:""},async function(rows){
    var cs=[],keep={},j;
    for(j=0;j<rows.length;j++){var r=rows[j],v=r.v;if(!v.n)continue;var id=(r.orig&&r.orig.id)?r.orig.id:uid(),img=r.orig?(r.orig.img||""):"";if(v.r==="1")img="";if(v.im&&v.im.length){if(!assets)return"Envio de imagens indisponível.";var u=await assets.upload(v.im[0]);img=u.id}keep[id]=1;cs.push({id:id,n:v.n,i:v.i||"🔧",ic:v.ic||"ferramentas",img:img})}
    if(!cs.length)return"Deixe pelo menos uma categoria.";
    S.prods.forEach(function(p){if(!keep[p.c])p.c=""});
    (S.banners||[]).forEach(function(b){if(b.l&&!keep[b.l])b.l=""});
    S.cats=cs;F.cats=F.cats.filter(function(id){return keep[id]});
  },"Adicione, renomeie, troque o ícone, remova e reordene. Produtos de uma categoria removida ficam sem categoria até você editá-los.",40);
}
function railInit(){
  Array.prototype.forEach.call(document.querySelectorAll(".cats,.chips,.bl"),function(t){
    if(t.classList.contains("rt"))return;
    var w=document.createElement("div");w.className="rail";
    w.innerHTML='<div class="rrow"><button class="rb" type="button" data-act="rl" aria-label="Anterior">‹</button><div class="rslot"></div><button class="rb" type="button" data-act="rr" aria-label="Próximo">›</button></div><button class="rx" type="button" data-act="rx"><svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="1" y="1" width="6" height="6" rx="1.6"/><rect x="9" y="1" width="6" height="6" rx="1.6"/><rect x="1" y="9" width="6" height="6" rx="1.6"/><rect x="9" y="9" width="6" height="6" rx="1.6"/></svg><span>'+T("railM")+'</span></button>';
    t.parentNode.insertBefore(w,t);w.querySelector(".rslot").appendChild(t);t.classList.add("rt");
  });
  railFit();
}
function railFit(){
  Array.prototype.forEach.call(document.querySelectorAll(".rail"),function(w){
    var t=w.querySelector(".rt"),slot=w.querySelector(".rslot");if(!t||!slot)return;
    if(w.classList.contains("open")){t.style.width="";t.style.margin="";w.classList.remove("fit");return}
    t.style.width="";t.style.margin="";
    var kids=t.children;if(!kids.length)return;
    var gap=parseFloat(getComputedStyle(t).columnGap)||10,tw=kids[0].offsetWidth,step=tw+gap,avail=slot.clientWidth;
    if(!tw||!avail)return;
    var vis=Math.max(1,Math.floor((avail+gap)/step));
    t.setAttribute("data-step",step);t.setAttribute("data-vis",vis);
    if(kids.length<=vis){w.classList.add("fit");return}
    w.classList.remove("fit");
    t.style.width=(vis*step-gap)+"px";t.style.margin="0 auto";
    t.scrollLeft=Math.round(t.scrollLeft/step)*step;
  });
}
function railGo(rt,dir){
  var st=Number(rt.getAttribute("data-step"))||rt.clientWidth,vis=Number(rt.getAttribute("data-vis"))||1,total=rt.children.length;
  var cur=Math.round(rt.scrollLeft/st),max=Math.max(0,total-vis),next=Math.max(0,Math.min(max,cur+dir*vis));
  rt.scrollTo({left:next*st,behavior:"smooth"});
}
window.addEventListener("resize",railFit);
function newF(){return{cats:[],brands:[],pmin:"",pmax:"",rt:0,nw:false,star:false,sort:""}}
F=newF();
function pnum(s){s=String(s||"");var m=/(\d[\d.]*(?:,\d+)?)/.exec(s);if(!m)return null;var x=m[1];if(x.indexOf(",")>=0)x=x.replace(/\./g,"").replace(",",".");else if(!/^\d+\.\d{1,2}$/.test(x))x=x.replace(/\./g,"");var n=parseFloat(x);return isNaN(n)?null:n}
function stars(r){r=Number(r)||0;if(!r)return"";var n=Math.max(0,Math.min(5,Math.round(r))),v=String(r).replace(".",",");return'<span class="stars" aria-label="Avaliação '+v+' de 5"><span aria-hidden="true">'+"★".repeat(n)+"☆".repeat(5-n)+'</span> <small>'+v+'</small></span>'}
function ptitle(){
  if(pg==="search")return term.trim()?"Resultados para “"+term.trim()+"”":"Busca";
  if(F.cats.length===1&&!F.brands.length){var c=catOf(F.cats[0]);if(c)return c.n}
  if(F.brands.length===1&&!F.cats.length)return F.brands[0];
  return"Todos os produtos";
}
function titleImg(){var b=(F.brands.length===1&&!F.cats.length)?brandBySlug(slug(F.brands[0])):null;return(b&&b.img)?'<img class="bimg" src="'+esc(rpImg(b.img))+'" alt="">':""}
function listItems(){
  var t=pg==="search"?norm(term.trim()):"";
  var flt=function(o){
    var p=o.p;
    if(pg==="search"&&!t)return false;
    if(t){var hx=qhx(p);o.sec=!qm(hx,t);if(o.sec&&!(typeof srDesc==="function"&&srDesc(p,t)))return false;o.sc=o.sec?0:qsc(hx,t)}
    if(F.cats.length&&F.cats.indexOf(p.c)<0)return false;
    if(F.brands.length&&!F.brands.some(function(b){return norm(b)===norm(p.brand||"")}))return false;
    var n=pnum(p.p);
    if(F.pmin!==""&&(n==null||n<Number(F.pmin)))return false;
    if(F.pmax!==""&&(n==null||n>Number(F.pmax)))return false;
    if(F.rt&&(Number(p.rt)||0)<F.rt)return false;
    if(F.nw&&!p.nw&&!(typeof isNovo==="function"&&isNovo(p)))return false;
    if(F.star&&!p.star&&!(typeof ORC==="object"&&ORC[p.id]))return false;
    return true};
  var a=S.prods.map(function(p,i){return{p:p,i:i}}).filter(flt);
  if(t&&!a.length){QPT=1;a=S.prods.map(function(p,i){return{p:p,i:i}}).filter(flt);QPT=0}
  var s=F.sort;
  if(!s)a.sort(function(x,y){return (t?(y.sc||0)-(x.sc||0):0)||((y.p.img?1:0)-(x.p.img?1:0))||((F.nw&&typeof pDate==="function")?pDate(y.p)-pDate(x.p):0)});
  if(s)a.sort(function(x,y){
    var px=pnum(x.p.p),py=pnum(y.p.p),r=0;
    if(s==="pa"||s==="pd"){if(px==null&&py==null)r=0;else if(px==null)r=1;else if(py==null)r=-1;else r=s==="pa"?px-py:py-px}
    else if(s==="nw")r=((y.p.nw?1:0)-(x.p.nw?1:0))||((typeof pDate==="function"?pDate(y.p)-pDate(x.p):(y.p.ts||0)-(x.p.ts||0)));
    else if(s==="rt")r=(Number(y.p.rt)||0)-(Number(x.p.rt)||0);
    else if(s==="az")r=norm(x.p.n).localeCompare(norm(y.p.n));
    return r||(x.i-y.i)});
  if(t){var nPri=a.filter(function(o){return!o.sec}).length;if(nPri>=12)a=a.filter(function(o){return!o.sec});a=a.filter(function(o){return!o.sec}).concat(a.filter(function(o){return o.sec}));SRI={n:nPri,sec:{}};a.forEach(function(o){if(o.sec)SRI.sec[o.p.id]=1})}else SRI=null;
  return a.map(function(o){return o.p});
}
function listUpd(){
  var it=listItems(),g=$("lgrid");if(!g)return;if(pg==="search"&&term.trim()&&!it.length)bsLog(term);
  g.innerHTML=listCards(it);
  var e=$("lempty");if(e)e.hidden=it.length>0;
  var c=$("lcount");if(c)c.textContent=cnt(it.length);
  var t=$("ltitle");if(t)t.textContent=ptitle();
  var cr=$("lcrumb");if(cr)cr.textContent=ptitle();
  var bi2=$("lbimg");if(bi2)bi2.innerHTML=titleImg();
}
function fpanel(){
  var h='<aside class="fp" id="fp" aria-label="Filtros"><div class="fph"><h3>'+T("fltT")+'</h3><button class="lnk2" type="button" data-act="fc">'+T("fltC")+'</button></div>';
  h+='<fieldset><legend>'+T("kcat")+'</legend>'+vcats().map(function(c){return'<label class="fl2" data-fc="'+esc(c.id)+'"><input type="checkbox" data-f="cat" value="'+esc(c.id)+'"'+(F.cats.indexOf(c.id)>=0?" checked":"")+'> '+esc(c.n)+'</label>'}).join("")+'</fieldset>';
  if((S.brands||[]).length)h+='<fieldset><legend>'+T("brandsT")+'</legend>'+S.brands.map(function(b){return'<label class="fl2" data-fb="'+esc(b.n)+'"><input type="checkbox" data-f="brand" value="'+esc(b.n)+'"'+(F.brands.indexOf(b.n)>=0?" checked":"")+'> '+esc(b.n)+'</label>'}).join("")+'</fieldset>';
  h+='<fieldset><legend>'+T("fltP")+'</legend><div class="pr"><input type="number" min="0" step="any" inputmode="decimal" data-f="pmin" placeholder="De" value="'+esc(F.pmin)+'" aria-label="Preço mínimo"><input type="number" min="0" step="any" inputmode="decimal" data-f="pmax" placeholder="Até" value="'+esc(F.pmax)+'" aria-label="Preço máximo"></div></fieldset>';
  h+='<fieldset><legend>'+T("fltR")+'</legend>'+[[0,T("fltA")],[4,T("flt4")],[3,T("flt3")]].map(function(x){return'<label class="fl2"><input type="radio" name="frt" data-f="rt" value="'+x[0]+'"'+(F.rt===x[0]?" checked":"")+'> '+x[1]+'</label>'}).join("")+'</fieldset>';
  h+='<fieldset><legend>'+T("fltO")+'</legend><label class="fl2"><input type="checkbox" data-f="nw"'+(F.nw?" checked":"")+'> '+T("fltN")+'</label><label class="fl2"><input type="checkbox" data-f="star"'+(F.star?" checked":"")+'> '+T("fltV")+'</label></fieldset>';
  return h+'</aside>';
}
function listPage(){
  var it=listItems(),open=fopen===null?(window.innerWidth>=900):fopen;
  var h='<div class="pp"><div class="wrap"><div class="bc"><a href="#inicio">'+T("bcH")+'</a><span>›</span><span id="lcrumb">'+esc(ptitle())+'</span></div><h1 class="pt"><span id="lbimg">'+titleImg()+'</span><span id="ltitle">'+esc(ptitle())+'</span></h1>';
  h+='<div class="lbar"><button class="btn sm" type="button" data-act="ft" aria-controls="fp">'+(open?T("fltH"):T("fltS"))+'</button><span class="meta" id="lcount">'+cnt(it.length)+'</span><label class="srt" data-ed="tx:srtT">'+T("srtT")+' <select data-f="sort">'+[["","Relevância"],["pa","Menor preço"],["pd","Maior preço"],["nw","Lançamentos"],["rt","Melhor avaliados"],["az","Nome (A a Z)"]].map(function(o){return'<option value="'+o[0]+'"'+(F.sort===o[0]?" selected":"")+'>'+o[1]+'</option>'}).join("")+'</select></label></div>';
  h+='<div class="lay'+(open?"":" fclosed")+'" id="lay">'+fpanel()+'<div><div id="lgrid" class="grid">'+listCards(it)+'</div><div id="lempty" class="empty" style="margin-top:20px"'+(it.length?" hidden":"")+'>'+((pg==="search"&&!term.trim())?"Digite o nome do produto na busca do topo.":'Nenhum produto encontrado com esses filtros. <a href="'+tel()+'">Ligue para '+esc(S.s.phone)+'</a> e a gente confirma se tem.'+(pg==="search"&&term.trim()?waAskH(term,"btn wa sm waask"):"")+((canEdit&&edit&&F.brands.length)?"<br>Para ligar produtos a uma marca, edite o produto e escolha a marca.":""))+'</div></div></div></div></div>';
  return h;
}
function fhandle(e){
  var el=e.target;if(el.hasAttribute&&el.hasAttribute("data-is")){ipFilter(el);return}var k=el.getAttribute&&el.getAttribute("data-f");if(!k)return;
  if(k==="cat"||k==="brand"){var arr=k==="cat"?F.cats:F.brands,v=el.value,i=arr.indexOf(v);if(el.checked&&i<0)arr.push(v);if(!el.checked&&i>=0)arr.splice(i,1)}
  else if(k==="pmin")F.pmin=el.value;
  else if(k==="pmax")F.pmax=el.value;
  else if(k==="rt")F.rt=Number(el.value);
  else if(k==="nw")F.nw=!!el.checked;
  else if(k==="star")F.star=!!el.checked;
  else if(k==="sort")F.sort=el.value;
  LN=48;listUpd();
}
document.addEventListener("input",fhandle);
document.addEventListener("change",fhandle);
var ICONS2={"chave-inglesa": "<rect x=\"18\" y=\"12\" width=\"6\" height=\"30\" rx=\"3\" transform=\"rotate(45 21 27)\"/><circle cx=\"34\" cy=\"14\" r=\"10\"/><rect x=\"38\" y=\"1\" width=\"6\" height=\"12\" fill=\"var(--tbg)\" transform=\"rotate(45 41 7)\"/>", "martelo": "<g transform=\"rotate(45 24 24)\"><rect x=\"21\" y=\"12\" width=\"6\" height=\"32\" rx=\"2\"/><rect x=\"8\" y=\"5\" width=\"28\" height=\"11\" rx=\"2\"/></g>", "chave-de-fenda": "<g transform=\"rotate(45 24 24)\"><rect x=\"19\" y=\"26\" width=\"10\" height=\"19\" rx=\"4\"/><rect x=\"22.5\" y=\"8\" width=\"3\" height=\"19\"/><polygon points=\"22.5,8 25.5,8 24,3\"/></g>", "alicate": "<rect x=\"19\" y=\"3\" width=\"10\" height=\"22\" rx=\"4\"/><g transform=\"rotate(-18 24 24)\"><rect x=\"20.5\" y=\"22\" width=\"7\" height=\"25\" rx=\"3\"/></g><g transform=\"rotate(18 24 24)\"><rect x=\"20.5\" y=\"22\" width=\"7\" height=\"25\" rx=\"3\"/></g><circle cx=\"24\" cy=\"24\" r=\"2.6\" fill=\"var(--tbg)\"/>", "serra": "<rect x=\"2\" y=\"14\" width=\"11\" height=\"20\" rx=\"3\"/><rect x=\"5\" y=\"19\" width=\"5\" height=\"8\" rx=\"2.5\" fill=\"var(--tbg)\"/><polygon points=\"12,16 46,16 46,30 12,30\"/><polygon points=\"12,30 16,37 20,30 24,37 28,30 32,37 36,30 40,37 44,30 46,30\"/>", "trena": "<rect x=\"5\" y=\"10\" width=\"30\" height=\"28\" rx=\"6\"/><circle cx=\"20\" cy=\"24\" r=\"7\" fill=\"var(--tbg)\"/><rect x=\"30\" y=\"31\" width=\"16\" height=\"6\" rx=\"1\"/>", "nivel": "<rect x=\"3\" y=\"16\" width=\"42\" height=\"16\" rx=\"3\"/><rect x=\"18\" y=\"20\" width=\"12\" height=\"8\" rx=\"4\" fill=\"var(--tbg)\"/><circle cx=\"10\" cy=\"24\" r=\"3.5\" fill=\"var(--tbg)\"/><circle cx=\"38\" cy=\"24\" r=\"3.5\" fill=\"var(--tbg)\"/>", "esquadro": "<polygon points=\"6,4 18,4 18,30 44,30 44,42 6,42\"/><rect x=\"18\" y=\"30\" width=\"1.8\" height=\"5\" fill=\"var(--tbg)\"/><rect x=\"24\" y=\"30\" width=\"1.8\" height=\"5\" fill=\"var(--tbg)\"/><rect x=\"30\" y=\"30\" width=\"1.8\" height=\"5\" fill=\"var(--tbg)\"/><rect x=\"36\" y=\"30\" width=\"1.8\" height=\"5\" fill=\"var(--tbg)\"/>", "prego": "<rect x=\"13\" y=\"5\" width=\"22\" height=\"6\" rx=\"2\"/><polygon points=\"21,11 27,11 24.8,44 23.2,44\"/>", "porca": "<polygon points=\"24,4 41,14 41,34 24,44 7,34 7,14\"/><circle cx=\"24\" cy=\"24\" r=\"8\" fill=\"var(--tbg)\"/>", "parafuso-simples": "<g transform=\"rotate(45 24 24)\"><rect x=\"15\" y=\"2\" width=\"18\" height=\"7\" rx=\"2\"/><rect x=\"19\" y=\"9\" width=\"10\" height=\"34\"/><polygon points=\"19,43 29,43 24,47\"/><line x1=\"19\" y1=\"15\" x2=\"29\" y2=\"17\" stroke=\"var(--tbg)\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"19\" y1=\"21\" x2=\"29\" y2=\"23\" stroke=\"var(--tbg)\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"19\" y1=\"27\" x2=\"29\" y2=\"29\" stroke=\"var(--tbg)\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"19\" y1=\"33\" x2=\"29\" y2=\"35\" stroke=\"var(--tbg)\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"19\" y1=\"39\" x2=\"29\" y2=\"41\" stroke=\"var(--tbg)\" stroke-width=\"2\" stroke-linecap=\"round\"/></g>", "arruela": "<circle cx=\"24\" cy=\"24\" r=\"19\"/><circle cx=\"24\" cy=\"24\" r=\"8\" fill=\"var(--tbg)\"/>", "chave-porta": "<circle cx=\"14\" cy=\"24\" r=\"10\"/><circle cx=\"14\" cy=\"24\" r=\"4\" fill=\"var(--tbg)\"/><rect x=\"22\" y=\"21\" width=\"24\" height=\"6\"/><rect x=\"34\" y=\"27\" width=\"5\" height=\"7\"/><rect x=\"41\" y=\"27\" width=\"5\" height=\"5\"/>", "dobradica": "<rect x=\"6\" y=\"6\" width=\"14\" height=\"36\" rx=\"1.5\"/><rect x=\"28\" y=\"6\" width=\"14\" height=\"36\" rx=\"1.5\"/><rect x=\"18\" y=\"6\" width=\"12\" height=\"36\" rx=\"3\"/><circle cx=\"13\" cy=\"14\" r=\"2\" fill=\"var(--tbg)\"/><circle cx=\"13\" cy=\"34\" r=\"2\" fill=\"var(--tbg)\"/><circle cx=\"35\" cy=\"14\" r=\"2\" fill=\"var(--tbg)\"/><circle cx=\"35\" cy=\"34\" r=\"2\" fill=\"var(--tbg)\"/><line x1=\"18\" y1=\"6\" x2=\"18\" y2=\"42\" stroke=\"var(--tbg)\" stroke-width=\"1.4\" stroke-linecap=\"round\"/><line x1=\"30\" y1=\"6\" x2=\"30\" y2=\"42\" stroke=\"var(--tbg)\" stroke-width=\"1.4\" stroke-linecap=\"round\"/>", "fechadura": "<rect x=\"12\" y=\"4\" width=\"24\" height=\"40\" rx=\"4\"/><circle cx=\"24\" cy=\"18\" r=\"5\" fill=\"var(--tbg)\"/><polygon points=\"21,20 27,20 28.5,33 19.5,33\" fill=\"var(--tbg)\"/>", "porta": "<rect x=\"10\" y=\"4\" width=\"28\" height=\"40\" rx=\"2\"/><rect x=\"15\" y=\"9\" width=\"18\" height=\"12\" fill=\"var(--tbg)\"/><rect x=\"15\" y=\"25\" width=\"18\" height=\"14\" fill=\"var(--tbg)\"/><circle cx=\"33\" cy=\"24\" r=\"2\"/>", "escada": "<rect x=\"10\" y=\"3\" width=\"5\" height=\"42\"/><rect x=\"33\" y=\"3\" width=\"5\" height=\"42\"/><rect x=\"15\" y=\"9\" width=\"18\" height=\"4\"/><rect x=\"15\" y=\"19\" width=\"18\" height=\"4\"/><rect x=\"15\" y=\"29\" width=\"18\" height=\"4\"/><rect x=\"15\" y=\"39\" width=\"18\" height=\"4\"/>", "carrinho-de-mao": "<polygon points=\"4,12 32,12 28,28 10,28\"/><line x1=\"30\" y1=\"26\" x2=\"45\" y2=\"18\" stroke=\"currentColor\" stroke-width=\"3.5\" stroke-linecap=\"round\"/><circle cx=\"9\" cy=\"37\" r=\"7\"/><circle cx=\"9\" cy=\"37\" r=\"2.6\" fill=\"var(--tbg)\"/><rect x=\"24\" y=\"29\" width=\"3\" height=\"13\"/><rect x=\"21\" y=\"40\" width=\"9\" height=\"3\" rx=\"1\"/>", "pa": "<g transform=\"rotate(45 24 24)\"><rect x=\"22\" y=\"2\" width=\"4\" height=\"22\"/><rect x=\"17\" y=\"2\" width=\"14\" height=\"4\" rx=\"2\"/><polygon points=\"16,24 32,24 32,36 24,46 16,36\"/></g>", "rastelo": "<g transform=\"rotate(45 24 24)\"><rect x=\"22\" y=\"2\" width=\"4\" height=\"26\"/><rect x=\"9\" y=\"28\" width=\"30\" height=\"5\"/><rect x=\"9.0\" y=\"33\" width=\"3\" height=\"12\"/><rect x=\"15.75\" y=\"33\" width=\"3\" height=\"12\"/><rect x=\"22.5\" y=\"33\" width=\"3\" height=\"12\"/><rect x=\"29.25\" y=\"33\" width=\"3\" height=\"12\"/><rect x=\"36.0\" y=\"33\" width=\"3\" height=\"12\"/></g>", "torneira": "<rect x=\"4\" y=\"12\" width=\"30\" height=\"9\" rx=\"2\"/><rect x=\"25\" y=\"12\" width=\"9\" height=\"22\" rx=\"2\"/><rect x=\"18\" y=\"6\" width=\"4\" height=\"7\"/><rect x=\"12\" y=\"4\" width=\"16\" height=\"3\" rx=\"1.5\"/><polygon points=\"29.5,35 33.5,41 25.5,41\"/><circle cx=\"29.5\" cy=\"41\" r=\"4\"/>", "gota": "<polygon points=\"24,3 37,27 11,27\"/><circle cx=\"24\" cy=\"31\" r=\"13\"/>", "joelho": "<polygon points=\"4,16 30,16 30,44 18,44 18,28 4,28\"/><rect x=\"2\" y=\"13\" width=\"5\" height=\"18\" rx=\"1\"/><rect x=\"15\" y=\"42\" width=\"18\" height=\"4\" rx=\"1\"/>", "caixa-dagua": "<rect x=\"6\" y=\"14\" width=\"36\" height=\"28\" rx=\"4\"/><rect x=\"4\" y=\"9\" width=\"40\" height=\"7\" rx=\"3\"/><rect x=\"20\" y=\"4\" width=\"8\" height=\"6\" rx=\"2\"/><rect x=\"12\" y=\"26\" width=\"24\" height=\"2.4\" fill=\"var(--tbg)\"/>", "chuveiro": "<rect x=\"22\" y=\"2\" width=\"4\" height=\"9\"/><polygon points=\"8,20 40,20 34,10 14,10\"/><line x1=\"14\" y1=\"28\" x2=\"12\" y2=\"38\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"24\" y1=\"28\" x2=\"24\" y2=\"41\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"34\" y1=\"28\" x2=\"36\" y2=\"38\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/>", "interruptor": "<rect x=\"12\" y=\"4\" width=\"24\" height=\"40\" rx=\"5\"/><rect x=\"18\" y=\"10\" width=\"12\" height=\"28\" rx=\"3\" fill=\"var(--tbg)\"/><rect x=\"19.5\" y=\"12\" width=\"9\" height=\"12\" rx=\"2\"/>", "plugue": "<rect x=\"14\" y=\"3\" width=\"6\" height=\"12\" rx=\"1\"/><rect x=\"28\" y=\"3\" width=\"6\" height=\"12\" rx=\"1\"/><rect x=\"10\" y=\"14\" width=\"28\" height=\"16\" rx=\"4\"/><rect x=\"20\" y=\"28\" width=\"8\" height=\"17\"/>", "bateria": "<rect x=\"3\" y=\"14\" width=\"37\" height=\"22\" rx=\"4\"/><rect x=\"40\" y=\"20\" width=\"5\" height=\"10\" rx=\"1.5\"/><polygon points=\"23,17 15,26 21,26 19,33 29,23 23,23\" fill=\"var(--tbg)\"/>", "raio": "<polygon points=\"28,3 10,27 21,27 18,45 38,19 26,19\"/>", "lanterna": "<rect x=\"10\" y=\"3\" width=\"28\" height=\"9\" rx=\"2\"/><polygon points=\"12,12 36,12 32,22 16,22\"/><rect x=\"18\" y=\"22\" width=\"12\" height=\"22\" rx=\"3\"/><rect x=\"22\" y=\"28\" width=\"4\" height=\"7\" rx=\"2\" fill=\"var(--tbg)\"/>", "ventilador": "<g transform=\"rotate(0 24 24)\"><polygon points=\"24,22 15,7 21,3 29,10\"/></g><g transform=\"rotate(90 24 24)\"><polygon points=\"24,22 15,7 21,3 29,10\"/></g><g transform=\"rotate(180 24 24)\"><polygon points=\"24,22 15,7 21,3 29,10\"/></g><g transform=\"rotate(270 24 24)\"><polygon points=\"24,22 15,7 21,3 29,10\"/></g><circle cx=\"24\" cy=\"24\" r=\"4.5\"/><circle cx=\"24\" cy=\"24\" r=\"2\" fill=\"var(--tbg)\"/>", "painel-solar": "<polygon points=\"10,17 42,17 46,37 6,37\"/><line x1=\"21\" y1=\"17\" x2=\"19\" y2=\"37\" stroke=\"var(--tbg)\" stroke-width=\"1.6\" stroke-linecap=\"round\"/><line x1=\"32\" y1=\"17\" x2=\"33\" y2=\"37\" stroke=\"var(--tbg)\" stroke-width=\"1.6\" stroke-linecap=\"round\"/><line x1=\"8\" y1=\"27\" x2=\"44\" y2=\"27\" stroke=\"var(--tbg)\" stroke-width=\"1.6\" stroke-linecap=\"round\"/><rect x=\"22\" y=\"37\" width=\"4\" height=\"6\"/><rect x=\"14\" y=\"42\" width=\"20\" height=\"3\" rx=\"1\"/><circle cx=\"40\" cy=\"8\" r=\"4\"/>", "sol": "<circle cx=\"24\" cy=\"24\" r=\"9\"/><line x1=\"37.0\" y1=\"24.0\" x2=\"43.0\" y2=\"24.0\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"33.19238815542512\" y1=\"33.19238815542512\" x2=\"37.435028842544405\" y2=\"37.4350288425444\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"24.0\" y1=\"37.0\" x2=\"24.0\" y2=\"43.0\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"14.807611844574883\" y1=\"33.19238815542512\" x2=\"10.564971157455599\" y2=\"37.435028842544405\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"11.0\" y1=\"24.0\" x2=\"5.0\" y2=\"24.000000000000004\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"14.80761184457488\" y1=\"14.807611844574883\" x2=\"10.564971157455593\" y2=\"10.564971157455599\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"23.999999999999996\" y1=\"11.0\" x2=\"23.999999999999996\" y2=\"5.0\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"33.192388155425114\" y1=\"14.80761184457488\" x2=\"37.4350288425444\" y2=\"10.564971157455593\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/>", "luva": "<rect x=\"12\" y=\"22\" width=\"24\" height=\"20\" rx=\"5\"/><rect x=\"12\" y=\"10\" width=\"5\" height=\"16\" rx=\"2.5\"/><rect x=\"18.5\" y=\"5\" width=\"5\" height=\"21\" rx=\"2.5\"/><rect x=\"25\" y=\"5\" width=\"5\" height=\"21\" rx=\"2.5\"/><rect x=\"31.5\" y=\"10\" width=\"5\" height=\"16\" rx=\"2.5\"/><g transform=\"rotate(-25 7 31)\"><rect x=\"4.5\" y=\"24\" width=\"5\" height=\"14\" rx=\"2.5\"/></g><rect x=\"13\" y=\"40\" width=\"22\" height=\"6\" rx=\"2\"/>", "oculos": "<rect x=\"3\" y=\"14\" width=\"19\" height=\"18\" rx=\"6\"/><rect x=\"26\" y=\"14\" width=\"19\" height=\"18\" rx=\"6\"/><rect x=\"20\" y=\"20\" width=\"8\" height=\"4\"/><rect x=\"7\" y=\"18\" width=\"11\" height=\"10\" rx=\"4\" fill=\"var(--tbg)\"/><rect x=\"30\" y=\"18\" width=\"11\" height=\"10\" rx=\"4\" fill=\"var(--tbg)\"/>", "protetor-auricular": "<polygon points=\"7.0,26.0 7.26,23.05 8.03,20.19 9.28,17.5 10.98,15.07 13.07,12.98 15.5,11.28 18.19,10.03 21.05,9.26 24.0,9.0 26.95,9.26 29.81,10.03 32.5,11.28 34.93,12.98 37.02,15.07 38.72,17.5 39.97,20.19 40.74,23.05 41.0,26.0 36.0,26.0 35.82,23.92 35.28,21.9 34.39,20.0 33.19,18.29 31.71,16.81 30.0,15.61 28.1,14.72 26.08,14.18 24.0,14.0 21.92,14.18 19.9,14.72 18.0,15.61 16.29,16.81 14.81,18.29 13.61,20.0 12.72,21.9 12.18,23.92 12.0,26.0\"/><rect x=\"5\" y=\"24\" width=\"11\" height=\"17\" rx=\"4\"/><rect x=\"32\" y=\"24\" width=\"11\" height=\"17\" rx=\"4\"/>", "bota": "<polygon points=\"10,4 28,4 28,24 44,32 44,42 10,42\"/><rect x=\"8\" y=\"40\" width=\"38\" height=\"5\" rx=\"2\"/>", "colete": "<polygon points=\"14,4 20,4 24,12 28,4 34,4 42,14 36,20 36,44 12,44 12,20 6,14\"/><rect x=\"12\" y=\"27\" width=\"24\" height=\"3\" fill=\"var(--tbg)\"/><rect x=\"12\" y=\"35\" width=\"24\" height=\"3\" fill=\"var(--tbg)\"/>", "mascara": "<rect x=\"8\" y=\"14\" width=\"32\" height=\"22\" rx=\"9\"/><rect x=\"2\" y=\"20\" width=\"8\" height=\"3\"/><rect x=\"38\" y=\"20\" width=\"8\" height=\"3\"/><circle cx=\"17\" cy=\"26\" r=\"4\" fill=\"var(--tbg)\"/><circle cx=\"31\" cy=\"26\" r=\"4\" fill=\"var(--tbg)\"/>", "cone": "<polygon points=\"24,4 34,36 14,36\"/><rect x=\"6\" y=\"36\" width=\"36\" height=\"7\" rx=\"2\"/><polygon points=\"21,14 27,14 28,20 20,20\" fill=\"var(--tbg)\"/><polygon points=\"19,26 29,26 30,32 18,32\" fill=\"var(--tbg)\"/>", "extintor": "<rect x=\"14\" y=\"14\" width=\"20\" height=\"30\" rx=\"6\"/><rect x=\"20\" y=\"8\" width=\"8\" height=\"7\"/><rect x=\"17\" y=\"5\" width=\"16\" height=\"4\" rx=\"2\"/><line x1=\"30\" y1=\"10\" x2=\"41\" y2=\"20\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/><rect x=\"17\" y=\"26\" width=\"14\" height=\"8\" rx=\"1\" fill=\"var(--tbg)\"/>", "escudo": "<polygon points=\"24,3 41,9 41,24 24,45 7,24 7,9\"/><line x1=\"16\" y1=\"23\" x2=\"22\" y2=\"29\" stroke=\"var(--tbg)\" stroke-width=\"3.6\" stroke-linecap=\"round\"/><line x1=\"22\" y1=\"29\" x2=\"33\" y2=\"17\" stroke=\"var(--tbg)\" stroke-width=\"3.6\" stroke-linecap=\"round\"/>", "aviso": "<polygon points=\"24,4 45,42 3,42\"/><rect x=\"22\" y=\"17\" width=\"4\" height=\"14\" rx=\"2\" fill=\"var(--tbg)\"/><circle cx=\"24\" cy=\"36.5\" r=\"2.6\" fill=\"var(--tbg)\"/>", "rolo-pintura": "<rect x=\"4\" y=\"5\" width=\"34\" height=\"13\" rx=\"3\"/><rect x=\"40\" y=\"9\" width=\"4\" height=\"17\"/><rect x=\"22\" y=\"24\" width=\"22\" height=\"4\"/><rect x=\"22\" y=\"26\" width=\"4\" height=\"8\"/><rect x=\"19\" y=\"33\" width=\"10\" height=\"13\" rx=\"3\"/>", "pincel": "<g transform=\"rotate(45 24 24)\"><polygon points=\"18,2 30,2 28,16 20,16\"/><rect x=\"19\" y=\"16\" width=\"10\" height=\"8\"/><rect x=\"21.5\" y=\"24\" width=\"5\" height=\"20\" rx=\"2.5\"/></g>", "spray": "<rect x=\"14\" y=\"16\" width=\"20\" height=\"28\" rx=\"4\"/><rect x=\"18\" y=\"8\" width=\"12\" height=\"9\" rx=\"2\"/><rect x=\"28\" y=\"4\" width=\"8\" height=\"4\" rx=\"1\"/><rect x=\"17\" y=\"26\" width=\"14\" height=\"10\" rx=\"2\" fill=\"var(--tbg)\"/><circle cx=\"41\" cy=\"5\" r=\"1.8\"/><circle cx=\"44\" cy=\"9\" r=\"1.8\"/><circle cx=\"40\" cy=\"11\" r=\"1.4\"/>", "tijolo": "<rect x=\"4\" y=\"10\" width=\"40\" height=\"28\" rx=\"2\"/><rect x=\"4\" y=\"19\" width=\"40\" height=\"2\" fill=\"var(--tbg)\"/><rect x=\"4\" y=\"28.5\" width=\"40\" height=\"2\" fill=\"var(--tbg)\"/><rect x=\"20\" y=\"10\" width=\"2\" height=\"9.3\" fill=\"var(--tbg)\"/><rect x=\"12\" y=\"21\" width=\"2\" height=\"7.7\" fill=\"var(--tbg)\"/><rect x=\"30\" y=\"21\" width=\"2\" height=\"7.7\" fill=\"var(--tbg)\"/><rect x=\"20\" y=\"30.5\" width=\"2\" height=\"7.5\" fill=\"var(--tbg)\"/>", "saco": "<polygon points=\"10,10 38,10 42,20 40,44 8,44 6,20\"/><rect x=\"8\" y=\"17\" width=\"32\" height=\"2\" fill=\"var(--tbg)\"/><rect x=\"14\" y=\"26\" width=\"20\" height=\"10\" rx=\"2\" fill=\"var(--tbg)\"/>", "regua": "<rect x=\"3\" y=\"14\" width=\"42\" height=\"20\" rx=\"2\"/><rect x=\"8\" y=\"14\" width=\"2\" height=\"8\" fill=\"var(--tbg)\"/><rect x=\"14\" y=\"14\" width=\"2\" height=\"11\" fill=\"var(--tbg)\"/><rect x=\"20\" y=\"14\" width=\"2\" height=\"8\" fill=\"var(--tbg)\"/><rect x=\"26\" y=\"14\" width=\"2\" height=\"11\" fill=\"var(--tbg)\"/><rect x=\"32\" y=\"14\" width=\"2\" height=\"8\" fill=\"var(--tbg)\"/><rect x=\"38\" y=\"14\" width=\"2\" height=\"11\" fill=\"var(--tbg)\"/>", "azulejo": "<rect x=\"4.0\" y=\"4.0\" width=\"12.5\" height=\"12.5\" rx=\"1.5\"/><rect x=\"4.0\" y=\"18.5\" width=\"12.5\" height=\"12.5\" rx=\"1.5\"/><rect x=\"4.0\" y=\"33.0\" width=\"12.5\" height=\"12.5\" rx=\"1.5\"/><rect x=\"18.5\" y=\"4.0\" width=\"12.5\" height=\"12.5\" rx=\"1.5\"/><rect x=\"18.5\" y=\"18.5\" width=\"12.5\" height=\"12.5\" rx=\"1.5\"/><rect x=\"18.5\" y=\"33.0\" width=\"12.5\" height=\"12.5\" rx=\"1.5\"/><rect x=\"33.0\" y=\"4.0\" width=\"12.5\" height=\"12.5\" rx=\"1.5\"/><rect x=\"33.0\" y=\"18.5\" width=\"12.5\" height=\"12.5\" rx=\"1.5\"/><rect x=\"33.0\" y=\"33.0\" width=\"12.5\" height=\"12.5\" rx=\"1.5\"/>", "telha": "<polygon points=\"14,6 34,6 44,40 4,40\"/><rect x=\"9\" y=\"16\" width=\"30\" height=\"2\" fill=\"var(--tbg)\"/><rect x=\"7\" y=\"26\" width=\"34\" height=\"2\" fill=\"var(--tbg)\"/><rect x=\"24\" y=\"6\" width=\"2\" height=\"10\" fill=\"var(--tbg)\"/><rect x=\"15\" y=\"18\" width=\"2\" height=\"8\" fill=\"var(--tbg)\"/><rect x=\"33\" y=\"18\" width=\"2\" height=\"8\" fill=\"var(--tbg)\"/>", "janela": "<rect x=\"6\" y=\"6\" width=\"36\" height=\"36\" rx=\"3\"/><rect x=\"11\" y=\"11\" width=\"12\" height=\"12\" fill=\"var(--tbg)\"/><rect x=\"25\" y=\"11\" width=\"12\" height=\"12\" fill=\"var(--tbg)\"/><rect x=\"11\" y=\"25\" width=\"12\" height=\"12\" fill=\"var(--tbg)\"/><rect x=\"25\" y=\"25\" width=\"12\" height=\"12\" fill=\"var(--tbg)\"/>", "arvore": "<circle cx=\"24\" cy=\"18\" r=\"13\"/><circle cx=\"14\" cy=\"26\" r=\"9\"/><circle cx=\"34\" cy=\"26\" r=\"9\"/><rect x=\"21\" y=\"28\" width=\"6\" height=\"16\"/>", "broto": "<rect x=\"22\" y=\"22\" width=\"4\" height=\"22\"/><polygon points=\"4,12 20,14 22,26 8,24\"/><polygon points=\"44,8 28,10 26,22 40,20\"/><rect x=\"14\" y=\"42\" width=\"20\" height=\"3\" rx=\"1.5\"/>", "regador": "<rect x=\"10\" y=\"18\" width=\"24\" height=\"22\" rx=\"4\"/><polygon points=\"32,28 44,12 47,14 34,34\"/><rect x=\"3\" y=\"20\" width=\"8\" height=\"18\" rx=\"4\"/><rect x=\"6\" y=\"24\" width=\"3\" height=\"10\" rx=\"1.5\" fill=\"var(--tbg)\"/><rect x=\"13\" y=\"12\" width=\"18\" height=\"4\" rx=\"2\"/>", "trator": "<rect x=\"24\" y=\"8\" width=\"14\" height=\"16\"/><rect x=\"4\" y=\"16\" width=\"22\" height=\"9\"/><rect x=\"4\" y=\"22\" width=\"40\" height=\"10\" rx=\"2\"/><circle cx=\"34\" cy=\"34\" r=\"9\"/><circle cx=\"34\" cy=\"34\" r=\"3\" fill=\"var(--tbg)\"/><circle cx=\"11\" cy=\"38\" r=\"6\"/><circle cx=\"11\" cy=\"38\" r=\"2.2\" fill=\"var(--tbg)\"/>", "carro": "<polygon points=\"4,30 8,20 16,12 32,12 40,20 44,24 44,34 4,34\"/><polygon points=\"12,20 17,15 22,15 22,20\" fill=\"var(--tbg)\"/><polygon points=\"25,15 31,15 36,20 25,20\" fill=\"var(--tbg)\"/><circle cx=\"14\" cy=\"35\" r=\"6.5\"/><circle cx=\"14\" cy=\"35\" r=\"2.4\" fill=\"var(--tbg)\"/><circle cx=\"36\" cy=\"35\" r=\"6.5\"/><circle cx=\"36\" cy=\"35\" r=\"2.4\" fill=\"var(--tbg)\"/>", "pneu": "<circle cx=\"24\" cy=\"24\" r=\"20\"/><circle cx=\"24\" cy=\"24\" r=\"14\" fill=\"var(--tbg)\"/><circle cx=\"24\" cy=\"24\" r=\"8\"/><circle cx=\"24\" cy=\"24\" r=\"3\" fill=\"var(--tbg)\"/>", "lata-oleo": "<rect x=\"6\" y=\"20\" width=\"26\" height=\"24\" rx=\"3\"/><polygon points=\"30,24 42,10 46,13 34,30\"/><rect x=\"14\" y=\"14\" width=\"10\" height=\"6\" rx=\"2\"/><rect x=\"11\" y=\"28\" width=\"16\" height=\"8\" rx=\"1.5\" fill=\"var(--tbg)\"/>", "rolamento": "<circle cx=\"24\" cy=\"24\" r=\"21\"/><circle cx=\"24\" cy=\"24\" r=\"13.5\" fill=\"var(--tbg)\"/><circle cx=\"40.5\" cy=\"24.0\" r=\"3.3\"/><circle cx=\"32.25\" cy=\"38.28941916244324\" r=\"3.3\"/><circle cx=\"15.750000000000004\" cy=\"38.28941916244324\" r=\"3.3\"/><circle cx=\"7.5\" cy=\"24.000000000000004\" r=\"3.3\"/><circle cx=\"15.749999999999993\" cy=\"9.710580837556767\" r=\"3.3\"/><circle cx=\"32.25\" cy=\"9.710580837556764\" r=\"3.3\"/><circle cx=\"24\" cy=\"24\" r=\"8\"/><circle cx=\"24\" cy=\"24\" r=\"3.5\" fill=\"var(--tbg)\"/>", "disco-serra": "<circle cx=\"24\" cy=\"24\" r=\"15\"/><polygon points=\"36.87,22.19 45.0,24.0 36.87,25.81\"/><polygon points=\"36.05,28.87 42.19,34.5 34.24,32.0\"/><polygon points=\"32.0,34.24 34.5,42.19 28.87,36.05\"/><polygon points=\"25.81,36.87 24.0,45.0 22.19,36.87\"/><polygon points=\"19.13,36.05 13.5,42.19 16.0,34.24\"/><polygon points=\"13.76,32.0 5.81,34.5 11.95,28.87\"/><polygon points=\"11.13,25.81 3.0,24.0 11.13,22.19\"/><polygon points=\"11.95,19.13 5.81,13.5 13.76,16.0\"/><polygon points=\"16.0,13.76 13.5,5.81 19.13,11.95\"/><polygon points=\"22.19,11.13 24.0,3.0 25.81,11.13\"/><polygon points=\"28.87,11.95 34.5,5.81 32.0,13.76\"/><polygon points=\"34.24,16.0 42.19,13.5 36.05,19.13\"/><circle cx=\"24\" cy=\"24\" r=\"4.5\" fill=\"var(--tbg)\"/>", "broca": "<g transform=\"rotate(-45 24 24)\"><rect x=\"20\" y=\"2\" width=\"8\" height=\"12\"/><polygon points=\"20,14 28,14 28,40 24,46 20,40\"/><line x1=\"20\" y1=\"20\" x2=\"28\" y2=\"17\" stroke=\"var(--tbg)\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"20\" y1=\"26\" x2=\"28\" y2=\"23\" stroke=\"var(--tbg)\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"20\" y1=\"32\" x2=\"28\" y2=\"29\" stroke=\"var(--tbg)\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"20\" y1=\"38\" x2=\"28\" y2=\"35\" stroke=\"var(--tbg)\" stroke-width=\"2\" stroke-linecap=\"round\"/></g>", "esmerilhadeira": "<rect x=\"3\" y=\"20\" width=\"26\" height=\"12\" rx=\"5\"/><rect x=\"29\" y=\"22\" width=\"7\" height=\"8\"/><rect x=\"36\" y=\"9\" width=\"4\" height=\"32\" rx=\"2\"/><rect x=\"10\" y=\"31\" width=\"7\" height=\"13\" rx=\"3\"/><line x1=\"43\" y1=\"31\" x2=\"47\" y2=\"34\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\"/><line x1=\"43\" y1=\"26\" x2=\"47\" y2=\"26\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\"/><line x1=\"43\" y1=\"21\" x2=\"47\" y2=\"18\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>", "compressor": "<rect x=\"4\" y=\"18\" width=\"32\" height=\"16\" rx=\"8\"/><rect x=\"14\" y=\"8\" width=\"14\" height=\"10\" rx=\"2\"/><rect x=\"36\" y=\"8\" width=\"3\" height=\"24\" rx=\"1.5\"/><rect x=\"8\" y=\"33\" width=\"4\" height=\"6\"/><rect x=\"28\" y=\"33\" width=\"4\" height=\"6\"/><circle cx=\"10\" cy=\"41\" r=\"4\"/><circle cx=\"30\" cy=\"41\" r=\"4\"/><circle cx=\"21\" cy=\"13\" r=\"2.6\" fill=\"var(--tbg)\"/>", "solda-mascara": "<polygon points=\"6,8 42,8 42,30 34,42 14,42 6,30\"/><rect x=\"12\" y=\"16\" width=\"24\" height=\"8\" rx=\"1.5\" fill=\"var(--tbg)\"/>", "vassoura": "<g transform=\"rotate(-30 24 24)\"><rect x=\"22\" y=\"2\" width=\"4\" height=\"26\"/><polygon points=\"14,28 34,28 40,46 8,46\"/><line x1=\"20\" y1=\"32\" x2=\"17\" y2=\"44\" stroke=\"var(--tbg)\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"24\" y1=\"32\" x2=\"24\" y2=\"44\" stroke=\"var(--tbg)\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"28\" y1=\"32\" x2=\"31\" y2=\"44\" stroke=\"var(--tbg)\" stroke-width=\"2\" stroke-linecap=\"round\"/></g>", "balde": "<polygon points=\"8,14 40,14 35,44 13,44\"/><rect x=\"6\" y=\"10\" width=\"36\" height=\"6\" rx=\"2\"/><polygon points=\"8.03,8.19 8.96,6.08 10.17,4.11 11.63,2.33 13.33,0.77 15.22,-0.55 17.27,-1.61 19.44,-2.38 21.7,-2.84 24.0,-3.0 26.3,-2.84 28.56,-2.38 30.73,-1.61 32.78,-0.55 34.67,0.77 36.37,2.33 37.83,4.11 39.04,6.08 39.97,8.19 37.16,9.21 36.39,7.48 35.39,5.86 34.18,4.39 32.79,3.1 31.23,2.01 29.55,1.14 27.75,0.51 25.89,0.13 24.0,0.0 22.11,0.13 20.25,0.51 18.45,1.14 16.77,2.01 15.21,3.1 13.82,4.39 12.61,5.86 11.61,7.48 10.84,9.21\"/>", "frasco": "<rect x=\"14\" y=\"16\" width=\"20\" height=\"28\" rx=\"5\"/><rect x=\"20\" y=\"8\" width=\"8\" height=\"9\"/><rect x=\"26\" y=\"5\" width=\"12\" height=\"4\" rx=\"1.5\"/><rect x=\"18\" y=\"26\" width=\"12\" height=\"10\" rx=\"2\" fill=\"var(--tbg)\"/>", "caixa": "<polygon points=\"24,4 44,14 24,24 4,14\"/><polygon points=\"4,18 22,27 22,45 4,36\"/><polygon points=\"26,27 44,18 44,36 26,45\"/>", "caminhao": "<rect x=\"2\" y=\"10\" width=\"26\" height=\"24\" rx=\"2\"/><polygon points=\"30,16 38,16 46,26 46,34 30,34\"/><polygon points=\"33,19 37,19 42,26 33,26\" fill=\"var(--tbg)\"/><circle cx=\"12\" cy=\"36\" r=\"5.5\"/><circle cx=\"12\" cy=\"36\" r=\"2\" fill=\"var(--tbg)\"/><circle cx=\"36\" cy=\"36\" r=\"5.5\"/><circle cx=\"36\" cy=\"36\" r=\"2\" fill=\"var(--tbg)\"/>", "etiqueta": "<polygon points=\"4,4 26,4 44,22 22,44 4,26\"/><circle cx=\"14\" cy=\"14\" r=\"3.6\" fill=\"var(--tbg)\"/>", "carrinho-compras": "<polygon points=\"12,12 44,12 39,29 16,29\"/><rect x=\"2\" y=\"4\" width=\"9\" height=\"4\" rx=\"2\"/><rect x=\"9\" y=\"4\" width=\"4\" height=\"26\" rx=\"2\"/><rect x=\"14\" y=\"29\" width=\"28\" height=\"3\"/><circle cx=\"20\" cy=\"39\" r=\"4\"/><circle cx=\"36\" cy=\"39\" r=\"4\"/>", "estrela": "<polygon points=\"24.0,5.0 29.0,18.12 43.02,18.82 32.08,27.63 35.76,41.18 24.0,33.5 12.24,41.18 15.92,27.63 4.98,18.82 19.0,18.12\"/>", "relogio": "<circle cx=\"24\" cy=\"24\" r=\"20\"/><circle cx=\"24\" cy=\"24\" r=\"16.5\" fill=\"var(--tbg)\"/><rect x=\"22.5\" y=\"10\" width=\"3\" height=\"15\"/><rect x=\"22.5\" y=\"22.5\" width=\"11\" height=\"3\"/>", "celular": "<rect x=\"13\" y=\"3\" width=\"22\" height=\"42\" rx=\"4\"/><rect x=\"16\" y=\"9\" width=\"16\" height=\"26\" rx=\"1\" fill=\"var(--tbg)\"/><circle cx=\"24\" cy=\"40\" r=\"2\" fill=\"var(--tbg)\"/>", "localizacao": "<circle cx=\"24\" cy=\"18\" r=\"13\"/><polygon points=\"12.5,24 35.5,24 24,45\"/><circle cx=\"24\" cy=\"18\" r=\"5\" fill=\"var(--tbg)\"/>", "desconto": "<circle cx=\"24\" cy=\"24\" r=\"20\"/><circle cx=\"17\" cy=\"17\" r=\"4\" fill=\"var(--tbg)\"/><circle cx=\"31\" cy=\"31\" r=\"4\" fill=\"var(--tbg)\"/><line x1=\"32\" y1=\"15\" x2=\"16\" y2=\"33\" stroke=\"var(--tbg)\" stroke-width=\"3.6\" stroke-linecap=\"round\"/>"};
for(var k2 in ICONS2)ICONS[k2]=ICONS2[k2];
var ICON_META=[["parafuso", "Parafuso e porca", "parafuso porca fixacao rosca"], ["cadeado", "Cadeado", "cadeado ferragens seguranca tranca"], ["ferramentas", "Caixa de ferramentas", "ferramentas caixa maleta oficina"], ["furadeira", "Furadeira", "furadeira equipamento eletrica furar"], ["engrenagem", "Engrenagem", "engrenagem maquinas mecanica configuracao"], ["capacete", "Capacete", "capacete seguranca epi obra"], ["motosserra", "Motosserra", "motosserra corrente serra conserto"], ["tinta", "Lata de tinta", "tinta lata pintura verniz"], ["casa", "Casa", "casa manutencao residencial inicio"], ["lampada", "Lâmpada", "lampada iluminacao luz"], ["eletrico", "Tomada", "tomada eletrica material eletrico"], ["hidraulico", "Tubo e registro", "tubo registro hidraulica cano valvula"], ["agro", "Folha (agro)", "folha agro planta campo agricultura"], ["todos", "Todos (quadrados)", "todos quadrados categorias geral"], ["chave-inglesa", "Chave inglesa", "chave ferramenta mecanica oficina manutencao"], ["martelo", "Martelo", "martelo marreta ferramenta bater prego"], ["chave-de-fenda", "Chave de fenda", "chave fenda phillips parafusadeira ferramenta"], ["alicate", "Alicate", "alicate ferramenta corte aperto"], ["serra", "Serra", "serra serrote ferramenta corte madeira"], ["trena", "Trena", "trena medida metro medir"], ["nivel", "Nível", "nivel bolha alinhamento obra"], ["esquadro", "Esquadro", "esquadro medida obra marcenaria"], ["prego", "Prego", "prego fixacao madeira martelo"], ["porca", "Porca", "porca sextavada fixacao parafuso"], ["parafuso-simples", "Parafuso", "parafuso rosca fixacao"], ["arruela", "Arruela", "arruela anilha fixacao"], ["chave-porta", "Chave", "chave fechadura seguranca chaveiro"], ["dobradica", "Dobradiça", "dobradica porta portao ferragem"], ["fechadura", "Fechadura", "fechadura porta trinco seguranca"], ["porta", "Porta", "porta madeira esquadria"], ["escada", "Escada", "escada degraus altura obra"], ["carrinho-de-mao", "Carrinho de mão", "carrinho mao obra construcao transporte"], ["pa", "Pá", "pa pazada jardim terra obra"], ["rastelo", "Rastelo", "rastelo rastelo jardim folhas"], ["torneira", "Torneira", "torneira agua hidraulica pia"], ["gota", "Gota de água", "gota agua hidraulica liquido"], ["joelho", "Cano (joelho)", "cano tubo conexao pvc hidraulica joelho"], ["caixa-dagua", "Caixa d’água", "caixa agua reservatorio tanque polietileno"], ["chuveiro", "Chuveiro", "chuveiro ducha banheiro hidraulica"], ["interruptor", "Interruptor", "interruptor tomada eletrica luz"], ["plugue", "Plugue", "plugue tomada cabo eletrica"], ["bateria", "Bateria", "bateria pilha energia"], ["raio", "Energia (raio)", "raio energia eletrica eletrico"], ["lanterna", "Lanterna", "lanterna luz iluminacao"], ["ventilador", "Ventilador", "ventilador ventilacao ar exaustor"], ["painel-solar", "Painel solar", "painel solar energia fotovoltaica sol"], ["sol", "Sol", "sol solar energia calor"], ["luva", "Luva", "luva protecao seguranca epi mao"], ["oculos", "Óculos de proteção", "oculos protecao epi seguranca lente"], ["protetor-auricular", "Protetor auricular", "protetor auricular abafador ruido epi"], ["bota", "Bota de segurança", "bota botina calcado epi seguranca"], ["colete", "Colete", "colete refletivo epi seguranca"], ["mascara", "Máscara", "mascara respirador epi poeira protecao"], ["cone", "Cone", "cone sinalizacao transito seguranca"], ["extintor", "Extintor", "extintor incendio seguranca fogo"], ["escudo", "Proteção", "escudo protecao seguranca garantia"], ["aviso", "Atenção", "aviso atencao perigo sinalizacao"], ["rolo-pintura", "Rolo de pintura", "rolo pintura parede tinta"], ["pincel", "Pincel", "pincel trincha pintura tinta"], ["spray", "Spray", "spray tinta aerossol lata"], ["tijolo", "Tijolo", "tijolo parede alvenaria construcao"], ["saco", "Saco (cimento)", "saco cimento argamassa adubo racao"], ["regua", "Régua", "regua medida metro"], ["azulejo", "Piso e azulejo", "piso azulejo ceramica revestimento"], ["telha", "Telhado", "telha telhado cobertura"], ["janela", "Janela", "janela vidro esquadria"], ["arvore", "Árvore", "arvore jardim madeira planta"], ["broto", "Broto", "broto planta semente jardinagem"], ["regador", "Regador", "regador jardim irrigacao planta agua"], ["trator", "Trator", "trator agro maquina agricola"], ["carro", "Carro", "carro automotivo oficina veiculo"], ["pneu", "Pneu", "pneu roda borracharia automotivo"], ["lata-oleo", "Óleo e graxa", "oleo lubrificante graxa oficina lata"], ["rolamento", "Rolamento", "rolamento mancal rolamentos oficina"], ["disco-serra", "Disco de serra", "disco serra circular corte lamina"], ["broca", "Broca", "broca furadeira furar concreto madeira"], ["esmerilhadeira", "Esmerilhadeira", "esmerilhadeira lixadeira disco corte desbaste"], ["compressor", "Compressor", "compressor ar pneumatica pressao"], ["solda-mascara", "Solda", "solda mascara soldador eletrodo"], ["vassoura", "Vassoura", "vassoura limpeza varrer"], ["balde", "Balde", "balde limpeza agua"], ["frasco", "Detergente", "frasco detergente limpeza produto quimico"], ["caixa", "Pacote", "caixa pacote encomenda entrega"], ["caminhao", "Entrega", "caminhao entrega frete transporte"], ["etiqueta", "Etiqueta de preço", "etiqueta preco oferta promocao tag"], ["carrinho-compras", "Carrinho de compras", "carrinho compras loja venda"], ["estrela", "Estrela", "estrela destaque favorito avaliacao"], ["relogio", "Relógio", "relogio horario atendimento tempo"], ["celular", "Celular", "celular telefone contato whatsapp"], ["localizacao", "Localização", "localizacao mapa endereco loja pin"], ["desconto", "Desconto", "desconto promocao oferta porcentagem"]];
function iconSvg(id){return ICONS[id]?'<svg class="ci" viewBox="0 0 48 48" aria-hidden="true" fill="currentColor">'+ICONS[id]+'</svg>':'<span class="ci" aria-hidden="true">?</span>'}
function ipanel(){return'<input type="search" data-is placeholder="Pesquisar ícones (ex.: martelo, tinta, água)" aria-label="Pesquisar ícones"><div class="ipg">'+ICON_META.map(function(m){return'<button type="button" class="ipb" data-act="pi" data-id="'+m[0]+'" data-s="'+esc(norm(m[1]+" "+m[2]))+'" title="'+esc(m[1])+'">'+iconSvg(m[0])+'<small>'+esc(m[1])+'</small></button>'}).join("")+'</div><p class="note ipn" hidden>Nenhum ícone encontrado.</p>'}
function ipFilter(el){var q=norm(el.value.trim()),pp=el.closest(".ipp"),n=0;Array.prototype.forEach.call(pp.querySelectorAll(".ipb"),function(b){var ok=!q||b.getAttribute("data-s").indexOf(q)>=0;b.hidden=!ok;if(ok)n++});var nt=pp.querySelector(".ipn");if(nt)nt.hidden=n>0}
function fm(n){return n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
function money(v){var n=pnum(v);return n==null?String(v||""):fm(n)}
function badgeOf(p){var b=String(p.bd||"").trim();if(b)return b;var o=pnum(p.po),n=pnum(p.p);if(o!=null&&n!=null&&o>n)return"-"+Math.round((1-n/o)*100)+"% OFF";return""}
function priceBlock(p){
  if(!p.p)return'<div class="p c">'+T("noP")+'</div>';
  var b=badgeOf(p),h="";
  if(p.po||b)h+='<div class="pold">'+(p.po?'<s>'+esc(money(p.po))+'</s>':"")+(b?'<span class="pbd">'+esc(b)+'</span>':"")+'</div>';
  h+='<div class="p">'+esc(money(p.p))+'</div>';
  if(tv("cash"))h+='<div class="cash">'+T("cash")+'</div>';
  var c=pnum(p.pc),k=Math.max(1,parseInt(p.pn,10)||1);
  if(c!=null)h+='<div class="inst">ou <b>'+esc(fm(c))+'</b> em até <b>'+k+'x de '+esc(fm(Math.round(c/k*100)/100))+'</b> no cartão</div>';
  return h;
}
function vcats(){var has={};S.prods.forEach(function(p){has[p.c]=1});return(canEdit&&edit)?S.cats:S.cats.filter(function(c){return has[c.id]})}
function cardH(p){var c=catOf(p.c)||{i:"🔩"};return'<article class="card" data-act="vp" data-id="'+esc(p.id)+'" style="cursor:pointer"><div class="ph">'+(p.nw?'<span class="nb">Lançamento</span>':"")+(cpShow(p)?cpBtn(p.id):"")+(p.img?'<img src="'+esc(rpImg(p.img))+'" alt="'+esc(p.n)+'" loading="lazy">':catIcon(c))+'</div><div class="in"><h3><a class="cdl" href="'+esc(pHref(p))+'">'+nmH(p)+'</a></h3>'+stars(p.rt)+priceBlock(p)+'<div class="qw">'+quoteA(p,"btn")+cqBtn(p.id)+'</div>'+(edit?'<div class="ac"><button class="btn sm" type="button" data-act="ep" data-id="'+esc(p.id)+'">Editar</button><button class="btn dark sm" type="button" data-act="dp" data-id="'+esc(p.id)+'">Excluir</button></div>':'')+'</div></article>'}
function pcard(x){var c=catOf(x.c)||{i:"🔩"};return'<div class="sc" data-id="'+esc(x.id)+'"><a class="sca" href="'+esc(pHref(x))+'"><div class="ph">'+(x.img?'<img src="'+esc(rpImg(x.img))+'" alt="'+esc(x.n)+'" loading="lazy">':catIcon(c))+'</div><h3>'+nmH(x)+'</h3>'+priceBlock(x)+'</a><div class="qw">'+quoteA(x,"btn sm")+cqBtn(x.id)+'</div></div>'}
var LFOCUS=-1;
function cmClose(){var m=$("cm");if(m&&m.parentNode)m.parentNode.removeChild(m)}
function cmOpen(x,y,items){
  cmClose();
  var m=document.createElement("div");m.id="cm";m.className="cm";m.setAttribute("role","menu");
  m.innerHTML=items.map(function(it,i){return it[0]==="-"?'<div class="cms" role="separator"></div>':'<button type="button" role="menuitem" data-ci="'+i+'">'+esc(it[0])+'</button>'}).join("");
  document.body.appendChild(m);
  m.style.left=Math.max(4,Math.min(x,window.innerWidth-m.offsetWidth-8))+"px";
  m.style.top=Math.max(4,Math.min(y,window.innerHeight-m.offsetHeight-8))+"px";
  m.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;var it=items[Number(b.getAttribute("data-ci"))];cmClose();if(it)it[1]()});
  var f=m.querySelector("button");if(f)f.focus();
}
var DL=[["l","à esquerda"],["r","à direita"],["u","acima"],["d","abaixo"]];
function lay(el){
  var par=el.parentNode,kids=Array.prototype.slice.call(par.children).filter(function(k){return k.getAttribute&&(k.getAttribute("data-id")||k.getAttribute("href"))});
  function idOf(k){return k.getAttribute("data-id")||hrefId(k.getAttribute("href"))}
  var tops=[],cols=0;
  kids.forEach(function(k){if(tops.indexOf(k.offsetTop)<0)tops.push(k.offsetTop);if(k.offsetTop===kids[0].offsetTop)cols++});
  return{ids:kids.map(idOf),idx:kids.indexOf(el),cols:cols,rows:tops.length};
}
function tgt(L,d){var i=L.idx,n=L.ids.length;if(d==="l")return{ref:L.ids[i],where:"before"};if(d==="r")return{ref:L.ids[i],where:"after"};if(d==="u")return{ref:L.ids[Math.max(0,i-L.cols)],where:"before"};return{ref:L.ids[Math.min(n-1,i+L.cols)],where:"after"}}
function dirsOf(L){if(!L)return[];var r=DL.filter(function(d){return(d[0]==="l"||d[0]==="r")?L.cols>1:L.rows>1});return r.length?r:DL.slice(0,2)}
function insProd(p,tg){var ix=S.prods.map(function(x){return x.id}).indexOf(tg.ref);ix=ix<0?S.prods.length:(tg.where==="before"?ix:ix+1);S.prods.splice(ix,0,p)}
function dupProd(id,tg){var s=S.prods.filter(function(x){return x.id===id})[0];if(!s)return;var c=JSON.parse(JSON.stringify(s));c.id=uid();c.n=s.n+" (cópia)";c.ts=Date.now();insProd(c,tg);dirty=true;render()}
function delCat(id){var c=catOf(id);if(!c)return;openForm("Excluir categoria",[],"Excluir",function(){S.cats=S.cats.filter(function(x){return x.id!==id});S.prods.forEach(function(p){if(p.c===id)p.c=""});(S.banners||[]).forEach(function(b){if(b.l===id)b.l=""});F.cats=F.cats.filter(function(x){return x!==id})},"Excluir a categoria “"+c.n+"”? Os produtos dela ficam sem categoria até você editá-los.")}
function delBrand(n){openForm("Excluir marca",[],"Excluir",function(){S.brands=(S.brands||[]).filter(function(b){return b.n!==n});F.brands=F.brands.filter(function(x){return x!==n})},"Excluir a marca “"+n+"”? Os produtos dela continuam no catálogo.")}
function txLabel(k){for(var i=0;i<TX.length;i++)if(TX[i][0]===k)return TX[i][1];return"Texto"}
function txKeyOf(el){
  var n=0;
  while(el&&el!==document.body&&n<4){
    var txt=(el.textContent||"").replace(/\s+/g," ").replace(/\s*›$/,"").trim();
    if(txt&&txt.length<300){for(var i=0;i<TX.length;i++){var v=String(tv(TX[i][0])).replace(/\s+/g," ").trim();if(v&&v===txt)return TX[i][0]}}
    el=el.parentElement;n++;
  }
  return null;
}
function txForm(k){
  openForm("Editar texto",[{k:"v",l:txLabel(k),t:"area",rows:3,v:String(tv(k))}],"Salvar",function(v){S.s.tx=S.s.tx||{};S.s.tx[k]=v.v},"Este texto aparece em todos os lugares onde ele é usado. Para voltar ao original, clique com o botão direito nele e escolha “Restaurar o texto original”.");
}
function txReset(k){if(S.s.tx)delete S.s.tx[k];dirty=true;render()}
function cbMenu(id){return[["Editar este botão",function(){cbForm(id)}],["Adicionar botão depois deste",function(){cbForm(null,{ref:id})}],["Remover este botão",function(){cbDel(id)}],["Restaurar os botões padrão",function(){cbReset()}]]}
var SPM={phone:["Editar telefone e WhatsApp",["phone","wa"]],email:["Editar e-mail",["email"]],addr:["Editar endereço e links de rota (Google Maps e Waze)",["addr","maps","waze","geo"]],hours:["Editar horário de atendimento",["hours"]],insta:["Editar redes sociais (Instagram, Facebook, YouTube, TikTok)",["insta","fb","yt","tt"]]};
function menuFor(kind,id,el){
  var L=el?lay(el):null,ds=dirsOf(L),it=[];
  function pos(d){return tgt(L,d)}
  if(kind==="prod"){
    it.push(["Editar produto",function(){prodForm(id)}],["-"],["Duplicar",function(){dupProd(id,{ref:id,where:"after"})}]);
    ds.forEach(function(d){it.push(["Duplicar "+d[1],function(){dupProd(id,pos(d[0]))}])});
    if(ds.length){it.push(["-"]);ds.forEach(function(d){it.push(["Adicionar produto "+d[1],function(){prodForm(null,pos(d[0]))}])})}
    it.push(["-"],["Excluir produto",function(){delForm(id)}],["Abrir página do produto",function(){go("#p-"+id)}]);
  }else if(kind==="cat"){
    it.push(["Editar categoria",function(){catForm(id)}],["-"],["Duplicar categoria",function(){catForm(null,{ref:id,where:"after",dup:id})}]);
    ds.forEach(function(d){it.push(["Duplicar "+d[1],function(){var g=pos(d[0]);catForm(null,{ref:g.ref,where:g.where,dup:id})}])});
    it.push(["-"]);
    (ds.length?ds:DL.slice(0,2)).forEach(function(d){it.push(["Adicionar categoria "+d[1],function(){var g=L?pos(d[0]):{ref:id,where:d[0]==="l"?"before":"after"};catForm(null,{ref:g.ref,where:g.where})}])});
    it.push(["-"],["Excluir categoria",function(){delCat(id)}],["Ver página da categoria",function(){go("#cat-"+id)}]);
  }else if(kind==="brand"){
    it.push(["Editar marca",function(){brandForm(id)}],["-"],["Duplicar marca",function(){brandForm(null,{ref:id,where:"after",dup:id})}]);
    ds.forEach(function(d){it.push(["Duplicar "+d[1],function(){var g=pos(d[0]);brandForm(null,{ref:g.ref,where:g.where,dup:id})}])});
    it.push(["-"]);
    (ds.length?ds:DL.slice(0,2)).forEach(function(d){it.push(["Adicionar marca "+d[1],function(){var g=L?pos(d[0]):{ref:id,where:d[0]==="l"?"before":"after"};brandForm(null,{ref:g.ref,where:g.where})}])});
    it.push(["-"],["Excluir marca",function(){delBrand(id)}],["Ver produtos da marca",function(){go("#marca-"+slug(id))}]);
  }
  return it;
}
document.addEventListener("contextmenu",function(e){
  if(!(canEdit&&edit))return;
  var t=e.target,items=[],el,k;
  if(!t||!t.closest||t.closest("#cm")||t.closest("dialog"))return;
  function add(a){if(!a||!a.length)return;if(items.length)items.push(["-"]);a.forEach(function(x){items.push(x)})}
  k=txKeyOf(t);
  var ed=t.closest("[data-ed]"),w=ed?String(ed.getAttribute("data-ed")).split(":"):[];
  if(!k&&w[0]==="tx")k=w[1];
  if(k){var tx=[["Editar este texto",function(){txForm(k)}]];if(S.s.tx&&S.s.tx[k]!=null&&S.s.tx[k]!==DT[k])tx.push(["Restaurar o texto original",function(){txReset(k)}]);add(tx)}
  if(w[0]==="s"&&SPM[w[1]]){var sp=SPM[w[1]];add([[sp[0],function(){setPart(sp[0],sp[1])}]])}
  else if(w[0]==="foot"){add(w[1]==="links"?[["Editar links do rodapé",function(){linksForm()}]]:w[1]==="stores"?[["Editar lojas",function(){storesForm()}]]:[["Editar rodapé (CNPJ, aviso legal e redes)",function(){footForm()}]])}
  else if(w[0]==="vid")add([["Editar vídeo e sobre a empresa",function(){videoForm()}]]);
  else if(w[0]==="logo")add([["Trocar a logo, o nome ou as cores do site",function(){setForm()}]]);
  else if(w[0]==="cm")add([["Editar a mensagem do carrinho (WhatsApp)",function(){cmForm()}]]);
  if(el=t.closest("[data-cb]"))add(cbMenu(el.getAttribute("data-cb")));
  if(el=t.closest(".card[data-id],.sc[data-id]"))add(menuFor("prod",el.getAttribute("data-id")||hrefId(el.getAttribute("href")),el));
  else if(el=t.closest(".bt[data-id]"))add(menuFor("brand",el.getAttribute("data-id"),el));
  else if(el=t.closest("[data-fc]"))add(menuFor("cat",el.getAttribute("data-fc"),null));
  else if(el=t.closest("[data-fb]"))add(menuFor("brand",el.getAttribute("data-fb"),null));
  else if(el=t.closest(".ct[data-id],.fl[data-id],.kc[data-id]"))add(menuFor("cat",el.getAttribute("data-id"),el));
  else if(t.closest(".sl"))add([["Editar destaques",function(){banForm()}]]);
  else if(view&&t.closest(".pp"))add(menuFor("prod",view,null));
  if(!items.length){
    if(t.closest("input,textarea,select,option,.bar"))return;
    add([["Editar textos e contato do site",function(){setForm()}],["Editar botões de contato",function(){cbForm()}],["Editar a mensagem do carrinho (WhatsApp)",function(){cmForm()}],["Editar rodapé e lojas",function(){footForm()}]]);
  }else if(k)add([["Abrir todos os textos e contato",function(){setForm()}]]);
  e.preventDefault();cmOpen(e.clientX,e.clientY,items);
});
document.addEventListener("click",cmClose);
document.addEventListener("keydown",function(e){if(e.key==="Escape")cmClose()});
window.addEventListener("scroll",cmClose,true);
var fmore=0;
function featList(){var oc=function(p){return(typeof ORC==="object"&&ORC[p.id])||0};var hot=S.prods.filter(function(x){return oc(x)>0}).sort(function(a,b){return(oc(b)-oc(a))||((b.img?1:0)-(a.img?1:0))});var hid={};hot.forEach(function(p){hid[p.id]=1});var base=hot.concat(S.prods.filter(function(x){return x.star&&!hid[x.id]}));if(base.length<12&&typeof featFill==="function")base=base.concat(featFill(base,12-base.length));if(!base.length)base=S.prods.slice(0,24);var ids={};base.forEach(function(p){ids[p.id]=1});var all=base.concat(S.prods.filter(function(p){return !ids[p.id]}));var n=fmore?24+24*fmore:Math.min(base.length,24);return{all:all,shown:all.slice(0,n),more:all.length>n}}
function featUpd(){var fl=featList(),g=$("fgrid");if(g)g.innerHTML=fl.shown.map(pcard).join("");var b=$("fmbtn");if(b&&!fl.more&&b.parentNode)b.parentNode.removeChild(b)}
function hdrStyle(){var h=S.s&&S.s.hdr;return h==="white"||h==="white2"||h==="white3"?h:"blue"}
function hcl(){var h=hdrStyle();return h==="blue"?"":"hw "+({white:"hv1",white2:"hv2",white3:"hv3"})[h]}
function brandLogo(){var g=(S.s&&S.s.lg)||{},w=hdrStyle()!=="blue",hz=w?g.hm:g.h,ic=w?g.im:g.i;if(!hz)return brandH();return'<img class="blogo hz" src="'+esc(rpImg(hz))+'" alt="'+esc(String(tv("brand")))+'">'+(ic?'<img class="blogo ic" src="'+esc(rpImg(ic))+'" alt="">':"")}
function footLogo(){var g=(S.s&&S.s.lg)||{};return g.h?'<div class="flog"><img src="'+esc(rpImg(g.h))+'" alt="'+esc(String(tv("brand")))+'"></div>':""}
function kmClose(){var p=document.querySelector(".kp"),b=document.querySelector(".kb");if(p)p.hidden=true;if(b)b.setAttribute("aria-expanded","false")}
function kmenu(){
  var h='<div class="kmw"><button class="kb" type="button" data-act="km" aria-label="Abrir o menu" aria-expanded="false" aria-haspopup="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="2.4"/><circle cx="12" cy="12" r="2.4"/><circle cx="12" cy="19" r="2.4"/></svg></button><div class="kp" hidden role="menu" aria-label="Menu do site">';
  h+='<div class="kph"><b>'+T("menuT")+'</b><button class="kx" type="button" data-act="km" aria-label="Fechar o menu">×</button></div><div class="kpb">';
  h+='<a class="kall" href="#produtos"><span class="kai">'+IC.all+'</span><span>'+T("allT")+'</span><i aria-hidden="true">›</i></a>';
  if(cartOn())h+='<a class="kall kall2" href="#carrinho"><span class="kai">'+CRI+'</span><span>'+T("cartT")+'<span class="cbadge cbs"'+(cCount()?"":" hidden")+'>'+cCount()+'</span></span><i aria-hidden="true">›</i></a>';
  h+='<a class="kall kall2" href="#comparar"><span class="kai">'+IC.cmp+'</span><span>'+T("cmpPg")+'</span><i aria-hidden="true">›</i></a>';
  h+='<div class="kt">'+T("kcat")+'</div><div class="kgrid">'+vcats().map(function(c){return'<button class="kc" type="button" data-act="gc" data-id="'+esc(c.id)+'">'+catIcon(c)+'<span>'+esc(c.n)+'</span></button>'}).join("")+'</div></div>';
  h+='<div class="kpf"><div class="kt">'+T("kfT")+'</div><div class="kacts">'+kacts()+'</div>'+(canEdit?'<button class="btn dark sm kedit" type="button" data-act="te">'+(edit?"Sair da edição":"Editar site")+'</button>':'')+'</div>';
  return h+'</div></div>';
}
function legalFoot(){return'<div class="lgv" role="note"><p><b>Catálogo digital e vitrine virtual.</b> Este site tem finalidade exclusivamente informativa e apresenta os produtos trabalhados pela '+esc(String(tv("brand")))+'. Não realizamos vendas, pagamentos ou fechamento de pedidos por esta plataforma. Preços, disponibilidade e condições comerciais são informados pela nossa equipe pelo WhatsApp, por telefone ou na loja física, onde as compras são realizadas.</p><nav class="lgl" aria-label="Informações legais"><a href="termos.html">Termos de Uso</a><a href="termos.html#privacidade">Política de Privacidade</a><a href="#contato">Contato</a><button type="button" class="avxf" data-act="rep" data-id="">Reportar problema no site</button></nav></div>'}
/* === Edição em massa, Mais vendidos dinâmico e Novidades === */
var NOV_DIAS=30,ORC={},MS=null;
function pDate(p){return Math.max(Number(p.up)||0,Number(p.ts)||0)}
var NOV_MAX=500,NOVC={k:"",s:null};
function novSet(){var k=S.prods.length+":"+(S.ver||0)+":"+(window.NOVV||0);if(NOVC.k!==k||!NOVC.s){var a=S.prods.filter(function(p){return pDate(p)>0}).sort(function(x,y){return pDate(y)-pDate(x)}).slice(0,NOV_MAX),s={};a.forEach(function(p){s[p.id]=1});NOVC={k:k,s:s}}return NOVC.s}
function isNovo(p){return!!novSet()[p.id]}
function novList(){return S.prods.filter(isNovo).sort(function(a,b){return((b.img?1:0)-(a.img?1:0))||(pDate(b)-pDate(a))})}
function novSec(){if(S.s&&S.s.nov==="0")return"";var a=novList().filter(function(p){return p.img});if(a.length<4)return"";
  return'<section class="nvs" style="padding:16px 0"><div class="wrap"><h2 class="sh">Novidades <small>os últimos produtos que chegaram ou foram atualizados</small></h2><div id="nvgrid" class="g4">'+a.slice(0,48).map(pcard).join("")+'</div><p class="frow nvbr2"><button class="btn dark" type="button" id="nvmore" data-act="nvmore">Ver mais novidades</button><a class="btn" href="#novidades">Ver todas as novidades</a></p></div></section>'}
function novBanners(){if(S.s&&S.s.nov==="0")return[];var a=novList().filter(function(p){return p.img&&String(p.d||"").length>50}),seen={},pick=[];
  a.forEach(function(p){var k=norm(p.brand||"")+"|"+(p.c||"");if(pick.length<5&&!seen[k]){seen[k]=1;pick.push(p)}});
  if(pick.length<5)a.forEach(function(p){if(pick.length<5&&pick.indexOf(p)<0)pick.push(p)});
  if(pick.length<2)return[];var CH=["Acabou de chegar!","Novidade na loja!","Lançamento no catálogo!","Confira esta novidade!","Chegou para facilitar seu trabalho!"];
  return pick.map(function(p,i){return{nv:1,p:p,k:CH[i%CH.length]}})}
function novTxt(p){var d=String(p.d||"").replace(/\s+/g," ").trim(),m=/^(.{40,190}?[.!?])(\s|$)/.exec(d);d=m?m[1]:(d.length>170?d.slice(0,170).replace(/\s+\S*$/,"")+"…":d);return d}
function novSlide(b,i,n){var p=b.p;return'<div class="sl nvsl'+(i===bi?" on":"")+'" role="group" aria-label="'+(i+1)+' de '+n+'"><div class="wrap sin nvin"><div class="nvtx"><span class="nvtag">NOVIDADE</span><b class="nvk">'+esc(b.k)+'</b><h2>'+esc(p.n)+'</h2>'+(p.brand?'<span class="nvbr">'+esc(p.brand)+'</span>':'')+'<p>'+esc(novTxt(p))+'</p><div class="nvbt"><button class="btn" type="button" data-act="bgo" data-id="p:'+esc(p.id)+'">Ver produto</button><button class="btn nvall" type="button" data-act="bgo" data-id="__nov">Todas as novidades</button></div></div><button class="nvph" type="button" data-act="bgo" data-id="p:'+esc(p.id)+'" aria-label="Ver '+esc(p.n)+'"><img src="'+esc(rpImg(p.img))+'" alt="'+esc(p.n)+'" loading="lazy"></button></div></div>'}
function prodSig(p){var o={};Object.keys(p).sort().forEach(function(k){if(k!=="ts"&&k!=="up"&&k!=="et")o[k]=p[k]});return JSON.stringify(o)}
function rpMerge(E,Dp,ver,del){var dm={},sm={},seen={},out=[];(del||[]).forEach(function(i){dm[i]=1});(Dp||[]).forEach(function(p){sm[p.id]=p});
  E.forEach(function(e){if(dm[e.id])return;var s=sm[e.id];seen[e.id]=1;
    if(s&&s.et){out.push(s);return}
    if(s){if(!e.ts&&s.ts)e.ts=s.ts;if(prodSig(e)!==prodSig(s)){if(!((Number(e.up)||0)>(Number(s.up)||0)))e.up=ver||Date.now()}else if(s.up&&!((Number(e.up)||0)>s.up))e.up=s.up}
    else if(!e.ts&&!e.up)e.up=ver||Date.now();
    out.push(e)});
  (Dp||[]).forEach(function(s){if(!seen[s.id]&&!dm[s.id]&&(s.et||s.ts))out.push(s)});
  return out}
/* contagem anônima de pedidos de orçamento */
function orcLoad(){if(!rpOn())return;try{fetch(rpBase()+"/rest/v1/orc_contagem?select=pid,n&order=n.desc&limit=300",{headers:{apikey:RPC.key},cache:"no-store"}).then(function(r){return r.ok?r.json():[]}).then(function(a){var o={};(a||[]).forEach(function(x){if(x&&x.pid&&x.n>0)o[x.pid]=x.n});ORC=o;if(!view&&!pg)featUpd()}).catch(function(){})}catch(e){}}
function orcHit(ids){if(!rpOn()||canEdit)return;var k="rp_orc_v1",d=new Date().toISOString().slice(0,10),m={};try{m=JSON.parse(localStorage.getItem(k)||"{}")||{}}catch(e){}
  if(m.d!==d)m={d:d,ids:{}};var nw=(ids||[]).filter(function(i,ix,a){return i&&a.indexOf(i)===ix&&!m.ids[i]}).slice(0,60);if(!nw.length)return;nw.forEach(function(i){m.ids[i]=1});try{localStorage.setItem(k,JSON.stringify(m))}catch(e){}
  try{fetch(rpBase()+"/rest/v1/rpc/orc_registrar",{method:"POST",keepalive:true,headers:{apikey:RPC.key,"Content-Type":"application/json"},body:JSON.stringify({ids:nw})}).catch(function(){})}catch(e){}}
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest('a[href^="https://wa.me/"]');if(!a)return;var ids=[];
  if(a.id==="cwa"){try{ids=cLines().map(function(x){return x.id})}catch(er){}}
  else if(view&&a.classList.contains("xl"))ids=[view];
  else{var sc=a.closest(".sc[data-id]");if(sc)ids=[sc.getAttribute("data-id")]}
  if(ids.length)orcHit(ids)},true);
/* edição em massa */
function msNew(){return{q:"",br:"",c:"",ft:"",nv:"",sel:{},lim:100}}
function msItems(){if(!MS)MS=msNew();var q=norm(MS.q.trim());return S.prods.filter(function(p){
  if(q&&!qm(norm(p.n+" "+(p.brand||"")+" "+(p.code||"")),q))return false;
  if(MS.br==="-"?!!p.brand:(MS.br&&p.brand!==MS.br))return false;
  if(MS.c&&p.c!==MS.c)return false;
  var hasF=!!(p.img||(p.gal&&p.gal.length));
  if(MS.ft==="sem"&&hasF)return false;if(MS.ft==="com"&&!hasF)return false;
  if(MS.nv==="nov"&&!isNovo(p))return false;if(MS.nv==="star"&&!p.star)return false;if(MS.nv==="nw"&&!p.nw)return false;if(MS.nv==="desc"&&String(p.d||"").length>40)return false;
  return true})}
function msSelIds(){return Object.keys(MS.sel).filter(function(i){return MS.sel[i]})}
function massPage(){if(!MS)MS=msNew();var it=msItems(),ns=msSelIds().length,bc={},semF=0;
  S.prods.forEach(function(p){bc[p.brand||""]=(bc[p.brand||""]||0)+1;if(!(p.img||(p.gal&&p.gal.length)))semF++});
  var brs=Object.keys(bc).filter(Boolean).sort(function(a,b){return norm(a).localeCompare(norm(b))});
  var h='<div class="pp ms" id="ms"><div class="wrap"><div class="mshd"><div><h1>Edição em massa</h1><p class="note">Filtre, marque os produtos e aplique a mesma mudança em todos de uma vez. Os clientes só veem depois de <b>Publicar alterações</b>. '+semF+' de '+S.prods.length+' produtos ainda estão sem foto.</p></div><div class="msbt"><button class="btn sm" type="button" data-act="pub"'+(dirty?'':' disabled')+'>Publicar alterações</button><a class="btn dark sm" href="#inicio">Voltar ao site</a></div></div>';
  h+='<div class="msf"><label class="msq"><span>Nome, código ou marca</span><input id="msq" type="search" placeholder="Ex.: parafuso sextavado" value="'+esc(MS.q)+'"></label>';
  h+='<label><span>Marca</span><select id="msbr"><option value="">Todas as marcas</option><option value="-"'+(MS.br==="-"?" selected":"")+'>Sem marca</option>'+brs.map(function(b){return'<option value="'+esc(b)+'"'+(MS.br===b?" selected":"")+'>'+esc(b)+' ('+bc[b]+')</option>'}).join("")+'</select></label>';
  h+='<label><span>Categoria</span><select id="msc"><option value="">Todas as categorias</option>'+S.cats.map(function(c){return'<option value="'+esc(c.id)+'"'+(MS.c===c.id?" selected":"")+'>'+esc(c.n)+'</option>'}).join("")+'</select></label>';
  h+='<label><span>Foto</span><select id="msft"><option value="">Com e sem foto</option><option value="sem"'+(MS.ft==="sem"?" selected":"")+'>Sem foto</option><option value="com"'+(MS.ft==="com"?" selected":"")+'>Com foto</option></select></label>';
  h+='<label><span>Outros</span><select id="msnv"><option value="">Todos</option><option value="nov"'+(MS.nv==="nov"?" selected":"")+'>Novidades (500 mais recentes)</option><option value="star"'+(MS.nv==="star"?" selected":"")+'>Fixos em Mais vendidos</option><option value="nw"'+(MS.nv==="nw"?" selected":"")+'>Marcados como lançamento</option><option value="desc"'+(MS.nv==="desc"?" selected":"")+'>Descrição curta ou vazia</option></select></label>';
  h+='<button class="lnk2" type="button" data-ms="clrf" title="Volta todos os filtros ao padrão.">Limpar filtros</button></div>';
  h+='<div class="mscnt"><b id="msn">'+it.length+'</b>&nbsp;encontrados · <b>'+ns+'</b>&nbsp;selecionados <button class="btn dark sm" type="button" data-ms="all" title="Marca todos os produtos que aparecem com os filtros atuais.">Selecionar os '+it.length+' encontrados</button>'+(ns?'<button class="lnk2" type="button" data-ms="none" title="Desmarca todos os produtos.">Desmarcar todos</button>':'')+'</div><p class="mshelp">Dica: clique e arraste com o botão esquerdo do mouse por cima dos produtos para marcar vários de uma vez (comece num produto já marcado para desmarcar).</p>';
  h+='<div class="msl">'+it.slice(0,MS.lim).map(function(p){var c=catOf(p.c)||{i:"🔩",n:""},on=!!MS.sel[p.id],hf=!!(p.img||(p.gal&&p.gal.length));
    return'<label class="msr'+(on?" on":"")+'"><input type="checkbox" data-ms="tg" data-id="'+esc(p.id)+'"'+(on?" checked":"")+'><span class="msi">'+(p.img?'<img src="'+esc(rpImg(p.img))+'" alt="" loading="lazy">':catIcon(c))+'</span><span class="mst"><b>'+esc(p.n)+'</b><small>'+(p.brand?esc(p.brand)+' · ':'')+(p.code?'Cód. '+esc(p.code)+' · ':'')+esc(c.n||"")+(hf?'':' · <i>sem foto</i>')+(p.gal&&p.gal.length>1?' · '+p.gal.length+' fotos':'')+'</small></span><button class="lnk2" type="button" data-ms="ed" title="Abre o formulário completo deste produto" data-id="'+esc(p.id)+'">Editar</button></label>'}).join("")+'</div>';
  if(it.length>MS.lim)h+='<p class="frow"><button class="btn dark" type="button" data-ms="more">Mostrar mais ('+(it.length-MS.lim)+' restantes)</button></p>';
  if(!it.length)h+='<p class="note" style="padding:20px 0">Nenhum produto com esses filtros.</p>';
  h+='</div>';
  h+='<div class="msa"'+(ns?'':' hidden')+'><div class="wrap"><b>'+ns+' selecionado'+(ns>1?'s':'')+'</b><button class="btn sm" type="button" data-ms="foto" title="Envia uma foto (do computador ou por link da internet) e aplica nos produtos marcados. Você escolhe se ela substitui as fotos, vira a principal, entra no fim ou só vai nos que estão sem foto.">Foto</button><button class="btn sm" type="button" data-ms="copia" title="Pega a foto de um produto que já tem foto (pelo código ou nome) e copia para os produtos marcados.">Copiar foto de outro produto</button><button class="btn dark sm" type="button" data-ms="rmf" title="Apaga todas as fotos dos produtos marcados.">Remover fotos</button><button class="btn dark sm" type="button" data-ms="cat" title="Muda a categoria de todos os produtos marcados de uma vez.">Categoria</button><button class="btn dark sm" type="button" data-ms="mar" title="Muda a marca de todos os produtos marcados de uma vez.">Marca</button><button class="btn dark sm" type="button" data-ms="sel" title="Coloca ou tira os selos dos produtos marcados: fixar em “Mais vendidos” e selo de lançamento.">Selos</button><button class="btn dark sm msdel" type="button" data-ms="del" title="Exclui do catálogo os produtos marcados. Pede para digitar EXCLUIR antes de apagar.">Excluir</button></div></div>';
  return h+'</div>'}
var msT=null;
function massBind(){var r=$("ms");if(!r)return;
  var q=$("msq");if(q){q.addEventListener("input",function(){clearTimeout(msT);msT=setTimeout(function(){MS.q=q.value;MS.lim=100;var pos=q.selectionStart;render();var n=$("msq");if(n){n.focus();try{n.setSelectionRange(pos,pos)}catch(e){}}},250)})}
  [["msbr","br"],["msc","c"],["msft","ft"],["msnv","nv"]].forEach(function(x){var el=$(x[0]);if(el)el.addEventListener("change",function(){MS[x[1]]=el.value;MS.lim=100;render()})});
  r.addEventListener("change",function(e){var cb=e.target.closest('[data-ms="tg"]');if(!cb)return;var id=cb.getAttribute("data-id");if(cb.checked)MS.sel[id]=1;else delete MS.sel[id];msRefresh()});
  r.addEventListener("click",function(e){var b=e.target.closest("[data-ms]");if(!b||b.getAttribute("data-ms")==="tg")return;e.preventDefault();var k=b.getAttribute("data-ms");
    if(k==="all"){msItems().forEach(function(p){MS.sel[p.id]=1});render()}
    else if(k==="none"){MS.sel={};render()}
    else if(k==="more"){MS.lim+=200;render()}
    else if(k==="clrf"){var s=MS.sel;MS=msNew();MS.sel=s;render()}
    else if(k==="ed")prodForm(b.getAttribute("data-id"));
    else msAction(k)});
  var ml=r.querySelector(".msl");if(ml)ml.addEventListener("mousedown",function(e){if(e.button!==0||e.target.closest("input,button,a,select,textarea"))return;
    var sx=e.pageX,sy=e.pageY,box=null,moved=false,hit={},r0=e.target.closest(".msr"),c0=r0&&r0.querySelector('[data-ms="tg"]'),mode=c0?!MS.sel[c0.getAttribute("data-id")]:true,lx=e.clientX,ly=e.clientY,tm=null;
    function paint(){var px=lx+window.scrollX,py=ly+window.scrollY,x1=Math.min(sx,px),y1=Math.min(sy,py),x2=Math.max(sx,px),y2=Math.max(sy,py);
      box.style.left=x1+"px";box.style.top=y1+"px";box.style.width=(x2-x1)+"px";box.style.height=(y2-y1)+"px";
      ml.querySelectorAll(".msr").forEach(function(el){var b=el.getBoundingClientRect(),bx1=b.left+window.scrollX,by1=b.top+window.scrollY,cb=el.querySelector('[data-ms="tg"]'),id=cb.getAttribute("data-id"),ins=bx1<x2&&bx1+b.width>x1&&by1<y2&&by1+b.height>y1;
        if(ins){hit[id]=1;el.classList.toggle("on",mode);cb.checked=mode}else if(hit[id]){delete hit[id];el.classList.toggle("on",!!MS.sel[id]);cb.checked=!!MS.sel[id]}})}
    function mv(ev){lx=ev.clientX;ly=ev.clientY;if(!moved&&Math.abs(ev.pageX-sx)+Math.abs(ev.pageY-sy)<8)return;ev.preventDefault();
      if(!moved){moved=true;box=document.createElement("div");box.className="msbox";document.body.appendChild(box);tm=setInterval(function(){var h=window.innerHeight;if(ly>h-50){window.scrollBy(0,18);paint()}else if(ly<50){window.scrollBy(0,-18);paint()}},30)}
      paint()}
    function up(){document.removeEventListener("mousemove",mv);document.removeEventListener("mouseup",up);clearInterval(tm);if(box)box.remove();
      if(moved){Object.keys(hit).forEach(function(id){if(mode)MS.sel[id]=1;else delete MS.sel[id]});var sup=function(ce){ce.preventDefault();ce.stopPropagation()};document.addEventListener("click",sup,true);setTimeout(function(){document.removeEventListener("click",sup,true)},60);msRefresh()}}
    document.addEventListener("mousemove",mv);document.addEventListener("mouseup",up)});
}
function msRefresh(){var y=window.scrollY;render();window.scrollTo(0,y)}
function msSel(){return S.prods.filter(function(p){return MS.sel[p.id]})}
function msDone(n,txt){var y=window.scrollY;setTimeout(function(){window.scrollTo(0,y);try{cToast(n+" produto"+(n>1?"s":"")+" "+txt)}catch(e){}},30)}
function msAction(k){var ps=msSel(),n=ps.length;if(!n)return;var now=Date.now(),lbl=n+" produto"+(n>1?"s":"")+" selecionado"+(n>1?"s":"");
  if(k==="foto"){if(!assets){alert("Entre como administrador para enviar fotos.");return}
    openForm("Foto para "+lbl,[{k:"img",l:"Escolha a foto (a mesma vai para todos os selecionados)",t:"file",a:"image/*"},{k:"url",l:"Ou cole o link de uma foto da internet (opcional)"},{k:"md",l:"Como usar a foto",t:"select",v:"sub",o:[["sub","Trocar: esta passa a ser a única foto"],["pri","Colocar como foto principal e manter as outras"],["add","Adicionar no fim das fotos"],["vaz","Só nos que estão sem foto (os outros ficam como estão)"]]}],"Aplicar",async function(v){
      var src="";if(v.img&&v.img.length){var r=await assets.upload(v.img[0]);src=r.id}else if(/^https?:\/\/\S+$/i.test(v.url||""))src=v.url;
      if(!src)return"Escolha uma foto ou cole o link de uma foto.";msPhoto(ps,src,v.md,now);msDone(n,"atualizado"+(n>1?"s":""))},"Dica: use os filtros para achar, por exemplo, todos os parafusos sextavados sem foto, marque e aplique a mesma foto.");return}
  if(k==="copia"){openForm("Copiar foto para "+lbl,[{k:"cod",l:"Código ou nome do produto que já tem a foto certa"},{k:"md",l:"Como usar a foto",t:"select",v:"sub",o:[["sub","Trocar: esta passa a ser a única foto"],["pri","Colocar como foto principal e manter as outras"],["add","Adicionar no fim das fotos"],["vaz","Só nos que estão sem foto"]]},{k:"all",l:"Quais fotos copiar",t:"select",v:"1",o:[["1","Só a foto principal"],["all","Todas as fotos dele"]]}],"Aplicar",function(v){
      var q=norm(v.cod||"").trim();if(!q)return"Digite o código ou o nome.";var src=S.prods.filter(function(p){return p.img&&(norm(p.code||"")===q)})[0]||S.prods.filter(function(p){return p.img&&qm(norm(p.n+" "+(p.code||"")),q)})[0];
      if(!src)return"Não achei produto com foto para “"+v.cod+"”.";var fs=v.all==="all"&&src.gal&&src.gal.length?src.gal.slice():[src.img];
      ps.forEach(function(p){if(p.id===src.id)return;if(v.md==="vaz"&&(p.img||(p.gal&&p.gal.length)))return;var g=p.gal&&p.gal.length?p.gal.slice():(p.img?[p.img]:[]);
        if(v.md==="add")g=g.concat(fs.filter(function(x){return g.indexOf(x)<0}));else if(v.md==="pri")g=fs.concat(g.filter(function(x){return fs.indexOf(x)<0}));else g=fs.slice();
        p.gal=g;p.img=g[0]||"";p.et=now;p.up=now});msDone(n,"com a foto de “"+src.n+"”")});return}
  if(k==="rmf"){openForm("Remover fotos",[],"Remover",function(){ps.forEach(function(p){p.gal=[];p.img="";p.et=now})},"Tirar todas as fotos de "+lbl+"?");return}
  if(k==="cat"){openForm("Categoria de "+lbl,[{k:"c",l:"Nova categoria",t:"select",v:ps[0].c,o:S.cats.map(function(c){return[c.id,c.n]})}],"Aplicar",function(v){ps.forEach(function(p){p.c=v.c;p.et=now})});return}
  if(k==="mar"){openForm("Marca de "+lbl,[{k:"b",l:"Nova marca (cadastre em “Marcas” se não estiver na lista)",t:"select",v:ps[0].brand||"",o:brandOpts(ps[0].brand)}],"Aplicar",function(v){ps.forEach(function(p){p.brand=v.b;p.et=now})});return}
  if(k==="sel"){openForm("Selos de "+lbl,[{k:"st",l:"Fixar em “Mais vendidos” (além dos mais pedidos automaticamente)",t:"select",v:"",o:[["","Não mudar"],["1","Fixar"],["0","Tirar"]]},{k:"nw",l:"Selo de lançamento",t:"select",v:"",o:[["","Não mudar"],["1","Marcar"],["0","Tirar"]]}],"Aplicar",function(v){ps.forEach(function(p){if(v.st)p.star=v.st==="1";if(v.nw)p.nw=v.nw==="1";p.et=now})});return}
  if(k==="del"){openForm("Excluir produtos",[{k:"ok",l:"Para confirmar, digite EXCLUIR"}],"Excluir",function(v){if(String(v.ok||"").toUpperCase()!=="EXCLUIR")return"Digite EXCLUIR para confirmar.";var ids={};ps.forEach(function(p){ids[p.id]=1});S.prods=S.prods.filter(function(p){return!ids[p.id]});S.del=(S.del||[]).concat(Object.keys(ids));MS.sel={}},"Excluir do catálogo "+lbl+"? Isso não pode ser desfeito depois de publicar.");return}
}
function msPhoto(ps,src,md,now){ps.forEach(function(p){var hf=!!(p.img||(p.gal&&p.gal.length));if(md==="vaz"&&hf)return;var g=p.gal&&p.gal.length?p.gal.slice():(p.img?[p.img]:[]);
  if(md==="add"){if(g.indexOf(src)<0)g.push(src)}else if(md==="pri"){g=[src].concat(g.filter(function(x){return x!==src}))}else g=[src];
  p.gal=g;p.img=g[0];p.et=now;p.up=now});window.NOVV=(window.NOVV||0)+1}
/* fotos atuais no formulário do produto */
function galName(u){u=String(u||"");var s=u.split("?")[0].split("/").pop()||u;try{s=decodeURIComponent(s)}catch(e){}return s.length>42?s.slice(0,18)+"…"+s.slice(-20):s}
function galEdH(x){return'<label>'+esc(x.l)+' <small class="note">(a primeira é a foto principal; use as setas para mudar a ordem)</small></label><input type="hidden" id="f_'+x.k+'" value="'+esc(x.v)+'"><div class="gle" data-gk="'+x.k+'">'+galRows(JSON.parse(x.v||"[]"))+'</div>'}
function galRows(g){if(!g.length)return'<p class="note">Sem fotos. Use o campo abaixo para adicionar.</p>';var n=g.length;return g.map(function(u,i){return'<div class="glr'+(i?"":" pri")+'"><span class="glth"><img src="'+esc(rpImg(u))+'" alt="" loading="lazy"></span><span class="gln"><b>'+(i?"Foto "+(i+1):"Foto principal")+'</b><small title="'+esc(u)+'">'+esc(galName(u))+'</small></span><span class="glb"><button type="button" data-ga="top" data-i="'+i+'"'+(i?"":" disabled")+' title="Tornar principal">★</button><button type="button" data-ga="up" data-i="'+i+'"'+(i?"":" disabled")+' title="Subir" aria-label="Subir">▲</button><button type="button" data-ga="dn" data-i="'+i+'"'+(i<n-1?"":" disabled")+' title="Descer" aria-label="Descer">▼</button><button type="button" data-ga="end" data-i="'+i+'"'+(i<n-1?"":" disabled")+' title="Mandar para o fim">⤓</button><button type="button" class="glx" data-ga="rm" data-i="'+i+'" title="Remover esta foto" aria-label="Remover">✕</button></span></div>'}).join("")+(n>1?'<button type="button" class="lnk2 glrma" data-ga="all">Remover todas as fotos</button>':'')}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-ga]");if(!b)return;e.preventDefault();var box=b.closest(".gle");if(!box)return;var inp=$("f_"+box.getAttribute("data-gk"));if(!inp)return;var g=[];try{g=JSON.parse(inp.value||"[]")}catch(er){}
  var i=Number(b.getAttribute("data-i")),k=b.getAttribute("data-ga"),x=g[i];
  if(k==="all")g=[];else if(k==="rm")g.splice(i,1);else if(k==="top"&&i>0){g.splice(i,1);g.unshift(x)}else if(k==="up"&&i>0){g[i]=g[i-1];g[i-1]=x}else if(k==="dn"&&i<g.length-1){g[i]=g[i+1];g[i+1]=x}else if(k==="end"&&i<g.length-1){g.splice(i,1);g.push(x)}
  inp.value=JSON.stringify(g);box.innerHTML=galRows(g)});
var TVI='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16.5v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.7 2 2 0 0 1 3.1 1.5h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.1 9.3a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>';
function tvH(){var ph=String((S.s&&S.s.phone)||"").trim();if(!ph)return"";return'<a class="hdtv" data-ed="s:phone" href="'+tel()+'" aria-label="Televendas: '+esc(ph)+'" title="Ligar para a loja">'+TVI+'<span><small>Televendas</small><b>'+esc(ph)+'</b></span></a>'}
function topCats(n){var ct={};S.prods.forEach(function(p){ct[p.c]=(ct[p.c]||0)+1});return vcats().slice().sort(function(a,b){return(ct[b.id]||0)-(ct[a.id]||0)}).slice(0,n)}
function catBar(){var cs=vcats();if(!cs.length)return"";var cur=pg==="cat"?pv:"";
  var h='<div class="kcb"><div class="wrap"><div class="kcw"><button class="kcbt" type="button" data-act="kcd" aria-expanded="false" aria-haspopup="true" aria-label="Categorias"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span class="kcbl">Categorias</span><svg class="chev" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>';
  h+='<div class="kcp" hidden role="menu" aria-label="Todas as categorias"><div class="kcs"><a class="kca" href="#produtos">'+IC.all+'<span>Ver todos os produtos</span><i aria-hidden="true">›</i></a><a class="kca kca2" href="#comparar">'+IC.cmp+'<span>'+T("cmpPg")+'</span><i aria-hidden="true">›</i></a><div class="kcg">'+cs.map(function(c){return'<button class="kci'+(c.id===cur?' on':'')+'" type="button" role="menuitem" data-act="gc" data-id="'+esc(c.id)+'">'+catIcon(c)+'<span>'+esc(c.n)+'</span></button>'}).join("")+'</div></div>'+kcContact()+'</div></div>';
  var lgh=S.s&&S.s.lg&&(S.s.lg.hm||S.s.lg.h);if(lgh)h+='<a class="kclg" href="#inicio" aria-label="'+esc(String(tv("brand")))+' - página inicial"><img src="'+esc(rpImg(lgh))+'" alt="'+esc(String(tv("brand")))+'"></a>';h+=(typeof bibTick==="function"?bibTick():"");
  h+='<div class="kql">'+topCats(6).map(function(c){return'<button class="'+(c.id===cur?'on':'')+'" type="button" data-act="gc" data-id="'+esc(c.id)+'">'+esc(c.n)+'</button>'}).join("")+'</div></div></div>';
  return h}
function kcContact(){var a=kacts();return a?'<div class="kcf"><div class="kcft">'+T("kfT")+'</div><div class="kcacts">'+a.replace(/class="act /g,'class="act sm ')+'</div></div>':""}
function kcClose(){var p=document.querySelector(".kcp"),b=document.querySelector(".kcbt");if(p)p.hidden=true;if(b)b.setAttribute("aria-expanded","false")}
function waFabNum(){return waOwn()?waNum():"5563984514163"}
function waFab(){return'<a class="wfab" href="https://wa.me/'+waFabNum()+'?text='+encodeURIComponent("Olá! Vim pelo site do "+tv("brand")+" e gostaria de atendimento.")+'" target="_blank" rel="noopener" aria-label="Falar no WhatsApp" title="Falar no WhatsApp">'+IC.wa+'</a>'}
document.addEventListener("keydown",function(e){if(e.key==="Escape")kcClose()});
/* fotos reduzidas no envio + vídeo por link */
function shrinkImg(f){return new Promise(function(ok){try{
  if(!f||!/^image\//i.test(f.type||"")||/gif|svg/i.test(f.type||"")||f.size<250*1024)return ok(f);
  var u=URL.createObjectURL(f),im=new Image();
  im.onload=function(){try{var M=1600,w=im.naturalWidth,h=im.naturalHeight,s=Math.min(1,M/Math.max(w,h)),c=document.createElement("canvas");c.width=Math.round(w*s);c.height=Math.round(h*s);
    var x=c.getContext("2d"),png=/png/i.test(f.type);x.drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);
    var base=String(f.name||"foto").replace(/\.[^.]+$/,"");
    c.toBlob(function(b){
      if(b&&b.type==="image/webp"&&b.size<f.size)return ok(new File([b],base+".webp",{type:"image/webp"}));
      if(png)return ok(f);
      var c2=document.createElement("canvas");c2.width=c.width;c2.height=c.height;var y=c2.getContext("2d");y.fillStyle="#fff";y.fillRect(0,0,c2.width,c2.height);y.drawImage(c,0,0);
      c2.toBlob(function(j){ok(j&&j.size<f.size?new File([j],base+".jpg",{type:"image/jpeg"}):f)},"image/jpeg",0.85)
    },"image/webp",0.82)}catch(e){ok(f)}};
  im.onerror=function(){URL.revokeObjectURL(u);ok(f)};im.src=u}catch(e){ok(f)}})}
function vidEmb(u){u=String(u||"").trim();var m;
  if(m=/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/))([\w-]{11})/i.exec(u))return{t:"yt",id:m[1],vert:/shorts\//i.test(u),src:"https://www.youtube-nocookie.com/embed/"+m[1]+"?autoplay=1&rel=0&playsinline=1",th:"https://i.ytimg.com/vi/"+m[1]+"/hqdefault.jpg"};
  if(m=/instagram\.com\/(?:[\w.]+\/)?(p|reel|reels|tv)\/([\w-]+)/i.exec(u))return{t:"ig",id:m[2],vert:m[1]!=="p",src:"https://www.instagram.com/"+(m[1]==="p"?"p":"reel")+"/"+m[2]+"/embed"};
  return null}
function vidFac(u){var e=vidEmb(u);if(!e)return"";var play='<span class="vfp" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>';
  return'<div class="vfc'+(e.vert?" vrt":"")+'"><button class="vfb" type="button" data-vplay="'+esc(e.src)+'" aria-label="Assistir ao vídeo">'+(e.t==="yt"?'<img src="'+esc(e.th)+'" alt="" loading="lazy">':'<span class="vfig">'+IC.ig+'<b>Vídeo da loja no Instagram</b></span>')+play+'<span class="vft">Toque para assistir</span></button></div>'}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-vplay]");if(!b)return;e.preventDefault();var f=document.createElement("iframe");f.src=b.getAttribute("data-vplay");f.title="Vídeo da loja";f.allow="autoplay; encrypted-media; picture-in-picture; fullscreen";f.allowFullscreen=true;f.setAttribute("frameborder","0");b.parentNode.replaceChild(f,b)});
/* busca: também procura na descrição, ficha técnica e categoria */
var SRI=null,SRK=new WeakMap();
function srDesc(p,t){var k=SRK.get(p);if(!k||k.v!==(p.d||"")+(p.s||"")){var c=catOf(p.c);k={v:(p.d||"")+(p.s||""),x:norm([p.d,p.s,p.cg,p.more,p.cmp,c?c.n:""].filter(Boolean).join(" "))};SRK.set(p,k)}return qm(k.x,t,1)}
/* telefones da loja: os dois atendem ligação e WhatsApp */
function fNums(){var s=S.s||{},a=[],f=String(s.phone||"").replace(/\D/g,""),w=String(s.wa||"").replace(/\D/g,"").replace(/^55(?=\d{10,11}$)/,""),c="63984514163";
  if(f)a.push({d:f,t:s.phone,l:"Telefone fixo · ligação e WhatsApp",ic:IC.tel});
  [w,c].forEach(function(n){if(n&&n!==f&&!a.some(function(x){return x.d===n}))a.push({d:n,t:fmtPhone(n),l:"Celular · ligação e WhatsApp",ic:IC.wa})});
  return a}
/* horário detalhado (conferido no perfil do Google em 11/11/2026) */
var HRS=[null,[7,18],[7,18],[7,18],[7,18],[7,18],[7,12]],HRD=["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
function hrsNow(){var d=new Date(Date.now()-3*36e5),w=d.getUTCDay(),m=d.getUTCHours()*60+d.getUTCMinutes(),h=HRS[w];
  if(h&&m>=h[0]*60&&m<h[1]*60)return{o:1,t:"Aberto agora · fecha às "+h[1]+"h"};
  if(h&&m<h[0]*60)return{o:0,t:"Fechado agora · abre hoje às "+h[0]+"h"};
  for(var i=1;i<=7;i++){var k=(w+i)%7;if(HRS[k])return{o:0,t:"Fechado agora · abre "+(i===1?"amanhã":HRD[k].toLowerCase())+" às "+HRS[k][0]+"h"}}return{o:0,t:"Fechado"}}
function hrsH(){var n=hrsNow(),w=new Date(Date.now()-3*36e5).getUTCDay(),g=mapUrl();
  return'<span class="hst '+(n.o?"on":"off")+'">'+n.t+'</span><details class="hrd"><summary>Ver horários da semana</summary><table>'+[1,2,3,4,5,6,0].map(function(k){var h=HRS[k];return'<tr'+(k===w?' class="hoje"':'')+'><td>'+HRD[k]+(k===w?' <small>(hoje)</small>':'')+'</td><td>'+(h?(h[0]<10?"0":"")+h[0]+":00 às "+h[1]+":00":"Fechado")+'</td></tr>'}).join("")+'</table>'+(g?'<a class="hrg" href="'+esc(g)+'" target="_blank" rel="noopener">Feriados e horários especiais no Google ›</a>':'')+'</details>'}
/* Mais vendidos: completa com produtos variados com foto (um por categoria), trocando a cada semana; os mais pedidos ficam por cima */
function featFill(base,n){if(n<=0)return[];var ex={};base.forEach(function(p){ex[p.id]=1});var wk=Math.floor(Date.now()/6048e5),by={},cs=[];
  S.prods.forEach(function(p){if(ex[p.id]||!p.img||String(p.d||"").length<40)return;if(!by[p.c]){by[p.c]=[];cs.push(p.c)}by[p.c].push(p)});
  function h(s){var x=wk;for(var i=0;i<s.length;i++)x=(x*31+s.charCodeAt(i))|0;return x}
  cs.sort(function(a,b){return h(a)-h(b)});cs.forEach(function(c){by[c].sort(function(a,b){return h(a.id)-h(b.id)})});
  var out=[],seenB={},r=0;while(out.length<n&&r<8){cs.forEach(function(c){if(out.length>=n)return;var l=by[c],p=null;for(var i=0;i<l.length;i++){var b=norm(l[i].brand||"");if(!l[i]._u&&(r>0||!seenB[b])){p=l[i];break}}if(p){p._u=1;seenB[norm(p.brand||"")]=1;out.push(p)}});r++}
  out.forEach(function(p){delete p._u});return out}
/* Marcas da página inicial rodando sozinhas (só as que têm logo), pausa quando o cliente mexe */
var BRA={busy:0,t:0};
function brAuto(){if(BRA.t)return;BRA.t=setInterval(function(){
  if(document.hidden||BRA.busy||(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches))return;
  var w=document.querySelector(".brands .rail");if(!w||w.classList.contains("open")||w.classList.contains("fit"))return;
  var rt=w.querySelector(".rt");if(!rt||!rt.children.length)return;
  var r=rt.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
  var k=rt.children[0],gap=parseFloat(getComputedStyle(rt).columnGap)||10,step=k.offsetWidth+gap;
  if(rt.scrollLeft+rt.clientWidth>=rt.scrollWidth-4)rt.scrollTo({left:0,behavior:"smooth"});else rt.scrollBy({left:step,behavior:"smooth"})},2600);
  ["mouseover","touchstart","focusin"].forEach(function(ev){document.addEventListener(ev,function(e){if(e.target.closest&&e.target.closest(".brands")){BRA.busy=1;clearTimeout(BRA.r);BRA.r=setTimeout(function(){BRA.busy=0},ev==="mouseover"?1500:6000)}},{passive:true})})}
brAuto();
/* Novidades: mostra linhas completas (2 no início) e "Ver mais" acrescenta 2 linhas */
var NVR=2;
function novFit(){var g=$("nvgrid");if(!g)return;var cs=getComputedStyle(g).gridTemplateColumns.split(" ").filter(Boolean).length||4,lim=cs*NVR,k=g.children,b=$("nvmore");
  for(var i=0;i<k.length;i++)k[i].style.display=i<lim?"":"none";if(b)b.style.display=k.length>lim?"":"none"}
window.addEventListener("resize",function(){clearTimeout(novFit.t);novFit.t=setTimeout(novFit,150)});
new MutationObserver(function(){if($("nvgrid")&&!$("nvgrid").dataset.fit){$("nvgrid").dataset.fit=1;NVR=2;novFit()}}).observe(document.getElementById("root"),{childList:true});
/* Destaques: produto real da categoria do destaque, trocado a cada dia (horário de Brasília) */
function bnPick(b){var c=b&&b.l;if(!c||!catOf(c))return null;var day=Math.floor((Date.now()-3*36e5)/864e5),a=S.prods.filter(function(p){return p.c===c&&p.img&&String(p.d||"").length>30});if(!a.length)a=S.prods.filter(function(p){return p.c===c&&p.img});if(!a.length)return null;
  a.sort(function(x,y){return x.id<y.id?-1:1});var h=0,s=c+day;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return a[(Math.abs(h)+day*7919)%a.length]}
function bnPickH(p){return'<button class="bnp" type="button" data-act="bgo" data-id="p:'+esc(p.id)+'" aria-label="Ver '+esc(p.n)+'"><span class="bnpi"><img src="'+esc(rpImg(p.img))+'" alt="'+esc(p.n)+'" loading="lazy"></span><span class="bnpt"><small>Destaque do dia</small><b>'+esc(p.n)+'</b>'+(p.brand?'<em>'+esc(p.brand)+'</em>':'')+'<i>Ver produto ›</i></span></button>'}
/* Destaques fixos: 6 produtos reais da categoria por dia, 3 de cada vez, alternando sozinhos */
function bnPicks(b,n){var c=b&&b.l;if(!c||!catOf(c))return[];var day=Math.floor((Date.now()-3*36e5)/864e5),a=S.prods.filter(function(p){return p.c===c&&p.img&&String(p.d||"").length>30});if(a.length<n)a=S.prods.filter(function(p){return p.c===c&&p.img});if(!a.length)return[];
  a.sort(function(x,y){return x.id<y.id?-1:1});var h=0,s=c+day;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;var st=(Math.abs(h)+day*7919)%a.length,step=Math.max(1,Math.floor(a.length/n)),out=[];
  for(var j=0;j<a.length&&out.length<n;j++){var q=a[(st+j*step+Math.floor(j*step/a.length))%a.length];if(out.indexOf(q)<0)out.push(q)}return out}
function bnPicksH(b){var a=bnPicks(b,6);if(!a.length)return"";var g=[a.slice(0,3),a.slice(3,6)].filter(function(x){return x.length});
  return'<div class="bnps"><small class="bnpl">Destaques do dia</small><div class="bnpw">'+g.map(function(x,i){return'<div class="bnpg'+(i?"":" on")+'">'+x.map(function(p){return'<button class="bnm" type="button" data-act="bgo" data-id="p:'+esc(p.id)+'" aria-label="Ver '+esc(p.n)+'"><span class="bnmi"><img src="'+esc(rpImg(p.img))+'" alt="'+esc(p.n)+'" loading="lazy"></span><b>'+esc(p.n)+'</b><i>Ver ›</i></button>'}).join("")+'</div>'}).join("")+'</div></div>'}
/* troca dos 3 produtos agora é feita por bnTick (aos 4,5 s de cada destaque fixo) */
/* Destaques: arrastar para o lado no celular troca o slide */
function bnSwipe(){var x0=null,y0=0,t0=0;
  document.addEventListener("touchstart",function(e){var b=e.target.closest&&e.target.closest("#bn");if(!b||e.touches.length!==1){x0=null;return}x0=e.touches[0].clientX;y0=e.touches[0].clientY;t0=Date.now()},{passive:true});
  document.addEventListener("touchend",function(e){if(x0===null)return;var c=e.changedTouches[0],dx=c.clientX-x0,dy=c.clientY-y0;x0=null;
    if(Math.abs(dx)<40||Math.abs(dx)<Math.abs(dy)*1.2||Date.now()-t0>900)return;
    var n=document.querySelectorAll("#bn .sl").length;if(n<2)return;showBn((bi+(dx<0?1:-1)+n)%n);if(typeof startBn==="function")startBn()},{passive:true})}
bnSwipe();
/* Tempo dos Destaques: slide de novidade 5,5 s; destaque fixo 9 s, trocando os 3 produtos aos 4,5 s */
var BNS=Date.now(),BNI=-1,BN_T={nov:5500,fixo:9000,troca:4500};
function bnTick(){var now=Date.now();if(BNI!==bi){BNI=bi;BNS=now;var g0=document.querySelectorAll("#bn .sl.on .bnpg");g0.forEach(function(x,i){x.classList.toggle("on",i===0)})}
  if(bpause||document.hidden){BNS+=250;return}
  var sl=document.querySelector("#bn .sl.on");if(!sl)return;var w=sl.querySelector(".bnps"),el=now-BNS;
  if(w){var g=w.querySelectorAll(".bnpg");if(g.length>1&&el>=BN_T.troca&&g[0].classList.contains("on")){g[0].classList.remove("on");g[1].classList.add("on")}}
  if(el>=(w?BN_T.fixo:BN_T.nov))showBn(bi+1)}
/* === Avisos de erro (12/11/2026) ===
   Cliente: repOpen(pid) abre o formulário (pid vazio = problema no site). Envia pela RPC aviso_enviar (Supabase, tabela avisos),
   só texto curto; limite de 5 avisos por aparelho por dia (localStorage) e 60 por dia no banco. Só o administrador lê (RLS).
   Dono: botão "Avisos de erro" no modo edição abre avOpen() (ver produto, marcar resolvido, apagar). avCount() conta os pendentes. */
var AVN=0,AV_OK=0;
var AV_TIP={p:["Foto não corresponde ao produto","Nome ou descrição com erro","Medida ou informação técnica errada","Produto repetido ou na categoria errada","Outro"],s:["Página ou botão não funciona","Algo aparece cortado ou desalinhado","Link ou contato não abre","Site lento ou travando","Outro"]};
function avClose(){var o=document.querySelector(".avxo");if(o)o.remove();document.removeEventListener("keydown",avEsc)}
function avEsc(e){if(e.key==="Escape")avClose()}
function avShow(html,lg){avClose();var o=document.createElement("div");o.className="avxo";o.innerHTML='<div class="avxc'+(lg?" lg":"")+'" role="dialog" aria-modal="true" style="position:relative">'+html+'</div>';
  o.addEventListener("click",function(e){if(e.target===o)avClose()});document.body.appendChild(o);document.addEventListener("keydown",avEsc);return o}
function avLim(add){var k="rp_av_"+new Date().toISOString().slice(0,10),n=0;try{n=Number(localStorage.getItem(k))||0;if(add)localStorage.setItem(k,String(n+1))}catch(e){}return n}
function repLink(id){return'<p class="avxl"><button type="button" data-act="rep" data-id="'+esc(id)+'">⚠ Encontrou algum erro neste produto? Avise a gente</button></p>'}
function repOpen(pid){var p=pid?prodById(pid):null,t=AV_TIP[p?"p":"s"];
  var o=avShow('<h3>'+(p?"Reportar erro no produto":"Reportar problema no site")+'</h3><p class="avxs">'+(p?esc(p.n):"Conte o que não funcionou. Isso ajuda a gente a corrigir rápido.")+'</p>'+
  t.map(function(x,i){return'<label class="avxo2"><input type="radio" name="avt" value="'+esc(x)+'"'+(i?"":" checked")+'><span>'+esc(x)+'</span></label>'}).join("")+
  '<textarea id="avm" rows="3" maxlength="500" placeholder="Descreva o erro (opcional)"></textarea>'+
  '<input type="text" id="avc" maxlength="80" placeholder="Seu nome ou telefone (opcional, só se quiser resposta)">'+
  '<input type="text" id="avw" class="avxh" tabindex="-1" autocomplete="off" aria-hidden="true">'+
  '<p class="avxs" style="margin-top:8px">Veja a <a href="termos.html#privacidade" target="_blank" rel="noopener">Política de Privacidade</a>.</p>'+
  '<div class="avxb"><button class="btn dark sm" type="button" id="avx0">Cancelar</button><button class="btn sm" type="button" id="avx1">Enviar aviso</button></div>');
  o.querySelector("#avx0").onclick=avClose;
  o.querySelector("#avx1").onclick=function(){var b=this;if(o.querySelector("#avw").value)return avClose();
    if(avLim()>=5){avShow('<h3>Obrigado!</h3><p>Você já enviou vários avisos hoje. Se for urgente, fale com a gente pelo WhatsApp.</p><div class="avxb"><button class="btn sm" type="button" onclick="avClose()">Fechar</button></div>');return}
    var tp=(o.querySelector('input[name=avt]:checked')||{}).value||"Outro",ms=o.querySelector("#avm").value.trim().slice(0,500),ct=o.querySelector("#avc").value.trim().slice(0,80);
    var pag=(location.hash||"#inicio")+" | "+window.innerWidth+"px | "+String(navigator.userAgent||"").slice(0,120);
    b.disabled=true;b.textContent="Enviando...";
    var fim=function(ok){if(ok)avLim(1);avShow(ok?'<h3>Aviso enviado. Obrigado!</h3><p>Vamos conferir e corrigir o quanto antes.</p><div class="avxb"><button class="btn sm" type="button" onclick="avClose()">Fechar</button></div>':'<h3>Não foi possível enviar</h3><p>Tente de novo mais tarde ou fale com a gente pelo WhatsApp.</p><div class="avxb"><button class="btn sm" type="button" onclick="avClose()">Fechar</button></div>')};
    if(!rpOn())return fim(false);
    fetch(rpBase()+"/rest/v1/rpc/aviso_enviar",{method:"POST",headers:{apikey:RPC.key,"Content-Type":"application/json"},body:JSON.stringify({p_tipo:(p?"Produto: ":"Site: ")+tp,p_pid:pid||"",p_nome:p?p.n:"",p_msg:ms,p_contato:ct,p_pag:pag})}).then(function(r){fim(r.ok)}).catch(function(){fim(false)})};
}
function avBadge(){document.querySelectorAll(".avn").forEach(function(e){e.textContent=AVN?" ("+AVN+")":""})}
function avCount(){if(!SB)return;SB.rpc("avisos_novos").then(function(r){if(!r.error){AVN=Number(r.data)||0;avBadge()}})}
async function avOpen(all){if(!SB||!canEdit)return;var o=avShow('<h3>Avisos de erro</h3><p class="avxs">Carregando...</p>',1);
  var q=SB.from("avisos").select("*").order("criado",{ascending:false}).limit(200);if(!all)q=q.eq("resolvido",false);
  var r=await q;if(r.error){o.querySelector(".avxs").textContent="Erro ao carregar: "+r.error.message;return}
  var L=r.data||[],h='<h3>Avisos de erro</h3><p class="avxs">'+(all?"Todos os avisos (últimos 200).":L.length+" aviso(s) pendente(s).")+' <button class="btn dark sm" type="button" id="avall">'+(all?"Só pendentes":"Ver também os resolvidos")+'</button></p>';
  if(!L.length)h+='<p>Nenhum aviso pendente. 👍</p>';
  L.forEach(function(a){var d=new Date(a.criado);h+='<div class="avxi'+(a.resolvido?" ok":"")+'"><b>'+esc(a.tipo)+'</b>'+(a.resolvido?" · resolvido":"")+'<br><small>'+d.toLocaleDateString("pt-BR")+" "+d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})+(a.nome?" · "+esc(a.nome):"")+'</small>'+(a.msg?'<p>'+esc(a.msg)+'</p>':'')+(a.contato?'<p>Contato: '+esc(a.contato)+'</p>':'')+'<p><small>'+esc(a.pag||"")+'</small></p><div class="avxb">'+(a.pid&&prodById(a.pid)?'<button class="btn dark sm" type="button" data-av="ver" data-i="'+esc(a.pid)+'">Ver produto</button>':'')+(a.resolvido?'':'<button class="btn sm" type="button" data-av="ok" data-i="'+a.id+'">Marcar resolvido</button>')+'<button class="btn dark sm" type="button" data-av="del" data-i="'+a.id+'">Apagar</button></div></div>'});
  h+='<div class="avxb"><button class="btn sm" type="button" onclick="avClose()">Fechar</button></div>';
  o.querySelector(".avxc").innerHTML=h;
  o.querySelector("#avall").onclick=function(){avOpen(!all)};
  o.querySelectorAll("[data-av]").forEach(function(b){b.onclick=async function(){var k=b.getAttribute("data-av"),i=b.getAttribute("data-i");
    if(k==="ver"){avClose();go("#p-"+i);return}
    if(k==="del"&&!confirm("Apagar este aviso?"))return;
    b.disabled=true;var x=k==="ok"?await SB.from("avisos").update({resolvido:true}).eq("id",i):await SB.from("avisos").delete().eq("id",i);
    if(x.error){alert("Erro: "+x.error.message);b.disabled=false;return}avCount();avOpen(all)}});
}
/* Ícone da categoria "Caça e pesca" (12/11/2026) */
if(typeof ICONS!=="undefined"&&!ICONS.peixe)ICONS.peixe='<ellipse cx="21" cy="30" rx="15" ry="9"/><path d="M33 30l12-9v18z"/><circle cx="12" cy="28" r="2.2" fill="var(--tbg)"/><path d="M14 3v11a4.5 4.5 0 0 1-9 0v-2" stroke="currentColor" stroke-width="2.6" fill="none" stroke-linecap="round"/>';

/* Gratidão a Deus: um versículo por dia no rodapé (pedido do dono, 12/11/2026) */
var BIB=[["Confia ao Senhor as tuas obras, e teus pensamentos serão estabelecidos.","Provérbios 16:3"],["E tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor e não aos homens.","Colossenses 3:23"],["Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.","1 Tessalonicenses 5:18"],["Se o Senhor não edificar a casa, em vão trabalham os que a edificam.","Salmos 127:1"],["Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.","Salmos 37:5"],["Louvai ao Senhor, porque ele é bom, porque a sua benignidade dura para sempre.","Salmos 136:1"],["O peso justo é o prazer do Senhor.","Provérbios 11:1"],["Bendito o homem que confia no Senhor, e cuja esperança é o Senhor.","Jeremias 17:7"]];
function bibFoot(){var d=Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5),v=BIB[d%BIB.length];return'<div class="bibf" role="note"><span class="bibt">Gratidão a Deus</span><q>'+esc(v[0])+'</q><cite>'+esc(v[1])+'</cite></div>'}

/* Versículos passando ao lado da logo na barra azul do celular (pedido do dono, 19/11/2026) */
function bibTick(){if(typeof BIB==="undefined")return"";var d=Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5),L=BIB.slice(d%BIB.length).concat(BIB.slice(0,d%BIB.length));
  var t=L.map(function(v){return'<span><b>✝</b> “'+esc(v[0])+'” <i>'+esc(v[1])+'</i></span>'}).join("");
  return'<div class="kcvs" role="note" aria-label="Gratidão a Deus: '+esc(L[0][0]+" "+L[0][1])+'"><div class="kcvt" aria-hidden="true">'+t+t+'</div></div>'}
/* ===== Ajustes de 27/11/2026 (pedido do dono) =====
   Endereços próprios: produto em /produto/<nome>-<id>/, categoria em /categoria/<nome>/, marca em /marca/<nome>/.
   As páginas geradas (ferramentas/paginas_google.py) carregam este mesmo app e mostram o visual completo no mesmo endereço.
   Não voltar para links "#p-..." (o Google ignora o que vem depois do #). */
var RTH=/^#(p-|cat-|marca-|produtos$|busca$|carrinho$|marcas$|novidades$|edicao-em-massa$|comparar)/;
function pSlug(p){return slug(String(p.n||"").trim()).slice(0,70).replace(/-+$/,"")||"item"}
function pHref(p){return"produto/"+pSlug(p)+"-"+slug(String(p.id))+"/"}
function hrefId(h){h=String(h||"");var m=/-([a-z0-9_]+)\/?$/i.exec(h);return h.indexOf("#p-")===0?h.slice(3):m?(function(id){var p=prodById(id)||S.prods.filter(function(x){return slug(String(x.id))===id})[0];return p?p.id:id})(m[1]):h}
function hPath(h){var m,p,c;
  if(m=/^#p-(.+)$/.exec(h)){p=prodById(m[1]);return p?"/"+pHref(p):""}
  if(m=/^#cat-(.+)$/.exec(h)){c=catOf(m[1]);return c?"/categoria/"+slug(c.n)+"/":""}
  if(m=/^#marca-(.+)$/.exec(h)){return brandBySlug(m[1])?"/marca/"+m[1]+"/":""}
  return""}
function pathRt(P){var m,r={v:"",g:"",pv:""};
  if(m=/^\/produto\/(?:[^\/]*-)?([a-z0-9_]+)\/?$/i.exec(P)){var id=m[1].toLowerCase(),p=prodById(m[1])||S.prods.filter(function(x){return slug(String(x.id))===id})[0];r.v=p?p.id:m[1]}
  else if(m=/^\/categoria\/([^\/]+)\/?$/.exec(P)){var c=(S.cats||[]).filter(function(c){return slug(c.n)===m[1]})[0];if(c){r.g="cat";r.pv=c.id}else r.g="static"}
  else if(m=/^\/marca\/([^\/]+)\/?$/.exec(P)){var b=brandBySlug(m[1]);if(b){r.g="brand";r.pv=b.n}else r.g="static"}
  else r.g="static";
  return r}
function rTitle(){try{var t=HTT,p=view&&prodById(view),c=pg==="cat"&&catOf(pv);
  if(p)t=p.n+(p.brand&&norm(p.n).indexOf(norm(p.brand))<0?" "+p.brand:"")+" | Ronaldo Parafusos";else if(c)t=c.n+" | Ronaldo Parafusos - Colinas do Tocantins";else if(pg==="brand")t=pv+" | Ronaldo Parafusos - Colinas do Tocantins";else if(pg==="static"||RPL&&location.pathname!=="/")return;
  document.title=t}catch(e){}}
/* Lista completa em /dados.json: usada quando o Supabase não responde ou quando há lote novo (ver maior que o do Supabase). */
async function dLoad(){try{var r=await fetch("/dados.json",{cache:"no-cache"});if(r.ok){var j=await r.json();if(j&&j.prods)return j}}catch(e){}return null}
/* Links internos abrem sem recarregar a página (o endereço muda para o endereço próprio do produto/categoria). */
document.addEventListener("click",function(e){
  var mb=e.target.closest&&e.target.closest("[data-map]");
  if(mb){e.preventDefault();var f=document.createElement("iframe");f.src=mb.getAttribute("data-map");f.className="mapf";f.loading="lazy";f.title="Mapa da loja";f.setAttribute("referrerpolicy","no-referrer-when-downgrade");mb.replaceWith(f);return}
  if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  var a=e.target.closest&&e.target.closest("a[href]");if(!a||a.target==="_blank"||a.hasAttribute("download"))return;
  var hr=a.getAttribute("href")||"";
  if(/^(produto|categoria|marca)\/[^\/]+\/$/.test(hr)){var u="/"+hr;if(/^categoria\//.test(hr)&&pathRt(u).g!=="cat")return;e.preventDefault();if(location.pathname!==u||location.hash)history.pushState(null,"",u);route()}
  else if(hr.charAt(0)==="#"&&location.pathname!=="/"&&(RTH.test(hr)||hr==="#inicio")){e.preventDefault();if(hr==="#inicio"){history.pushState(null,"","/");route()}else go(hr)}
});
/* ===== Busca inteligente (27/11/2026) =====
   Ignora acentos, maiúsculas e palavras de ligação ("cabo enxada" acha "cabo de enxada"); aceita escrita parecida
   (Blumenal = Blumenau, parafuzo = parafuso, filips = phillips), erro de digitação (furadera = furadeira), plural,
   "10mm" = "10 mm" e "4.8" = "4,8". Números precisam bater. Se nada tiver todas as palavras, mostra os parecidos (QPT). */
var QPT=0,QC=new Map(),QSW={de:1,da:1,do:1,das:1,dos:1,para:1,pra:1,pro:1,com:1,e:1,a:1,o:1,as:1,os:1,em:1,no:1,na:1,nos:1,nas:1,um:1,uma:1,p:1};
function qn(s){return String(s).replace(/(\d)[.,](\d)/g,"$1,$2").replace(/(\d)(mm|cm|m|pol|w|v|kg|g|l|ml|cv|hp|a|un|pc|pcs)\b/g,"$1 $2")}
function qph(s){return s.replace(/ph/g,"f").replace(/[cs]h/g,"x").replace(/lh/g,"li").replace(/nh/g,"ni").replace(/qu|q/g,"c").replace(/gu(?=[ei])/g,"g").replace(/g(?=[ei])/g,"j").replace(/sc(?=[ei])|c(?=[ei])|ss|z/g,"s").replace(/k/g,"c").replace(/w/g,"v").replace(/y/g,"i").replace(/h/g,"").replace(/l(?![aeiou])/g,"u").replace(/m(?![aeiou\s]|$)/g,"n").replace(/([a-z])\1+/g,"$1")}
function qhx(p){return norm(p.n+" "+(p.brand||"")+" "+(p.code||"")+" "+(p.bc||"")+" "+(p.ref||""))}
function qprep(x){var c=QC.get(x);if(!c){if(QC.size>40000)QC.clear();var n=qn(x);c={n:n,p:qph(n),w:null};QC.set(x,c)}return c}
function qtoks(t){var s0=" "+qn(norm(t)).replace(/[\s\/]+/g," ")+" ";if(typeof QSYP!=="undefined")QSYP.forEach(function(k,i){if(s0.indexOf(" "+k+" ")>=0)s0=s0.replace(" "+k+" "," \u00a7"+i+" ")});var a=s0.split(" ").filter(Boolean),b=a.filter(function(w){return!QSW[w]});return b.length?b:a}
function qlev(a,b,k){var m=a.length,n=b.length,i,j;if(Math.abs(m-n)>k)return k+1;var p=[];for(j=0;j<=n;j++)p[j]=j;for(i=1;i<=m;i++){var c=[i],mn=i;for(j=1;j<=n;j++){c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a.charCodeAt(i-1)===b.charCodeAt(j-1)?0:1));if(c[j]<mn)mn=c[j]}if(mn>k)return k+1;p=c}return p[n]}
function qtok(c,w,fz){
  if(w.charAt(0)==="\u00a7")return qsyn(c,QSYP[+w.slice(1)]);
  if(c.n.indexOf(w)>=0)return 3;
  var v=[w.replace(/oes$|aes$/,"ao"),w.replace(/ns$/,"m"),w.replace(/is$/,"l"),w.replace(/es$/,""),w.replace(/s$/,"")],i;
  for(i=0;i<v.length;i++)if(v[i]!==w&&v[i].length>2&&c.n.indexOf(v[i])>=0)return 3;
  if(w.length<3||/\d/.test(w))return 0;
  var pw=qph(w.replace(/s$/,""));if(pw.length>2&&c.p.indexOf(pw)>=0)return 2;
  if(fz&&w.length>=4){var k=w.length>=8?2:1;if(!c.w)c.w=c.n.split(/[^a-z0-9]+/).filter(function(x){return x.length>=3});
    for(i=0;i<c.w.length;i++){var x=c.w[i];if(qlev(x,w,k)<=k||(x.length>w.length&&qlev(x.slice(0,w.length),w,1)<=1&&w.length>=5))return 1}}
  return qsyn(c,w)||qsyn(c,w.replace(/s$/,""))}
function qsc(x,t){var c=qprep(x),ts=qtoks(t),s=0,q=qn(norm(t)).trim();ts.forEach(function(w){s+=qtok(c,w,1)});if(q&&c.n.indexOf(q)>=0)s+=4;var fw=c.n.split(/[^a-z0-9]+/)[0]||"",w0=ts[0]||"";if(w0&&(fw.indexOf(w0)===0||qph(fw)===qph(w0)||(w0.length>=4&&qlev(fw,w0,w0.length>=8?2:1)<=(w0.length>=8?2:1))))s+=2;return s}
/* "Clientes também procuram": mesma categoria e marca primeiro, depois a mesma categoria (com foto) e a mesma marca */
function simOf(p){var id=p.id,ok={};ok[id]=1;function f(fn){return S.prods.filter(function(x){if(ok[x.id]||!fn(x))return false;return true})}
  var a=f(function(x){return p.brand&&x.c===p.c&&x.brand===p.brand&&x.img});a.forEach(function(x){ok[x.id]=1});
  var b=f(function(x){return x.c===p.c&&x.img});b.forEach(function(x){ok[x.id]=1});
  var c=f(function(x){return p.brand&&x.brand===p.brand&&x.img});
  return a.slice(0,6).concat(b).slice(0,10).concat(c).slice(0,12)}
/* Entrega grátis, prazo de resposta e aberto/fechado agora (perto dos botões de orçamento) */
var STO='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1.5-5h15L21 9M4 9v11h16V9M3 9h18M9 20v-6h6v6"/></svg>',TRK='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>';
function ppInfo(){var n=hrsNow();return'<div class="ppi"><p class="egr">'+TRK+'<span><b>Entrega grátis</b> em Colinas do Tocantins</span></p><p class="rtm">'+IC.wa+'<span>Respondemos no WhatsApp em <b>2 a 10 minutos</b> (em horário de atendimento)</span></p><p class="hst2 '+(n.o?"on":"off")+'">'+n.t+'</p></div>'}
/* Carrinho: entrega ou retirada (vai na mensagem do WhatsApp) */
var CENT="",CEND="";try{CENT=localStorage.getItem("rp_ent")||"";CEND=localStorage.getItem("rp_end")||""}catch(e){}
function cEntH(){return'<fieldset class="cent"><legend>Como prefere receber?</legend><label><input type="radio" name="cent" value="e"'+(CENT==="e"?" checked":"")+'> <span class="cei">'+TRK+'Quero entrega <small>(grátis em Colinas do Tocantins)</small></span></label><label><input type="radio" name="cent" value="r"'+(CENT==="r"?" checked":"")+'> <span class="cei">'+STO+'Vou retirar na loja</span></label><input id="cend" maxlength="120" autocomplete="street-address" placeholder="Endereço para entrega (opcional)" aria-label="Endereço para entrega" value="'+esc(CEND)+'"'+(CENT==="e"?"":" hidden")+'></fieldset>'}
document.addEventListener("change",function(e){var t=e.target;if(t&&t.name==="cent"){CENT=t.value;try{localStorage.setItem("rp_ent",CENT)}catch(x){}var d=$("cend");if(d)d.hidden=CENT!=="e";if(typeof cLive==="function")cLive()}});
document.addEventListener("input",function(e){var t=e.target;if(t&&t.id==="cend"){CEND=t.value;try{localStorage.setItem("rp_end",CEND)}catch(x){}if(typeof cLive==="function")cLive()}});
/* Perguntas frequentes (texto aprovado pelo dono; vem do boot.js, gerado de ferramentas/faq.json) */
/* Páginas de contato, perguntas e 404 também mostram os produtos (pedido do dono, 27/11/2026: cliente leigo não pode achar que não há produtos) */
function homeLite(){var x=home(),m='<div class="stripe" aria-hidden="true"></div>',k=x.indexOf(m);return k>=0?x.slice(k+m.length):x}
function faqSec(){var F=(BOOT&&BOOT.faq)||[];if(!F.length)return"";
  return'<section class="faq"><div class="wrap"><h2>Perguntas frequentes</h2>'+F.slice(0,6).map(function(q){return'<details><summary>'+esc(q[0])+'</summary><p>'+esc(q[1])+'</p></details>'}).join("")+'<a class="btn dark sm" href="perguntas-frequentes/">Ver todas as perguntas</a></div></section>'}

/* ===== Busca 2 (27/11/2026, pedido do dono: atrair clientes) =====
   QSY: nomes do dia a dia -> como está no catálogo. Chave com espaço = expressão (trocada antes de separar as palavras).
   Cada valor é uma lista de alternativas (basta uma bater); alternativa com espaço exige todas as palavras. */
var QSY={
"enforca gato":["abracadeira nylon"],"fita metrica":["trena"],"serra eletrica":["motosserra","serra circular","serra marmore"],"moto serra":["motosserra"],
"pe de cabra":["pe de cabra","alavanca"],"chave inglesa":["inglesa","ajustavel"],"chave de boca":["chave fixa","chave combinada","chave boca"],
"chave estrela":["chave estrela","chave combinada"],"bomba d agua":["motobomba","bomba submersa","bomba centrifuga","bomba periferica","bomba agua","bomba d"],"bomba de agua":["motobomba","bomba submersa","bomba centrifuga","bomba periferica","bomba agua","bomba d"],"bomba dagua":["motobomba","bomba submersa","bomba centrifuga","bomba periferica","bomba agua","bomba d"],
"bomba costal":["pulverizador"],"lava jato":["lavadora"],"carrinho de mao":["carrinho"],"boca de lobo":["cavadeira"],"bico de mangueira":["esguicho"],
"fio de rocadeira":["fio nylon","carretel"],"fio de nylon":["fio nylon","carretel"],"linha de rocadeira":["fio nylon","carretel"],"protetor auricular":["abafador","protetor auricular","plug"],
"protetor de ouvido":["abafador","protetor auricular"],"veda rosca":["veda rosca","vedarosca","fita veda"],"cola de cano":["adesivo","cola"],"cola cano":["adesivo","cola"],
"trava rosca":["trava rosca"],"ferro de solda":["ferro de solda","soldador"],"maquina de solda":["inversora","maquina solda","transformador solda"],
"parafuso de madeira":["parafuso soberba","parafuso madeira","atarraxante"],"parafuso de telha":["parafuso telha"],"tico tico":["tico"],"bota de borracha":["bota pvc","bota borracha","galocha"],
"capa de chuva":["capa chuva"],"luva de raspa":["raspa"],"cola quente":["cola quente","bastao"],"espuma expansiva":["espuma"],"caixa d agua":["caixa d"],
"serra copo":["serra copo"],"disco de corte":["disco corte"],"disco de serra":["disco serra"],"oleo 2 tempos":["2 tempos","dois tempos"],
lixadeira:["esmerilhadeira","lixadeira"],makita:["esmerilhadeira","serra marmore","furadeira","makita"],maquita:["esmerilhadeira","serra marmore","furadeira"],
esmeril:["esmerilhadeira","rebolo","esmeril"],capinadeira:["rocadeira"],rocadera:["rocadeira"],rosadeira:["rocadeira"],motoserra:["motosserra"],
cano:["tubo","eletroduto","cano"],canos:["tubo","eletroduto","cano"],metro:["trena","metro"],botina:["botina","bota"],bota:["bota","botina"],galocha:["bota"],
torques:["torquesa","alicate"],torquesa:["torquesa","alicate"],arrebite:["rebite"],rebitador:["rebitadeira"],parafusadeira:["parafusadeira","furadeira"],
benjamim:["benjamim","adaptador tomada","plug"],benjamin:["benjamim","adaptador tomada","plug"],espada:["sabre"],lavajato:["lavadora"],wap:["lavadora"],
desengripante:["desengripante","wd"],wd40:["desengripante","wd"],tiner:["thinner"],thiner:["thinner"],diluente:["thinner","aguarras"],zarcao:["zarcao","fundo"],
trincha:["trincha","pincel"],pincel:["pincel","trincha"],soldador:["ferro de solda","inversora"],inversora:["inversora","maquina solda"],
martelete:["martelete","rompedor","perfurador"],rompedor:["rompedor","martelete"],epi:["luva","oculos","capacete","botina","abafador","mascara","respirador"],
mascara:["mascara","respirador"],respirador:["respirador","mascara"],tranca:["trinco","ferrolho","tranca"],trinco:["trinco","ferrolho"],
interruptor:["interruptor","tecla"],pilha:["pilha","bateria"],cotovelo:["joelho","curva"],engate:["engate"],ventilador:["ventilador"],
cimento:["cimento","argamassa"],rejunte:["rejunte"],bucha:["bucha"],prego:["prego"],grampo:["grampo"],furadeira:["furadeira"],
lima:["lima"],limatao:["lima"],sabre:["sabre"],corrente:["corrente"],vela:["vela"],carburador:["carburador"],mangote:["mangote"],
mangueira:["mangueira","mangote"],pistola:["pistola"],compressor:["compressor"],lanterna:["lanterna"],cadeado:["cadeado"],
enxadao:["enxadao"],cavadeira:["cavadeira","boca de lobo"],machado:["machado"],foice:["foice"],
graxa:["graxa"],oleo:["oleo","lubrificante"],lubrificante:["lubrificante","oleo"],selador:["selador"],verniz:["verniz"],
silicone:["silicone"],veda:["veda"],aspersor:["aspersor"],gotejador:["gotejador","gotejamento"],tela:["tela"],arame:["arame"],
abracadeira:["abracadeira"],nivel:["nivel"],prumo:["prumo"],esquadro:["esquadro"],serrote:["serrote"],martelo:["martelo"],marreta:["marreta"],
talhadeira:["talhadeira"],ponteiro:["ponteiro"],colher:["colher de pedreiro","colher"],desempenadeira:["desempenadeira"]
};
var QSYP=Object.keys(QSY).filter(function(k){return k.indexOf(" ")>0}).sort(function(a,b){return b.length-a.length});
function qsyn(c,w){var a=QSY[w];if(!a)return 0;for(var i=0;i<a.length;i++){var p=a[i].split(" "),ok=true;for(var j=0;j<p.length;j++)if(c.n.indexOf(p[j])<0){ok=false;break}if(ok)return 2}return 0}
/* Sugestões de categoria e marca no topo da caixa de busca */
function sgH(t){var out=[],k;if(t.length<3)return"";
  (S.cats||[]).forEach(function(c){if(out.length<2&&qm(norm(c.n),t,1))out.push('<a class="si sic" href="categoria/'+slug(c.n)+'/"><b>Categoria: '+esc(c.n)+'</b><span>Ver todos</span></a>')});
  k=0;(S.brands||[]).forEach(function(b){var bn=norm(b.n);if(k<2&&bn.length>2&&(bn===norm(t.trim())||bn.indexOf(norm(t.trim()))===0)){var n=S.prods.filter(function(p){return norm(p.brand||"")===bn}).length;if(n){k++;out.push('<a class="si sic" href="#marca-'+esc(slug(b.n))+'"><b>Marca: '+esc(b.n)+'</b><span>'+n+(n===1?" produto":" produtos")+'</span></a>')}}});
  return out.join("")}
/* "Não achou? Pergunte no WhatsApp" com o que o cliente digitou */
function waAsk(q){var n=(typeof waNum==="function"&&waNum())||"5563984514163";return"https://wa.me/"+n+"?text="+encodeURIComponent("Olá! Procurei no site por \""+String(q).trim()+"\" e não encontrei. Vocês têm?")}
function waAskH(q,cls){return'<a class="'+(cls||"si siw")+'" href="'+esc(waAsk(q))+'" target="_blank" rel="noopener">'+IC.wa+'<span>Não achou? <b>Pergunte no WhatsApp</b></span></a>'}
/* Buscas sem resultado: só a palavra (sem dado do cliente), 1 vez por palavra por aparelho por dia; o administrador vê em "Buscas sem resultado" */
var BSL={};
function bsLog(t){t=norm(String(t||"")).replace(/\s+/g," ").trim().slice(0,60);if(t.length<3||canEdit||!rpOn())return;
  try{var d=new Date().toISOString().slice(0,10),o=JSON.parse(localStorage.getItem("rp_bs")||"{}");if(o.d!==d)o={d:d,l:[]};if(o.l.indexOf(t)>=0||o.l.length>=30)return;o.l.push(t);localStorage.setItem("rp_bs",JSON.stringify(o))}catch(e){if(BSL[t])return;BSL[t]=1}
  try{fetch(rpBase()+"/rest/v1/rpc/busca_registrar",{method:"POST",headers:{apikey:RPC.key,"Content-Type":"application/json"},body:JSON.stringify({t:t}),keepalive:true}).catch(function(){})}catch(e){}}
async function bsOpen(){var d=document.getElementById("bsd");if(!d){d=document.createElement("dialog");d.id="bsd";d.className="bsd";document.body.appendChild(d)}
  d.innerHTML='<p>Carregando…</p>';if(!d.open)d.showModal();
  try{var r=await SB.from("buscas").select("termo,n,ult").order("n",{ascending:false}).limit(300);if(r.error)throw r.error;var a=r.data||[];
    d.innerHTML='<h2>Buscas sem resultado</h2><p class="note">O que os clientes procuraram no site e não encontraram (sem nenhum dado do cliente). Use para saber o que cadastrar ou comprar. Somem sozinhas em 180 dias.</p>'+(a.length?'<table class="bst"><tr><th>Palavra buscada</th><th>Vezes</th><th>Última</th><th></th></tr>'+a.map(function(x){return'<tr><td>'+esc(x.termo)+'</td><td>'+x.n+'</td><td>'+new Date(x.ult).toLocaleDateString("pt-BR")+'</td><td><button class="lnk2" type="button" data-bsx="'+esc(x.termo)+'">Apagar</button></td></tr>'}).join("")+'</table>':'<p>Nenhuma busca sem resultado até agora.</p>')+'<p><button class="btn dark sm" type="button" data-bsc="1">Fechar</button></p>';
  }catch(e){d.innerHTML='<p>Não consegui carregar a lista agora.</p><p><button class="btn dark sm" type="button" data-bsc="1">Fechar</button></p>'}
  d.onclick=async function(ev){var b=ev.target.closest("button");if(!b)return;if(b.hasAttribute("data-bsc")){d.close();return}var k=b.getAttribute("data-bsx");if(k){try{await SB.from("buscas").delete().eq("termo",k)}catch(x){}bsOpen()}}}
/* Busca por voz (celular/Chrome): botão de microfone na barra de busca */
/* Só mostra o microfone onde a busca por voz funciona bem: Chrome/Edge no Android e no computador.
   iPhone/iPad, navegadores dentro de apps (Instagram, Facebook, WhatsApp), Android WebView e o app Claude ficam sem o botão:
   lá o cliente usa o microfone do próprio teclado, que funciona sempre (pedido do dono: só deixar o que é 100% funcional). */
var VOZ=(function(){try{var u=navigator.userAgent||"";if(!(window.SpeechRecognition||window.webkitSpeechRecognition))return false;
  if(/iPhone|iPad|iPod|Macintosh.*Mobile|CriOS|FxiOS|EdgiOS|FBAN|FBAV|FB_IAB|Instagram|WhatsApp|Line\/|; wv\)|Electron|Claude|SamsungBrowser|OPR\//.test(u))return false;
  if(/Macintosh/.test(u)&&navigator.maxTouchPoints>1)return false;
  return/(Chrome|Edg)\/\d+/.test(u)}catch(e){return false}})();
var MICI='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
function micH(){return VOZ?'<button type="button" class="mic" aria-label="Buscar falando" title="Toque e fale o nome do produto">'+MICI+'</button>':""}
/* Microfone (28/11/2026, refeito): resultado aparece enquanto fala, ao terminar abre a página de resultados; tocar de novo para; mensagens claras de erro */
var MREC=null;
function micMsg(t){var w=document.querySelector(".sw");if(!w)return;var d=w.querySelector(".micm");if(!d){d=document.createElement("div");d.className="micm";d.setAttribute("role","status");w.appendChild(d)}d.textContent=t;clearTimeout(micMsg.t);if(t)micMsg.t=setTimeout(function(){d.remove()},6000)}
function micUi(on){var m=document.querySelector(".mic"),q=$("hq");if(m)m.classList.toggle("on",on);if(q)q.placeholder=on?"Fale o nome do produto…":T("ph")}
function micStart(){
  if(MREC){try{MREC.stop()}catch(e){}return}
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){micMsg("Seu navegador não tem busca por voz. Use o microfone do teclado do celular.");return}
  var R=new SR(),fin="",last="",err="",tm;MREC=R;
  R.lang="pt-BR";R.interimResults=true;R.continuous=false;R.maxAlternatives=1;
  R.onstart=function(){micUi(true);micMsg("Pode falar…")};
  R.onresult=function(ev){var it="";for(var i=ev.resultIndex;i<ev.results.length;i++){var x=ev.results[i][0].transcript;if(ev.results[i].isFinal)fin+=x;else it+=x}
    last=(fin+" "+it).replace(/\s+/g," ").trim();var q=$("hq");if(q)q.value=last;micMsg("");
    if(fin){clearTimeout(tm);tm=setTimeout(function(){try{R.stop()}catch(e){}},400)}};
  R.onerror=function(ev){err=ev.error||"erro"};
  R.onend=function(){clearTimeout(tm);clearTimeout(R.safe);MREC=null;micUi(false);
    var v=String(fin||last).replace(/[.!?,;:]+$/,"").trim();
    if(v){var q=$("hq");if(q)q.value=v;term=v;micMsg("");if(location.hash==="#busca")route();else go("#busca");return}
    micMsg(err==="not-allowed"||err==="service-not-allowed"?"O microfone está bloqueado. Toque no cadeado ao lado do endereço do site e permita o microfone.":
      err==="audio-capture"?"Nenhum microfone encontrado neste aparelho.":err==="network"?"Sem conexão para reconhecer a voz. Tente de novo ou digite.":
      "Não ouvi nada. Toque no microfone e fale o nome do produto.")};
  try{R.start();R.safe=setTimeout(function(){try{R.stop()}catch(e){}},12000)}catch(e){MREC=null;micUi(false);micMsg("Não consegui ligar o microfone. Tente de novo.")}}
document.addEventListener("click",function(e){var m=e.target.closest&&e.target.closest(".mic");if(!m)return;e.preventDefault();e.stopPropagation();micStart()});
/* Oficina na página inicial: serviços com página própria (geradas em /servicos/) */
var OFS=[["conserto-de-motosserra","Conserto de motosserra",'<path d="M3 15h11l3-3h3v6h-3l-3-3"/><path d="M5 15v3h6v-3"/><circle cx="18.5" cy="15" r=".8"/>'],
  ["conserto-de-rocadeira","Conserto de roçadeira",'<path d="M4 4l11 11"/><path d="M15 15l2 5 3-3-5-2z"/><path d="M6 8l-2 2"/>'],
  ["conserto-de-motobomba","Conserto de motobomba",'<circle cx="10" cy="13" r="5"/><path d="M15 13h6M10 8V4h4"/><path d="M10 13h.01"/>'],
  ["conserto-de-motor-estacionario","Conserto de motor estacionário",'<rect x="4" y="8" width="12" height="9" rx="1"/><path d="M16 11h3v3h-3M7 8V5h6v3M7 17v2M13 17v2"/>'],
  ["pecas-para-motosserra-e-rocadeira","Peças para motosserra e roçadeira",'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>']];
function ofiSec(){return'<section class="ofi"><div class="wrap"><h2 class="sh">Oficina: conserto e peças</h2><p class="ofp">Consertamos motosserras, roçadeiras, motobombas, motores estacionários e outras máquinas. Todo conserto tem garantia.</p><div class="ofg">'+OFS.map(function(o){return'<a class="ofc" href="servicos/'+o[0]+'/"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+o[2]+'</svg><span>'+o[1]+'</span></a>'}).join("")+'</div></div></section>'}

var WM_DEFAULT="Olá! Gostaria de um orçamento deste produto:\n*{produto}*\nDescrição: {descricao}\nCódigo: {codigo}\nMarca: {marca}\nPreço no site: {preco}\nLink: {link}";
var WM_ORDER="Olá! Gostaria de fazer um pedido deste produto:\n*{produto}*\nDescrição: {descricao}\nCódigo: {codigo}\nMarca: {marca}\nPreço no site: {preco}\nLink: {link}";
function hasP(p){return !!String(p.p==null?"":p.p).trim()}
function waDesc(p){var d=String(p.d||"").replace(/\s+/g," ").trim();if(d.length>220){d=d.slice(0,220);var i=d.lastIndexOf(" ");if(i>150)d=d.slice(0,i);d=d.replace(/[\s,;:.\-]+$/,"")+"…"}return d}
function waOwn(){return !!String((S.s&&S.s.wa)||"").replace(/\D/g,"")}
function waNum(){var d=String((S.s&&S.s.wa)||"").replace(/\D/g,"");if(!d)d=String((S.s&&S.s.phone)||"").replace(/\D/g,"");if(!d)return"";return(d.length>=12&&d.indexOf("55")===0)?d:"55"+d}
function siteBase(){var u=String((S.s&&S.s.url)||"").trim();if(!u)u=location.origin+"/";u=u.split("#")[0].split("?")[0];return/\/$/.test(u)?u:u+"/"}
function waMsg(p){var ord=hasP(p);
  var vals={produto:p.n||"",descricao:waDesc(p),codigo:p.code||"",marca:p.brand||"",preco:p.p?money(p.p):"",link:siteBase()+pHref(p)};
  var tpl=ord?((S.s&&S.s.wmo)||WM_ORDER):((S.s&&S.s.wm)||WM_DEFAULT);
  return tpl.split("\n").map(function(line){var empty=false;var out=line.replace(/\{(produto|descricao|codigo|marca|preco|link)\}/g,function(m,k){if(!vals[k])empty=true;return vals[k]});return empty?null:out}).filter(function(l){return l!==null}).join("\n");
}
function waLink(p){var n=waNum();return n?"https://wa.me/"+n+"?text="+encodeURIComponent(waMsg(p)):""}
var WAI='<svg class="wai" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l2 1c.3.1.4.2.5.3.1.2.1.8-.1 1.4z"/></svg>';
function quoteA(p,cls){var w=waLink(p),k=hasP(p)?"order":"quote";return w?'<a class="'+cls+' wa" href="'+esc(w)+'" target="_blank" rel="noopener">'+WAI+T(k)+'</a>':'<a class="'+cls+'" href="'+tel()+'">'+T(k)+'</a>'}
function openForm(title,fields,label,onSave,note){
  var f=$("f"),hasT=fields.some(function(x){return x.tab});
  f.innerHTML='<h3>'+esc(title)+'</h3>'+(note?'<p class="note">'+esc(note)+'</p>':'')+(hasT?'<div class="tabs" role="tablist"><button type="button" class="tbt on" role="tab" aria-selected="true" data-act="ftab" data-id="">Produto</button><button type="button" class="tbt" role="tab" aria-selected="false" data-act="ftab" data-id="c">Comparação</button></div>':'')+fields.map(function(x){
    var id="f_"+x.k,h='<label for="'+id+'">'+esc(x.l)+'</label>',r;
    if(x.t==="gal"&&typeof galEdH==="function")r=galEdH(x);else if(x.t==="gal"&&typeof galEdH==="function")r=galEdH(x);else if(x.t==="n")r='<p class="note">'+esc(x.l)+'</p>';
    else if(x.t==="area")r=h+'<textarea id="'+id+'" rows="'+(x.rows||3)+'"'+(x.ph?' placeholder="'+esc(x.ph)+'"':"")+'>'+esc(x.v)+'</textarea>';
    else if(x.t==="select")r=h+'<select id="'+id+'">'+x.o.map(function(o){return'<option value="'+esc(o[0])+'"'+(o[0]===x.v?" selected":"")+'>'+esc(o[1])+'</option>'}).join("")+'</select>';
    else if(x.t==="file")r=h+'<input id="'+id+'" type="file" accept="'+(x.a||"image/*")+'"'+(x.a?"":" multiple")+'>';
    else r=h+'<input id="'+id+'" value="'+esc(x.v)+'"'+(x.dl?' list="'+id+'_dl"':"")+'>'+(x.dl?'<datalist id="'+id+'_dl">'+x.dl.map(function(o){return'<option value="'+esc(o)+'">'}).join("")+'</datalist>':"");
    return hasT?'<div class="tpn" data-tab="'+(x.tab||"")+'"'+(x.tab?" hidden":"")+'>'+r+'</div>':r;
  }).join("")+'<p id="err" class="err" role="alert"></p><div class="row"><button type="button" class="btn dark" data-act="x">Cancelar</button><button type="submit" class="btn">'+esc(label)+'</button></div>';
  f.onsubmit=async function(e){
    e.preventDefault();var v={};
    fields.forEach(function(x){var el=$("f_"+x.k);if(!el)return;v[x.k]=x.t==="file"?Array.prototype.slice.call(el.files):el.value.trim()});
    try{var r=await onSave(v);if(r){$("err").textContent=r;return}}catch(er){$("err").textContent="Não foi possível salvar. Tente de novo.";return}
    $("dlg").close();dirty=true;render();
  };
  $("dlg").showModal();
}
function prodForm(id,ins){
  var old=id?S.prods.filter(function(p){return p.id===id})[0]:null;
  var rp=ins?S.prods.filter(function(x){return x.id===ins.ref})[0]:null;var p=old||{id:uid(),c:rp?rp.c:(pg==="cat"?pv:S.cats[0].id),brand:rp?(rp.brand||""):(pg==="brand"?pv:""),n:"",d:"",p:"",img:""};
  var fl=[{k:"n",l:"Nome do produto",v:p.n},{k:"code",l:"Referência ou código (aparece na mensagem do WhatsApp)",v:p.code||""},{k:"un",l:"Unidade de venda deste produto (unidade, quilo, peça, metro...). O cliente não muda: aparece no carrinho e na mensagem do WhatsApp",t:"select",v:p.un||"un",o:UN.map(function(u){return[u[0],u[1]]})},{k:"brand",l:"Marca (cadastre em “Marcas”)",t:"select",v:p.brand||"",o:brandOpts(p.brand)},{k:"c",l:"Categoria",t:"select",v:p.c,o:S.cats.map(function(c){return[c.id,c.n]})},{k:"d",l:"Descrição",t:"area",v:p.d},{k:"p",l:"Preço à vista, dinheiro ou Pix (vazio = “Consulte o preço”)",v:p.p},{k:"po",l:"Preço antigo, para mostrar riscado (opcional)",v:p.po||""},{k:"bd",l:"Selo da promoção (ex.: OFERTA). Vazio = mostra o % de desconto quando há preço antigo",v:p.bd||""},{k:"pc",l:"Valor total no cartão (opcional)",v:p.pc||""},{k:"pn",l:"Parcelas no cartão, até quantas (ex.: 10)",v:p.pn||""},{k:"s",l:"Especificações (uma por linha, assim: Nome: valor)",t:"area",v:p.s||""},{k:"more",l:"Mais sobre o produto (um item por linha)",t:"area",v:p.more||""},{k:"star",l:"Mostrar em “Mais vendidos” na página inicial",t:"select",v:p.star?"1":"",o:[["","Não"],["1","Sim"]]},{k:"nw",l:"Lançamento (mostra o selo e entra no filtro)",t:"select",v:p.nw?"1":"",o:[["","Não"],["1","Sim"]]},{k:"rt",l:"Avaliação dos clientes (opcional, só use notas reais)",t:"select",v:p.rt?String(p.rt):"",o:[["","Sem avaliação"],["5","5"],["4.5","4,5"],["4","4"],["3.5","3,5"],["3","3"],["2.5","2,5"],["2","2"],["1","1"]]},{k:"rv",t:"area",rows:5,l:"Avaliações reais de clientes (uma por linha, assim: Nome | nota de 1 a 5 | comentário). Quando houver, a nota do produto vira a média delas.",v:(p.rv||[]).map(function(r){return[r.n||"",r.r,r.t||""].join(" | ")}).join("\n")}];
  if((p.gal&&p.gal.length)||p.img)fl.push({k:"gl",t:"gal",l:"Fotos atuais",v:JSON.stringify(p.gal&&p.gal.length?p.gal:[p.img])});if(assets){fl.push({k:"img",l:"Adicionar fotos (pode escolher várias)",t:"file"})}
  fl.push({k:"cmpn",t:"n",tab:"c",l:"Aba de comparação: o produto só aparece para comparar quando tiver pelo menos uma característica preenchida abaixo. Use os mesmos nomes de característica nos produtos do mesmo tipo (ex.: Potência, Mandril) para que fiquem na mesma linha da tabela."},{k:"cg",tab:"c",l:"Tipo do produto (ex.: Furadeira de impacto). Só se comparam produtos do mesmo tipo; vazio = usa a categoria",v:p.cg||"",dl:cgOpts()},{k:"cmp",tab:"c",t:"area",rows:9,ph:"Potência: 550 W\nMandril: 13 mm\nVelocidade: 0 a 2.800 rpm\nPeso: 1,6 kg",l:"Dados para comparar (uma característica por linha, assim: Potência: 550 W)",v:p.cmp||""},{k:"cmpd",tab:"c",t:"area",rows:5,ph:"Mais leve e fácil de manusear.\nIdeal para uso doméstico.",l:"Diferenciais e para quem é indicado (um item por linha)",v:p.cmpd||""});
  openForm(old?"Editar produto":"Novo produto",fl,"Salvar",async function(v){
    if(!v.n)return"Informe o nome do produto.";
    var bad=lines(v.cmp).filter(function(l){return l.indexOf(":")<1})[0];if(bad)return"Aba Comparação: escreva cada linha assim “Característica: valor”. Falta o “:” em “"+bad.slice(0,40)+"”.";
    if(v.rm==="1"){p.gal=[];p.img=""}if(typeof v.gl==="string"&&v.gl){try{var gg=JSON.parse(v.gl);if(Array.isArray(gg)){p.gal=gg.filter(Boolean);p.img=p.gal[0]||""}}catch(eg){}}if(typeof v.gl==="string"&&v.gl){try{var gg=JSON.parse(v.gl);if(Array.isArray(gg)){p.gal=gg.filter(Boolean);p.img=p.gal[0]||""}}catch(eg){}}
    if(v.img&&v.img.length){p.gal=p.gal||(p.img?[p.img]:[]);for(var i=0;i<v.img.length;i++){var r=await assets.upload(v.img[i]);p.gal.push(r.id)}p.img=p.gal[0]}
    p.n=v.n;p.c=v.c;p.d=v.d;p.p=v.p;p.po=v.po;p.bd=v.bd;p.pc=v.pc;p.pn=v.pn;p.s=v.s;p.code=v.code;p.brand=v.brand;p.more=v.more;p.un=v.un||"un";p.star=v.star==="1";p.nw=v.nw==="1";p.rt=v.rt?Number(v.rt):0;p.rv=lines(v.rv).map(function(l){var x=l.split("|").map(function(s){return s.trim()}),n=Math.round(Number(String(x[1]||"").replace(",","."))||0);return{n:x[0]||"Cliente",r:(n>=1&&n<=5)?n:0,t:x.slice(2).join(" | ")}}).filter(function(r){return r.r>0});if(p.rv.length)p.rt=rvAvg(p);else delete p.rv;p.cg=v.cg;p.cmp=v.cmp;p.cmpd=v.cmpd;p.et=Date.now();p.up=p.et;window.NOVV=(window.NOVV||0)+1;
    if(!old){p.ts=Date.now();if(ins)insProd(p,ins);else S.prods.push(p)}
  });
}
function delForm(id){
  var p=S.prods.filter(function(x){return x.id===id})[0];if(!p)return;
  openForm("Excluir produto",[],"Excluir",function(){S.prods=S.prods.filter(function(x){return x.id!==id});(S.del=S.del||[]).push(id)},"Excluir “"+p.n+"” do catálogo?");
}
function build(){
  var json=JSON.stringify(S).replace(/</g,"\\u003c");
  return '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>Ronaldo Parafusos | Parafusos, ferragens e ferramentas</title><meta name="description" content="Loja de parafusos, ferragens e ferramentas em Colinas do Tocantins (TO): equipamentos, máquinas, material de segurança, tintas e conserto de motosserra."><link rel="canonical" href="https://ronaldoparafusos.com.br/"><meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Ronaldo Parafusos"><meta property="og:title" content="Ronaldo Parafusos | Parafusos, ferragens e ferramentas"><meta property="og:description" content="Loja de parafusos, ferragens e ferramentas em Colinas do Tocantins (TO). Tel. (63) 3476-1955 | (63) 98451-4163."><meta property="og:url" content="https://ronaldoparafusos.com.br/"><meta property="og:image" content="https://ronaldoparafusos.com.br/img/og-ronaldo-parafusos-v5.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">{"@context":"https://schema.org","@type":"HardwareStore","name":"Ronaldo Parafusos","url":"https://ronaldoparafusos.com.br/","image":"https://ronaldoparafusos.com.br/img/og-ronaldo-parafusos-v5.jpg","logo":"https://ronaldoparafusos.com.br/favicon-512.png","telephone":"+55-63-3476-1955","contactPoint":{"@type":"ContactPoint","telephone":"+55-63-98451-4163","contactType":"WhatsApp","areaServed":"BR","availableLanguage":"Portuguese"},"email":"ronaldoparafusos@gmail.com","address":{"@type":"PostalAddress","streetAddress":"Av. Pedro Ludovico Teixeira, 2034 - Centro","addressLocality":"Colinas do Tocantins","addressRegion":"TO","postalCode":"77761-670","addressCountry":"BR"},"geo":{"@type":"GeoCoordinates","latitude":-8.054911,"longitude":-48.482806},"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday"],"opens":"07:00","closes":"18:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":"Saturday","opens":"07:00","closes":"12:00"}],"paymentAccepted":"Cartão de crédito, Cartão de débito, Pix, Dinheiro","hasMap":"https://www.google.com/maps?cid=1146969919196213478","sameAs":["https://www.instagram.com/ronaldoparafusos/","https://www.facebook.com/RONALDOPARAFUSOS2017/","https://www.google.com/maps?cid=1146969919196213478"]}<\/script><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;600&display=swap" rel="stylesheet"><style id="css">'+$("css").textContent+'</style></head><body><div id="root"></div><dialog id="dlg"><form id="f" method="dialog"></form></dialog><dialog id="det"></dialog><script id="data" type="application/json">'+json+'<\/script><script id="app">'+$("app").textContent+'<\/script></body></html>';
}
async function pub(){
  if(!art||!dirty)return;
  openForm("Publicar alterações",[],"Publicar",async function(){await art.publish(build())},"As mudanças ficam visíveis para todos que abrirem o link. A página recarrega ao publicar.");
}
var IC={
 wa:WAI.replace(' class="wai"',"").replace(' width="16" height="16"',""),
 tel:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>',
 ig:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="17.3" cy="6.7" r="1.3" fill="currentColor"/></svg>',
 fb:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M13.6 21v-8h2.7l.4-3.2h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.2H7.7V13h2.7v8z"/></svg>',
 ml:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M3 5h18a1 1 0 0 1 1 1v.4l-10 6.2L2 6.4V6a1 1 0 0 1 1-1zm-1 3.8 10 6.2 10-6.2V18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/></svg>',
 mp:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>',
 ct:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm3 5v2h10V9zm0 3.5v2h7v-2z"/></svg>',
 all:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>',
 cmp:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h15M15 4l4 4-4 4M20 16H5M9 12l-4 4 4 4"/></svg>',
 clk:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
 wz:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.8c-4.9 0-8.7 3.5-8.7 8 0 1.9.7 3.6 1.8 4.9-.2 1.1-.7 2.1-1.5 2.8 1.6.1 3-.4 4-1.1 1.1.4 2.2.6 3.2.6h.4c4.9 0 8.7-3.5 8.7-8.1S16.9 2.8 12 2.8z"/><circle cx="9.2" cy="10" r="1.15" fill="#fff"/><circle cx="14.8" cy="10" r="1.15" fill="#fff"/><path d="M8.7 13c1.6 1.7 4.9 1.7 6.6 0" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>',
 ln:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/></svg>'
};
function mapUrl(){var s=S.s||{},u=safeUrl(s.maps);if(u&&/^https?:/i.test(u))return u;var a=String(s.addr||"").trim();return a?"https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(a):""}
function act(cls,ico,t,sub,href,ext,attrs){return'<a class="act '+cls+'" href="'+esc(href)+'"'+(ext?' target="_blank" rel="noopener"':"")+(attrs||"")+'><span class="acI">'+ico+'</span><span class="acT"><b>'+esc(t)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':"")+'</span><span class="acA" aria-hidden="true">›</span></a>'}
function waHello(){return"https://wa.me/"+waNum()+"?text="+encodeURIComponent("Olá! Vim pelo site do "+tv("brand")+" e gostaria de pedir um orçamento.")}
var CBT={
 wa:{n:"WhatsApp",s:"WhatsApp",l:"Enviar mensagem no WhatsApp",b:"Peça seu orçamento agora",cls:"wa",ic:"wa",ext:1},
 tel:{n:"Ligar",s:"Ligar",l:null,b:null,cls:"tel",ic:"tel"},
 ig:{n:"Instagram",s:"Instagram",l:"Entrar no Instagram",b:null,cls:"ig",ic:"ig",ext:1},
 fb:{n:"Facebook",s:"Facebook",l:"Acessar Facebook",b:"Curta nossa página",cls:"fb",ic:"fb",ext:1},
 ml:{n:"E-mail",s:"E-mail",l:"Enviar e-mail",b:null,cls:"ml",ic:"ml"},
 mp:{n:"Google Maps (como chegar)",s:"Maps",l:"Como chegar: Google Maps",b:"Abrir a rota no Google Maps",cls:"mp",ic:"mp",ext:1},
 wz:{n:"Waze (como chegar)",s:"Waze",l:"Como chegar: Waze",b:"Abrir a rota no Waze",cls:"wz",ic:"wz",ext:1},
 cn:{n:"Ir para o contato do site (aparece só no menu)",s:"Contato",l:null,b:"E-mail e endereço",cls:"cn",ic:"ct"},
 ln:{n:"Outro link (você escolhe)",s:"Link",l:"Novo botão",b:"",cls:"ln",ic:"ln",ext:1}
};
function cbDefL(t){if(t==="tel")return String(tv("call"));if(t==="cn")return String(tv("navCont"));return(CBT[t]||CBT.ln).l||""}
function cbDefB(t){var s=S.s||{};if(t==="tel")return s.phone||"";if(t==="ig")return s.insta?"@"+s.insta:"";if(t==="ml")return s.email||"";return(CBT[t]||CBT.ln).b||""}
function wazeUrl(){var s=S.s||{},u=safeUrl(s.waze);if(u&&/^https?:/i.test(u))return u;var g=String(s.geo||"").replace(/\s/g,"");if(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(g))return"https://waze.com/ul?ll="+g+"&navigate=yes&zoom=17";var a=String(s.addr||"").trim();return a?"https://waze.com/ul?q="+encodeURIComponent(a)+"&navigate=yes":""}
function cbLink(b){
  var s=S.s||{},f=S.f||{},u=String(b.u||"").trim(),t=b.t,d;
  if(u){
    if(/^[\d\s()+\-]+$/.test(u)){d=u.replace(/\D/g,"");d=(d.indexOf("55")===0&&d.length>11)?d:"55"+d;if(t==="tel")return"tel:+"+d;if(t==="wa")return"https://wa.me/"+d}
    if(t==="ml"&&u.indexOf("@")>0&&u.indexOf(":")<0)return"mailto:"+u;
    return safeUrl(u);
  }
  if(t==="wa")return waNum()?waHello():"";
  if(t==="tel")return s.phone?tel():"";
  if(t==="ig")return s.insta?"https://www.instagram.com/"+s.insta+"/":"";
  if(t==="fb")return safeUrl(f.fb);
  if(t==="ml")return s.email?"mailto:"+s.email:"";
  if(t==="mp")return mapUrl();
  if(t==="wz")return wazeUrl();
  if(t==="cn")return"#contato";
  return"";
}
function cbList(){
  var L=S.s&&S.s.cb;
  if(Array.isArray(L))return L;
  return["wa","tel","ig","fb","ml","mp","wz","cn"].map(function(k){return{id:k,t:k,l:"",sb:null,u:""}});
}
function cbRes(b){
  var T0=CBT[b.t]||CBT.ln,href=cbLink(b);if(!href)return null;
  var dl=cbDefL(b.t),own=b.l&&String(b.l).trim();
  return{cls:T0.cls,ic:IC[T0.ic],t:own||dl,sb:b.sb==null?cbDefB(b.t):b.sb,href:href,ext:(T0.ext&&/^https?:/i.test(href))?1:0,s:(own&&own!==dl)?own:T0.s};
}
function contactActs(){
  var s=S.s,ed=canEdit&&edit,a=[];
  cbList().forEach(function(b){
    if(b.t==="cn")return;
    var r=cbRes(b);
    if(r)a.push(act(r.cls,r.ic,r.t,r.sb,r.href,r.ext,' data-cb="'+esc(b.id)+'"'));
    else if(ed)a.push('<div class="achint" data-cb="'+esc(b.id)+'">Botão “'+esc(cbDefL(b.t)||(CBT[b.t]||CBT.ln).n)+'” escondido: falta o link ou o dado dele. Clique com o botão direito aqui para editar.</div>');
  });
  if(ed&&!waOwn())a.push('<div class="achint">Os botões de WhatsApp estão usando o telefone da loja. Se o WhatsApp for outro número, cadastre em “Textos e contato”.</div>');
  return a.join("");
}
function contactSec(){
  var s=S.s;
  return'<section id="contato" class="contact"><div class="wrap"><h2>'+T("contT")+'</h2>'+(tv("contP")?'<p class="ct1">'+T("contP")+'</p>':"")+'<div class="acg">'+contactActs()+'</div><p class="egr egc">'+TRK+'<span><b>Entrega grátis</b> em Colinas do Tocantins · Respondemos no WhatsApp em 2 a 10 minutos</span></p>'+googleBtn()+((s.addr||s.hours)?'<div class="cinfo">'+(s.addr?(mapUrl()?'<a class="cadr" data-ed="s:addr" href="'+esc(mapUrl())+'" target="_blank" rel="noopener" title="Abrir no mapa">'+IC.mp+'<span>'+esc(s.addr)+'</span></a>':'<span data-ed="s:addr">'+IC.mp+'<span>'+esc(s.addr)+'</span></span>'):"")+(s.hours?'<span data-ed="s:hours">'+IC.clk+'<span>'+esc(s.hours)+'</span></span>':"")+'</div>':"")+'</div></section>';
}
var CRI='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4" fill="currentColor"/><circle cx="18" cy="20" r="1.4" fill="currentColor"/><path d="M2.5 3.5h3l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1L21 8H6.2"/></svg>';
var UN=[["un","Unidade","un","un",0],["kg","Quilo (kg)","kg","kg",1],["g","Grama (g)","g","g",1],["m","Metro (m)","m","m",1],["cx","Caixa","caixa","caixas",0],["pct","Pacote","pacote","pacotes",0],["pc","Peça","peça","peças",0],["par","Par","par","pares",0],["jg","Jogo","jogo","jogos",0],["l","Litro (L)","L","L",1],["lata","Lata","lata","latas",0],["sc","Saco","saco","sacos",0],["rl","Rolo","rolo","rolos",0],["br","Barra","barra","barras",0],["mil","Milheiro","milheiro","milheiros",0]];
function unOf(k){for(var i=0;i<UN.length;i++)if(UN[i][0]===k)return UN[i];return UN[0]}
function unStep(k){return k==="g"?100:(unOf(k)[4]?0.5:1)}
function unOpts(sel){return UN.map(function(u){return'<option value="'+u[0]+'"'+(u[0]===sel?" selected":"")+'>'+esc(u[1])+'</option>'}).join("")}
function r2(n){return Math.round(n*100)/100}
function qFmt(q){return String(r2(q)).replace(".",",")}
function qParse(s){var n=parseFloat(String(s).replace(",","."));return isFinite(n)?r2(n):NaN}
function qTxt(q,u){var d=unOf(u);return qFmt(q)+" "+(q===1?d[2]:d[3])}
var CART=[],CNM="",CTM=0;
function cartOn(){return !!waNum()}
function cLoad(){try{var r=JSON.parse(localStorage.getItem("rp_cart_v1")||"null");if(r){CART=(r.i||[]).filter(function(x){return x&&x.id&&isFinite(x.q)&&x.q>0}).map(function(x){return{k:String(x.k||uid()),id:String(x.id),q:+x.q,u:unOf(x.u)[0],o:String(x.o||"").slice(0,80)}});CNM=String(r.n||"").slice(0,60)}}catch(e){}}
function cSave(){try{localStorage.setItem("rp_cart_v1",JSON.stringify({i:CART,n:CNM}))}catch(e){}}
function cLines(){CART.forEach(function(x){var p=prodById(x.id);if(p)x.u=unOf(p.un)[0]});return CART.filter(function(x){return prodById(x.id)})}
function cCount(){return cLines().length}
function cAdd(id,q,u,o){
  o=String(o||"").trim().slice(0,80);
  var ex=CART.filter(function(x){return x.id===id&&x.u===u&&x.o===o})[0];
  if(ex)ex.q=r2(ex.q+q);
  else{if(cLines().length>=40)return false;CART.push({k:uid(),id:id,q:q,u:u,o:o})}
  cSave();return true;
}
var CM_DEF={
 head:"Olá! Gostaria de solicitar um *orçamento* dos itens abaixo:",
 leg:"📋 *COMO LER ESTA LISTA*\nCada item vem separado e traz:\n• Produto (nome)\n• Código\n• Marca\n• Descrição (resumo)\n• Link do produto no site (foto e descrição completa)\n• Unidade de venda\n• Preço no site: dinheiro ou Pix e cartão (quando houver)\n• Quantidade pedida\n• Observação do cliente (quando houver)",
 item:"*ITEM {n} de {total}*\n📦 *Produto:* {produto}\n🔖 *Código:* {codigo}\n🏷️ *Marca:* {marca}\n📝 *Descrição:* {descricao}\n🔗 *Ver no site:* {link}\n📏 *Unidade de venda:* {unidade}\n💰 *Preço (dinheiro ou Pix):* {preco}\n💳 *Preço no cartão:* {cartao}\n🔢 *Quantidade:* {quantidade}\n💬 *Observação do item {n}:* {obs}",
 sep:"━━━━━━━━━━━━━━",
 foot:"🧾 *Total de itens:* {total}\n👤 *Cliente:* {nome}\nAguardo o retorno com valores e disponibilidade. Obrigado!"
};
var CM_COMPACT="{n}) *{produto}* – {quantidade}\n     Cód.: {codigo}\n     Site: {link}\n     Dinheiro/Pix: {preco}\n     Cartão: {cartao}\n     Obs.: {obs}";
var CM_MIN="{n}) *{produto}* – {quantidade}\n     Cód.: {codigo}\n     {link}";
/* Preços do produto como estão no site. sh=1: sem o "de R$ …" e o selo de desconto (formato curto). Sem preço no site: tudo vazio. */
function cPrices(p,sh){
  var r={preco:"",cartao:""};
  if(!hasP(p))return r;
  r.preco=money(p.p);
  if(!sh){var x=[];if(String(p.po||"").trim())x.push("de "+money(p.po));var b=badgeOf(p);if(b)x.push(b);if(x.length)r.preco+=" ("+x.join(" · ")+")"}
  var c=pnum(p.pc);
  if(c!=null){var k=Math.max(1,parseInt(p.pn,10)||1);r.cartao=k>1?fm(c)+" em até "+k+"x de "+fm(Math.round(c/k*100)/100):fm(c)}
  return r}
function cmGet(k){var c=S.s&&S.s.cm;return(c&&c[k]!=null)?c[k]:CM_DEF[k]}
function cDesc(p){var d=String(p.d||"").replace(/\s+/g," ").trim();if(d.length>80){d=d.slice(0,80);var i=d.lastIndexOf(" ");if(i>50)d=d.slice(0,i);d=d.replace(/[\s,;:.\-]+$/,"")+"…"}return d}
function fillT(tpl,v){
  /* Linha só com campos opcionais (código, marca, descrição, preço, cartão, obs, nome) vazios some.
     Linha que também traz produto/quantidade/unidade nunca some: o campo vazio vira "—" (ou some entre parênteses). */
  var OPT={codigo:1,marca:1,descricao:1,obs:1,nome:1,preco:1,cartao:1,link:1},CORE={produto:1,quantidade:1,unidade:1},RX=/\{(n|total|produto|codigo|marca|descricao|unidade|quantidade|obs|nome|preco|cartao|link)\}/g;
  return String(tpl).split("\n").map(function(line){
    var nOpt=0,eOpt=0,core=false;
    line.replace(RX,function(m,k){var x=v[k],e=(x==null||x==="");if(OPT[k]){nOpt++;if(e)eOpt++}if(CORE[k])core=true;return m});
    if(nOpt&&eOpt===nOpt&&!core)return null;
    var out=line.replace(RX,function(m,k){var x=v[k];return(x==null||x==="")?"—":x});
    if(nOpt&&eOpt)out=out.replace(/\s*[\(\[]\s*—\s*[\)\]]/g,"");
    return out}).filter(function(l){return l!==null}).join("\n")}
function cMsg(mode){
  var ls=cLines(),n=ls.length,co=mode>=1,nome=CNM.trim(),out=[];
  var items=ls.map(function(x,i){var p=prodById(x.id),d=unOf(x.u);var pr=cPrices(p,co);return fillT(mode===2?CM_MIN:co?CM_COMPACT:cmGet("item"),{n:i+1,total:n,produto:p.n,codigo:p.code||"",marca:p.brand||"",descricao:co?"":cDesc(p),unidade:d[1],preco:pr.preco,cartao:pr.cartao,link:siteBase()+pHref(p),quantidade:qTxt(x.q,x.u),obs:x.o,nome:nome})});
  var g={total:n,nome:nome},head=fillT(cmGet("head"),g),leg=co?"":fillT(cmGet("leg"),g),foot=fillT(cmGet("foot"),g),sep=co?"":String(cmGet("sep")).trim();
  if(head)out.push(head);
  if(leg)out.push(leg);
  if(co){out.push(items.join("\n"))}
  else{if(sep)out.push(sep);items.forEach(function(it,i){out.push(it);if(sep)out.push(sep)})}
  if(CENT)out.push(CENT==="e"?"🚚 *Entrega:* quero receber"+(CEND.trim()?" no endereço: "+CEND.trim():" (informo o endereço por aqui)"):"🏪 *Retirada:* vou retirar na loja");
  if(foot)out.push(foot);
  return out.join("\n\n");
}
function cWa(){var nu=waNum();if(!nu)return"";var m=cMsg();if(encodeURIComponent(m).length>6500)m=cMsg(1);if(encodeURIComponent(m).length>6500)m=cMsg(2);return"https://wa.me/"+nu+"?text="+encodeURIComponent(m)}
function cLive(){var a=$("cwa");if(a)a.href=cWa();var p=$("cpre");if(p)p.textContent=(encodeURIComponent(cMsg()).length>6500)?cMsg(1):cMsg()}
function cmForm(){
  openForm("Mensagem do carrinho (WhatsApp)",[
    {k:"head",l:"1) Abertura (primeira linha da mensagem)",t:"area",rows:2,v:cmGet("head")},
    {k:"leg",l:"2) Legenda que aparece acima dos itens: explica o que cada item traz (deixe vazio para não mostrar)",t:"area",rows:8,v:cmGet("leg")},
    {k:"item",l:"3) Modelo de cada item. Campos: {n} {total} {produto} {codigo} {marca} {descricao} {unidade} {preco} {cartao} {link} {quantidade} {obs}. {preco} e {cartao} vêm do cadastro do produto (preço à vista e preço no cartão); {link} é o endereço do produto no site. Se um dado estiver vazio (código, marca, descrição, preço, cartão ou observação), a linha que só tem esse dado some sozinha",t:"area",rows:9,v:cmGet("item")},
    {k:"sep",l:"4) Linha separadora entre os itens (vazio = sem separador)",v:cmGet("sep")},
    {k:"foot",l:"5) Fechamento. Campos: {total} e {nome} (nome que o cliente digitou)",t:"area",rows:4,v:cmGet("foot")},
    {k:"rst",l:"Voltar tudo ao texto padrão ao salvar?",t:"select",v:"",o:[["","Não, usar o que escrevi acima"],["1","Sim, restaurar o texto padrão (ignora o que escrevi)"]]}
  ],"Salvar",function(v){
    if(v.rst==="1"){delete S.s.cm;return}
    if(!String(v.item||"").trim())return"O modelo de cada item não pode ficar vazio.";
    S.s.cm={head:v.head,leg:v.leg,item:v.item,sep:v.sep,foot:v.foot};
  },"Esta é a mensagem que o cliente envia pelo WhatsApp ao pedir orçamento do carrinho. Use *texto* para negrito. Para ver como ficou, adicione produtos ao carrinho e abra a página do carrinho (no modo de edição aparece uma prévia).");
}
function cBadge(){var n=cCount();Array.prototype.forEach.call(document.querySelectorAll(".cbadge"),function(b){b.textContent=n;b.hidden=!n})}
function cartHd(){if(!cartOn())return"";var n=cCount();return'<a class="cartb" href="#carrinho" aria-label="'+esc(tv("cartT"))+'" title="'+esc(tv("cartT"))+'">'+CRI+'<span class="cbl">'+T("cartS")+'</span><span class="cbadge"'+(n?"":" hidden")+'>'+n+'</span></a>'}
function qtyH(q,u){var d=unOf(u);return'<div class="qrow"><div class="qs"><button type="button" data-act="qs" data-id="-1" aria-label="Diminuir a quantidade">−</button><input class="cqq" inputmode="decimal" autocomplete="off" value="'+qFmt(q)+'" aria-label="Quantidade"><button type="button" data-act="qs" data-id="1" aria-label="Aumentar a quantidade">+</button></div><div class="qun" title="Unidade de venda deste produto"><small>Vendido por</small><b>'+esc(d[1])+'</b><input type="hidden" class="cqu" value="'+d[0]+'"></div></div>'}
function cAddH(p){return'<div class="qc">'+qtyH(1,unOf(p.un)[0])+'<input class="qo" maxlength="80" autocomplete="off" placeholder="'+esc(tv("cartObs"))+'" aria-label="Observação"><p class="qerr" role="alert"></p><button class="btn dark cadd" type="button" data-act="cadd" data-id="'+esc(p.id)+'">'+CRI+T("cartAdd")+'</button></div>'}
function cstH(id){var ls=CART.filter(function(x){return x.id===id});if(!ls.length)return"";return"✓ No carrinho: "+ls.map(function(x){return esc(qTxt(x.q,x.u))}).join(" + ")+'. <a href="#carrinho">'+T("cartGo")+'</a>'}
function cartBox(p){return'<div class="cbx"><b class="cbxt">'+T("cartBoxT")+'</b><p class="cbxd">'+T("cartBoxD")+'</p>'+cAddH(p)+'<p class="cst" id="cst">'+cstH(p.id)+'</p></div>'}
function cqBtn(id){return cartOn()?'<button class="cq" type="button" data-act="cq" data-id="'+esc(id)+'">'+CRI+'<span class="cl">'+T("cartAdd")+'</span><span class="cs">'+T("cartAddS")+'</span></button>':""}
function cToast(msg){var el=$("ctoast");if(!el){el=document.createElement("div");el.id="ctoast";el.className="ctoast";el.setAttribute("role","status");document.body.appendChild(el)}el.innerHTML='<span>✓ '+esc(msg)+'</span><a href="#carrinho">'+T("cartGo")+' ›</a>';el.classList.add("on");clearTimeout(CTM);CTM=setTimeout(function(){el.classList.remove("on")},5500)}
function cqBox(id){
  var p=prodById(id);if(!p)return;
  var dl=$("cqd");
  if(!dl){dl=document.createElement("dialog");dl.id="cqd";document.body.appendChild(dl);dl.addEventListener("click",function(e){if(e.target===dl)dl.close()})}
  dl.setAttribute("aria-label",tv("cartAdd"));
  dl.innerHTML='<h3>'+T("cartAdd")+'</h3><p class="cqn"><b>'+esc(p.n)+'</b>'+(p.code?'<small>Cód.: '+esc(p.code)+'</small>':"")+'</p>'+cAddH(p)+'<div class="row"><button class="btn dark" type="button" data-act="cqx">Cancelar</button></div>';
  if(!dl.open)dl.showModal();
  if(!isTouch()){var i=dl.querySelector(".cqq");if(i){i.focus();i.select()}}
}
function cDoAdd(b,id){
  var qc=b.closest(".qc");if(!qc)return;
  var i=qc.querySelector(".cqq"),q=qParse(i.value),er=qc.querySelector(".qerr"),p=prodById(id);
  if(!p)return;
  var u=unOf(p.un)[0];
  if(!isFinite(q)||q<=0){if(er)er.textContent="Informe a quantidade (exemplos: 1, 10 ou 2,5).";i.focus();return}
  if(!unOf(u)[4])q=Math.max(1,Math.ceil(q));
  if(q>99999)q=99999;
  if(!cAdd(id,q,u,qc.querySelector(".qo").value)){if(er)er.textContent="O carrinho aceita até 40 produtos diferentes. Envie este orçamento e faça outro depois.";return}
  if(er)er.textContent="";
  var qd=$("cqd");if(qd&&qd.open)qd.close();
  cBadge();cToast(tv("cartOk")+": "+p.n+" ("+qTxt(q,u)+")");
  var st=$("cst");if(st&&view===id)st.innerHTML=cstH(id);
  i.value="1";var o=qc.querySelector(".qo");if(o)o.value="";
}
function qStep(b,dir){
  var w=b.closest(".qc,.cri");if(!w)return;
  var i=w.querySelector(".cqq"),u=w.querySelector(".cqu").value,st=unStep(u),q=qParse(i.value);
  if(!isFinite(q)||q<=0)q=st;
  q=dir>0?q+st:q-st;
  if(q<st)q=st;
  if(!unOf(u)[4])q=Math.round(q);
  i.value=qFmt(q);
  if(w.classList.contains("cri"))cRow(i);
}
function cRow(el){
  var r=el.closest(".cri");if(!r)return;
  var x=CART.filter(function(i){return i.k===r.getAttribute("data-k")})[0];if(!x)return;
  var pp=prodById(x.id),u=pp?unOf(pp.un)[0]:x.u,q=qParse(r.querySelector(".cqq").value);
  if(isFinite(q)&&q>0){if(!unOf(u)[4])q=Math.max(1,Math.round(q));x.q=q}
  x.u=u;x.o=r.querySelector(".qo").value.trim().slice(0,80);
  cSave();cLive();
}
function cPriceH(p){
  var r=cPrices(p,1);if(!r.preco)return"";
  var h='<div class="crp"><span class="crp1">'+(String(p.po||"").trim()?'<s>'+esc(money(p.po))+'</s> ':"")+'<b>'+esc(r.preco)+'</b>'+(tv("cash")?' <em>'+T("cash")+'</em>':"")+'</span>';
  if(r.cartao)h+='<span class="crp2">ou <b>'+esc(r.cartao)+'</b> no cartão</span>';
  return h+'</div>'}
function cartPage(){
  var ls=cLines(),n=ls.length,h='<div class="pp"><div class="wrap"><div class="bc"><a href="#inicio">'+T("bcH")+'</a><span>›</span><span>'+T("cartT")+'</span></div><h1 class="pt"><span class="pti">'+CRI+'</span>'+T("cartT")+'</h1>';
  if(!n)return h+'<div class="empty cem"><b>'+T("cartEmpty")+'</b><p>'+T("cartEmptyD")+'</p><a class="btn" href="#produtos">'+T("cartMore")+'</a></div></div></div>';
  h+='<p class="meta">'+n+(n===1?" produto":" produtos")+' na lista</p><div class="crl">';
  ls.forEach(function(x){
    var p=prodById(x.id),c=catOf(p.c)||{i:"🔩"},sm=[p.code?"Cód.: "+esc(p.code):"",p.brand?"Marca: "+esc(p.brand):""].filter(Boolean).join(" · ");
    h+='<div class="cri" data-k="'+esc(x.k)+'"><a class="crim" href="'+esc(pHref(p))+'">'+(p.img?'<img src="'+esc(rpImg(p.img))+'" alt="" loading="lazy">':catIcon(c))+'</a><div class="crb"><a class="crn" href="'+esc(pHref(p))+'">'+esc(p.n)+'</a>'+(sm?'<small>'+sm+'</small>':"")+cPriceH(p)+qtyH(x.q,x.u)+'<input class="qo" maxlength="80" autocomplete="off" value="'+esc(x.o)+'" placeholder="'+esc(tv("cartObs"))+'" aria-label="Observação"><button class="lnk2 crm" type="button" data-act="crm" data-id="'+esc(x.k)+'">'+T("cartRm")+'</button></div></div>';
  });
  h+='</div><div class="crs" data-ed="cm">'+cEntH()+'<label for="cnm">'+T("cartName")+'</label><input id="cnm" maxlength="60" autocomplete="name" value="'+esc(CNM)+'">'+act("wa xl",IC.wa,tv("cartSend"),"",cWa(),1,' id="cwa"')+'<p class="note">'+T("cartNote")+'</p><div class="crt"><a class="btn dark sm" href="#produtos">'+T("cartMore")+'</a><button class="btn sm" type="button" data-act="ccopy">'+T("cartCopy")+'</button><button class="lnk2" type="button" data-act="cclr" id="cclr">'+T("cartClr")+'</button></div><p class="note" id="ccm" role="status"></p>'+(canEdit&&edit?'<details class="cprv"><summary>Prévia da mensagem que o WhatsApp vai receber (só você vê)</summary><pre id="cpre"></pre><button class="btn dark sm" type="button" data-act="ecm">Editar esta mensagem</button></details>':"")+'</div></div></div>';
  return h;
}
function boxActs(p){
  var s=S.s,w=waLink(p),h="";
  h+=w?act("wa xl",IC.wa,hasP(p)?T("orderB"):T("quoteB"),"",w,1):act("tel sm",IC.tel,"Solicitar orçamento",s.phone,tel());
  if(cartOn())h+=cartBox(p);
  if(w)h+=act("tel sm",IC.tel,T("call"),s.phone,tel());
  return h;
}
function kacts(){
  var a=[];
  cbList().forEach(function(b){var r=cbRes(b);if(!r)return;a.push(act(r.cls,r.ic,r.s,"",r.href,r.ext,' data-cb="'+esc(b.id)+'"'))});
  return a.join("");
}
var CMP=[],CPC=null,cpW=null,cpDiff=false,CP_MAX=4;
var CPI='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h15M15 4l4 4-4 4M20 16H5M9 12l-4 4 4 4"/></svg>';
function prodById(id){return S.prods.filter(function(x){return x.id===id})[0]}
function cgKey(p){var g=norm(String(p.cg||"").trim());return g?"g:"+g:"c:"+p.c}
function cgName(p){var g=String(p.cg||"").trim();if(g)return g;var c=catOf(p.c);return c?c.n:"Produtos"}
function cgOpts(){var a=[];S.prods.forEach(function(p){var g=String(p.cg||"").trim();if(g&&a.indexOf(g)<0)a.push(g)});return a}
function cpSpecs(p){return lines(p.cmp).filter(function(l){return l.indexOf(":")>0}).map(function(l){var i=l.indexOf(":");return{k:l.slice(0,i).trim(),v:l.slice(i+1).trim()}}).filter(function(x){return x.k})}
function cpEligible(p){return cpSpecs(p).length>0}
function cpCount(p){if(!CPC){CPC={};S.prods.forEach(function(x){if(cpEligible(x)){var k=cgKey(x);CPC[k]=(CPC[k]||0)+1}})}return CPC[cgKey(p)]||0}
function cpShow(p){return cpEligible(p)&&cpCount(p)>=2}
function cpHas(id){return CMP.indexOf(id)>=0}
function cpClean(){CMP=CMP.filter(function(id){return !!prodById(id)})}
function cpHash(){return"#comparar"+(CMP.length?"-"+CMP.join(","):"")}
function cpBtn(id){var on=cpHas(id);return'<button class="cpb'+(on?" on":"")+'" type="button" data-act="cp" data-id="'+esc(id)+'" aria-pressed="'+on+'" title="Comparar com produtos parecidos">'+CPI+'<span class="cpl">'+(on?tv("cmpOn"):tv("cmpL"))+'</span></button>'}
function cpBig(id){var on=cpHas(id);return'<button class="btn cpx'+(on?" on":"")+'" type="button" data-act="cp" data-id="'+esc(id)+'" aria-pressed="'+on+'">'+CPI+'<span class="cpl">'+(on?tv("cmpBon"):tv("cmpB"))+'</span></button>'}
function cpSimSec(p){
  if(!cpShow(p))return"";
  var o=S.prods.filter(function(x){return x.id!==p.id&&cpEligible(x)&&cgKey(x)===cgKey(p)}).slice(0,8);if(!o.length)return"";
  return'<div class="sec"><h2>Compare com produtos parecidos</h2><p class="note">Tipo: '+esc(cgName(p))+'. Escolha os que quiser e use o botão “Comparar” da barra que aparece embaixo da tela.</p>'+o.map(function(x){var c=catOf(x.c)||{i:"🔩"};return'<div class="cpr"><a class="cpi" href="'+esc(pHref(x))+'" tabindex="-1" aria-hidden="true">'+(x.img?'<img src="'+esc(rpImg(x.img))+'" alt="" loading="lazy">':catIcon(c))+'</a><a class="cpnm" href="'+esc(pHref(x))+'">'+esc(x.n)+'</a>'+cpBtn(x.id)+'</div>'}).join("")+'</div>';
}
function cpToggle(id){
  var p=prodById(id);if(!p)return;cpClean();cpW=null;var i=CMP.indexOf(id);
  if(i>=0)CMP.splice(i,1);
  else if(CMP.length&&cgKey(prodById(CMP[0]))!==cgKey(p))cpW={id:id,t:"Só dá para comparar produtos do mesmo tipo. Agora você está comparando: "+cgName(prodById(CMP[0]))+"."};
  else if(CMP.length>=CP_MAX)cpW={t:"Dá para comparar até "+CP_MAX+" produtos de cada vez. Tire um para colocar outro."};
  else CMP.push(id);
  cpRefresh();
}
function cpListUpd(){var l=$("cpl");if(!l)return;var ps=CMP.map(prodById).filter(Boolean),key=ps.length?cgKey(ps[0]):CPG,g=cpGroups().filter(function(x){return x.k===key})[0];if(g)l.innerHTML=cpListH(g)}
document.addEventListener("input",function(e){if(e.target&&e.target.id==="cpq"){CPQ=e.target.value;CPN=20;cpListUpd()}});
function cpSync(){document.body.classList.toggle("hascp",CMP.length>0&&pg!=="compare")}
function cpRefresh(){
  cpClean();
  var w=$("cptw");if(w)w.innerHTML=cpTrayH();
  cpSync();
  Array.prototype.forEach.call(document.querySelectorAll(".cpb[data-id],.cpx[data-id]"),function(b){var on=cpHas(b.getAttribute("data-id")),big=b.classList.contains("cpx");b.classList.toggle("on",on);b.setAttribute("aria-pressed",String(on));var l=b.querySelector(".cpl");if(l)l.textContent=big?(on?tv("cmpBon"):tv("cmpB")):(on?tv("cmpOn"):tv("cmpL"))});
  if(pg==="compare"){var c=$("cpc");if(c)c.innerHTML=compBody();try{history.replaceState(null,"",cpHash())}catch(e){}}
}
function cpTrayH(){
  cpClean();if(!CMP.length||pg==="compare")return"";
  var ps=CMP.map(prodById),n=ps.length,h='<div class="cptr" role="region" aria-label="Produtos para comparar"><div class="wrap">';
  if(cpW)h+='<div class="cpwn" role="status"><span>'+esc(cpW.t)+'</span>'+(cpW.id?'<button class="btn sm" type="button" data-act="cpnew" data-id="'+esc(cpW.id)+'">Começar nova comparação com este</button>':"")+'</div>';
  h+='<div class="cpin"><div class="cpl3"><b>Comparar:</b>'+ps.map(function(p){return'<span class="cpc"><span>'+esc(p.n)+'</span><button type="button" data-act="cp" data-id="'+esc(p.id)+'" aria-label="Tirar '+esc(p.n)+' da comparação">×</button></span>'}).join("")+'</div>';
  h+='<button class="btn" type="button" data-act="cpgo"'+(n<2?' disabled':"")+'>'+(n<2?"Escolha mais 1":"Comparar ("+n+")")+'</button><button class="lnk2" type="button" data-act="cpclr">Limpar</button></div></div></div>';
  return h;
}
var CPG=null,CPQ="",CPN=20;
function cpGroups(){var g={},ord=[];S.prods.forEach(function(p){if(!cpEligible(p))return;var k=cgKey(p);if(!g[k]){g[k]={k:k,n:cgName(p),a:[]};ord.push(k)}g[k].a.push(p)});return ord.map(function(k){return g[k]}).filter(function(x){return x.a.length>=2})}
function cpRow(p){
  var c=catOf(p.c)||{i:"🔩"},sub=[p.brand||"",p.code?"Cód. "+p.code:""].filter(Boolean).join(" · ");
  return'<div class="cpr"><a class="cpi" href="'+esc(pHref(p))+'" tabindex="-1" aria-hidden="true">'+(p.img?'<img src="'+esc(rpImg(p.img))+'" alt="" loading="lazy">':catIcon(c))+'</a><div class="cpnm2"><a class="cpnm" href="'+esc(pHref(p))+'">'+esc(p.n)+'</a>'+(sub?'<small>'+esc(sub)+'</small>':"")+'</div>'+cpBtn(p.id)+'</div>';
}
function cpListH(g){
  var q=norm(CPQ.trim()),a=g.a.filter(function(p){return !cpHas(p.id)&&(!q||norm(p.n+" "+(p.brand||"")+" "+(p.code||"")).indexOf(q)>=0)}),sh=a.slice(0,CPN);
  if(!a.length)return'<p class="note">'+(g.a.every(function(p){return cpHas(p.id)})?"Todos os produtos deste tipo já estão na comparação.":"Nenhum produto encontrado. Tente outra palavra.")+'</p>';
  return sh.map(cpRow).join("")+(a.length>sh.length?'<p class="frow"><button class="btn dark sm" type="button" data-act="cpmore">Ver mais ('+(a.length-sh.length)+')</button></p>':"");
}
function cpFinder(ps){
  var gs=cpGroups();if(!gs.length)return"";
  var key=ps.length?cgKey(ps[0]):CPG,g=key?gs.filter(function(x){return x.k===key})[0]:null;
  if(!g){
    return'<h2 class="cph2">1. Escolha o tipo de produto</h2><div class="cpg">'+gs.map(function(x){return'<button class="cpgb" type="button" data-act="cpg" data-id="'+esc(x.k)+'"><b>'+esc(x.n)+'</b><small>'+x.a.length+' produtos para comparar</small></button>'}).join("")+'</div>';
  }
  return'<h2 class="cph2">'+(ps.length?'Adicionar mais produtos':'2. Escolha os produtos')+'</h2><p class="meta">Tipo: <b>'+esc(g.n)+'</b>'+(ps.length?"":' · <button class="lnk2" type="button" data-act="cpgb">Trocar tipo</button>')+'</p><input id="cpq" class="cpq" type="search" autocomplete="off" placeholder="Buscar neste tipo (nome, marca ou código)" aria-label="Buscar produto para comparar" value="'+esc(CPQ)+'"><div id="cpl">'+cpListH(g)+'</div>';
}
function compBody(){
  cpClean();
  var ps=CMP.map(prodById),n=ps.length,h="";
  if(n)h+='<div class="cpsel" role="list">'+ps.map(function(p){return'<span class="cpc" role="listitem"><span>'+esc(p.n)+'</span><button type="button" data-act="cp" data-id="'+esc(p.id)+'" aria-label="Tirar '+esc(p.n)+' da comparação">×</button></span>'}).join("")+'<button class="lnk2" type="button" data-act="cpclr">Limpar</button></div>';
  if(n<2){
    var any=S.prods.some(cpEligible),fd=cpFinder(ps);
    h+='<p class="meta">'+(n===1?"Escolha mais 1 produto do mesmo tipo para ver a comparação lado a lado.":"Compare produtos do mesmo tipo lado a lado: veja o que muda entre eles e escolha o melhor para você.")+'</p>';
    if(!fd)h+='<div class="empty" style="margin-top:16px">'+(any?'Ainda não há 2 produtos do mesmo tipo liberados para comparação.':'Ainda não há produtos liberados para comparação.')+((canEdit&&edit)?'<br>Edite um produto e preencha a aba “Comparação”.':"")+'</div>';
    return h+fd;
  }
  h+='<p class="meta">Tipo: <b>'+esc(cgName(ps[0]))+'</b> · '+n+' produtos escolhidos</p>';
  var rows=[],idx=Object.create(null);
  if(ps.some(function(p){return p.brand}))rows.push({k:"Marca",v:ps.map(function(p){return p.brand||""})});
  if(ps.some(function(p){return p.code}))rows.push({k:"Referência",v:ps.map(function(p){return p.code||""})});
  if(ps.some(function(p){return p.rt}))rows.push({k:"Avaliação",v:ps.map(function(p){return p.rt?String(p.rt):""}),f:function(x){return stars(x)}});
  ps.forEach(function(p,pi){cpSpecs(p).forEach(function(sp){var k=norm(sp.k).replace(/\s+/g," ");if(!(k in idx)){idx[k]=rows.length;rows.push({k:sp.k,v:[]})}var r=rows[idx[k]];if(r.v[pi]==null)r.v[pi]=sp.v})});
  rows.forEach(function(r){r.v=ps.map(function(_,i){return r.v[i]==null?"":String(r.v[i])});var b=r.v.map(function(x){return norm(x).replace(/\s+/g," ")});r.d=b.some(function(x){return x!==b[0]})});
  var nd=rows.filter(function(r){return r.d}).length;
  h+='<div class="cpsum"><span>'+(nd?'<b>'+nd+'</b> de '+rows.length+' características são diferentes (destacadas em amarelo).':'Todas as características informadas são iguais.')+'</span><label class="fl2"><input type="checkbox" data-act="cpd"'+(cpDiff?" checked":"")+'> Mostrar só as diferenças</label><button class="btn sm dark" type="button" data-act="shcmp">'+SHI+'Compartilhar</button></div>';
  h+='<a class="lau-jump" href="#parecer" onclick="var e=document.getElementById(\'parecer\');if(e){e.scrollIntoView({behavior:\'smooth\'});return false}">📋 Ver parecer técnico ↓</a><div class="cpw"><table class="cpt" style="--n:'+n+'"><colgroup><col class="cpk">'+ps.map(function(){return"<col>"}).join("")+'</colgroup><thead><tr><th scope="col"><span class="vh">Característica</span></th>'+ps.map(function(p){return'<th scope="col"><div class="cph"><button class="cpx2" type="button" data-act="cp" data-id="'+esc(p.id)+'" aria-label="Tirar '+esc(p.n)+' da comparação">×</button><a class="ph cpim" href="'+esc(pHref(p))+'">'+(p.img?'<img src="'+esc(rpImg(p.img))+'" alt="" loading="lazy">':catIcon(catOf(p.c)||{i:"🔩"}))+'</a><a class="cpn" href="'+esc(pHref(p))+'">'+esc(p.n)+'</a>'+priceBlock(p)+quoteA(p,"btn sm")+'</div></th>'}).join("")+'</tr></thead><tbody>';
  rows.forEach(function(r){h+='<tr'+(r.d?' class="diff"':"")+((cpDiff&&!r.d)?" hidden":"")+'><th scope="row">'+esc(r.k)+'</th>'+r.v.map(function(x){return'<td>'+(x?(r.f?r.f(x):esc(x)):'<span class="cpm">—</span>')+'</td>'}).join("")+'</tr>'});
  if(ps.some(function(p){return lines(p.cmpd).length}))h+='<tr class="cpdf"><th scope="row">Diferenciais e indicação</th>'+ps.map(function(p){var a=lines(p.cmpd);return'<td>'+(a.length?'<ul>'+a.map(function(l){return'<li>'+esc(l)+'</li>'}).join("")+'</ul>':'<span class="cpm">—</span>')+'</td>'}).join("")+'</tr>';
  return h+'</tbody></table></div>'+cpLaudo(ps)+'<details class="cpmb"><summary>Adicionar ou trocar produtos</summary>'+cpFinder(ps)+'</details>';
}

function brImg(x){return typeof rpImg==="function"?rpImg(x):(/^(https?:|img\/|\/)/.test(x)?x:"/_blob/"+x)}
function brCount(){var c={};S.prods.forEach(function(p){if(p.brand)c[p.brand]=(c[p.brand]||0)+1});return c}
function brSorted(){var c=brCount();return(S.brands||[]).filter(function(b){return c[b.n]}).slice().sort(function(a,b){return((b.img?1:0)-(a.img?1:0))||((c[b.n]||0)-(c[a.n]||0))})}
function brBtn(b,c){return'<button class="bt" type="button" data-act="bf" data-id="'+esc(b.n)+'" aria-label="'+esc(b.n)+'" title="'+esc(b.n)+(c?" ("+cnt(c)+")":"")+'">'+(b.img?'<img src="'+esc(brImg(b.img))+'" alt="'+esc(b.n)+'" loading="lazy">':'<span class="btn2">'+esc(b.n)+'</span>')+'</button>'}
function brHome(){var a=brSorted(),c=brCount(),sh=a.filter(function(b){return b.img}).slice(0,60);if(!sh.length)sh=a.slice(0,24);return sh.map(function(b){return brBtn(b,c[b.n])}).join("")+'</div><p class="bmrow"><a class="btn bmall" href="#marcas">Ver todas as marcas</a></p><div hidden>'}
var BRQ="";
function brListH(){var c=brCount(),q=norm(BRQ.trim()),a=brSorted().filter(function(b){return!q||norm(b.n).indexOf(q)>=0});if(!a.length)return'<p class="note">Nenhuma marca encontrada.</p>';return'<div class="bla">'+a.map(function(b){return'<a class="bra" href="#marca-'+esc(slug(b.n))+'"><span class="brl">'+(b.img?'<img src="'+esc(brImg(b.img))+'" alt="" loading="lazy">':'<b>'+esc(b.n.slice(0,1))+'</b>')+'</span><span class="brn">'+esc(b.n)+'<small>'+cnt(c[b.n]||0)+'</small></span></a>'}).join("")+'</div>'}
function brandsPage(){return'<div class="pp"><div class="wrap"><div class="bc"><a href="#inicio">'+T("bcH")+'</a><span>›</span><span>Marcas</span></div><h1 class="pt">Todas as marcas</h1><input id="brq" class="cpq" type="search" autocomplete="off" placeholder="Buscar marca" aria-label="Buscar marca" value="'+esc(BRQ)+'"><div id="brl">'+brListH()+'</div></div></div>'}
document.addEventListener("input",function(e){if(e.target&&e.target.id==="brq"){BRQ=e.target.value;var l=$("brl");if(l)l.innerHTML=brListH()}});
function lauNum(v){var m=String(v).match(/\d[\d.,]*/g);if(!m)return null;var a=m.map(function(s){if(/^\d{1,3}(\.\d{3})+$/.test(s))s=s.replace(/\./g,"");else s=s.replace(/\./g,"").replace(",",".");return parseFloat(s)}).filter(function(x){return!isNaN(x)});return a.length?Math.max.apply(null,a):null}
var LAUK=[
 {k:"pot",re:/^potencia/,u:"W",hi:1,lb:"Mais potente",why:"aguenta melhor serviço pesado e uso contínuo"},
 {k:"rpm",re:/^rotacao/,u:"rpm",hi:1,lb:"Maior rotação",why:"trabalha com maior velocidade"},
 {k:"disc",re:/diametro do disco|tamanho do disco/,u:"mm",hi:1,lb:"Maior disco",why:"faz cortes mais profundos"},
 {k:"torq",re:/^torque( de aperto)?$|^torque/,u:"Nm",hi:1,lb:"Maior torque",why:"solta e aperta parafusos e porcas mais pesados"},
 {k:"ipm",re:/impactos/,u:"ipm",hi:1,lb:"Mais impactos por minuto",why:"fura alvenaria e concreto com mais facilidade"},
 {k:"ej",re:/energia de impacto/,u:"J",hi:1,lb:"Maior energia de impacto",why:"rende mais em concreto e demolição"},
 {k:"conc",re:/(furo|capacidade) em concreto/,u:"mm",hi:1,lb:"Maior furo em concreto",why:"faz furos maiores em concreto"},
 {k:"ah",re:/^capacidade$|amperes/,u:"Ah",hi:1,lb:"Maior capacidade de bateria",why:"trabalha mais tempo entre uma carga e outra"},
 {k:"alc",re:/^alcance/,u:"m",hi:1,lb:"Maior alcance",why:"mede ou projeta a distâncias maiores"},
 {k:"peso",re:/^peso/,u:"kg",hi:0,lb:"Mais leve",why:"cansa menos em uso prolongado e acima da cabeça"}
];
function lauFmt(x,u){var s=(Math.round(x*100)/100).toLocaleString("pt-BR");return s+" "+u}
function lauData(p){
  var d={n:p.n,brand:p.brand||"",v:{},flags:{}},all=[];
  lines(p.cmp).concat(lines(p.s)).forEach(function(l){var i=l.indexOf(":");if(i<1)return;var k=norm(l.slice(0,i).trim()),v=l.slice(i+1).trim();all.push(norm(v));
    LAUK.forEach(function(m){if(d.v[m.k]==null&&m.re.test(k)){if(m.k==="ah"&&!/ah/i.test(v))return;var x=lauNum(v);if(x!=null&&x>0)d.v[m.k]=x}});
    if(/^tensao/.test(k)){d.tensao=v;var t=lauNum(v);if(t&&t<=60)d.flags.bat=1;if(t&&t>=100)d.flags.fio=1}
    if(/^alimentacao/.test(k)&&/bateria/i.test(v))d.flags.bat=1});
  var nn=norm(p.n);
  if(/bateria|\b(12|18|20|36|40|60) ?v\b/.test(nn)&&!/\b(127|220) ?v\b/.test(nn))d.flags.bat=1;
  if(/brushless/.test(nn)||all.some(function(v){return/brushless|sem escovas/.test(v)}))d.flags.bl=1;
  if(/sem bateria/.test(nn))d.flags.semb=1;
  return d;
}
function cpLaudo(ps){
  var D=ps.map(lauData),out=[],perfil=ps.map(function(){return[]}),nm=function(i){return'<b>'+esc(ps[i].n)+'</b>'+(ps[i].brand?' ('+esc(ps[i].brand)+')':'')};
  LAUK.forEach(function(m){
    var vals=D.map(function(d){return d.v[m.k]}),ok=vals.filter(function(x){return x!=null});
    if(ok.length<2)return;var best=m.hi?Math.max.apply(null,ok):Math.min.apply(null,ok),worst=m.hi?Math.min.apply(null,ok):Math.max.apply(null,ok);
    if(best===worst)return;
    var w=[];vals.forEach(function(x,i){if(x===best)w.push(i)});if(w.length!==1)return;
    var i=w[0],dif=m.hi?(best/worst-1):(1-best/worst),pc=Math.round(dif*100);
    out.push('<li><span class="lau-k">'+m.lb+':</span> '+nm(i)+' — '+lauFmt(best,m.u)+(pc>=5?' ('+pc+'% '+(m.hi?'a mais':'a menos')+' que o '+(m.hi?'menor':'mais pesado')+' da comparação)':'')+'. Na prática, '+m.why+'.</li>');
    perfil[i].push(m.k);
  });
  var bat=[],fio=[];D.forEach(function(d,i){if(d.flags.bat)bat.push(i);else if(d.flags.fio||d.v.pot)fio.push(i)});
  if(bat.length&&fio.length){bat.forEach(function(i){out.push('<li><span class="lau-k">Sem fio:</span> '+nm(i)+' funciona a bateria — dá liberdade para trabalhar longe da tomada, em telhados, obras e áreas externas'+(D[i].flags.semb?'. Atenção: é vendida sem bateria e sem carregador':'')+'.</li>')})}
  D.forEach(function(d,i){if(d.flags.bl&&!D.every(function(x){return x.flags.bl}))out.push('<li><span class="lau-k">Motor sem escovas (brushless):</span> '+nm(i)+' — menos desgaste, mais vida útil e sem troca de escovas de carvão.</li>')});
  var tens=D.map(function(d){if(!d.tensao)return null;var m=String(d.tensao).match(/\d+/);var t=m?+m[0]:0;return t>=100?(t<150?"127":"220"):null}).filter(Boolean);
  if(tens.length>=2&&tens.some(function(t){return t!==tens[0]}))out.push('<li><span class="lau-k">Atenção à tensão:</span> os modelos comparados têm voltagens diferentes. Confira a tensão da tomada do local de uso antes de escolher.</li>');
  var rec=[];
  var score=D.map(function(d,i){return{i:i,s:(perfil[i].indexOf("pot")>=0?3:0)+(perfil[i].indexOf("disc")>=0?2:0)+(perfil[i].indexOf("torq")>=0?3:0)+(perfil[i].indexOf("ej")>=0?2:0)+(perfil[i].indexOf("ipm")>=0?1:0)+(perfil[i].indexOf("conc")>=0?1:0)+(perfil[i].indexOf("rpm")>=0?1:0)}});
  score.sort(function(a,b){return b.s-a.s});
  if(score[0].s>0)rec.push('<li><span class="lau-e">🏗️</span><span class="lau-k">Uso profissional e serviço pesado:</span> '+nm(score[0].i)+'.</li>');
  var leve=D.map(function(d,i){return{i:i,p:d.v.peso,w:d.v.pot}});
  if(bat.length&&fio.length)leve=leve.filter(function(x){return bat.indexOf(x.i)<0});
  var lp=leve.filter(function(x){return x.p!=null}),lw=leve.filter(function(x){return x.w!=null}),lv=null;
  var byP=0;if(lp.length>=2){lv=lp.sort(function(a,b){return a.p-b.p})[0];byP=1}else if(lw.length>=2)lv=lw.sort(function(a,b){return a.w-b.w})[0];
  if(lv&&(!score[0].s||lv.i!==score[0].i))rec.push('<li><span class="lau-e">🏠</span><span class="lau-k">Uso doméstico, manutenção e serviços leves:</span> '+nm(lv.i)+(byP?' — mais leve e fácil de manusear':' — potência suficiente para as tarefas do dia a dia')+'.</li>');
  if(bat.length&&fio.length)rec.push('<li><span class="lau-e">🔋</span><span class="lau-k">Mobilidade e locais sem energia:</span> '+bat.map(nm).join(", ")+'.</li>');
  var faltam=D.filter(function(d){return Object.keys(d.v).length<2}).length;
  if(!out.length&&!rec.length)return'<div class="lau" id="parecer">'+lauHead()+'<div class="lau-b"><p>Os dados técnicos informados pelos fabricantes são muito parecidos entre os modelos escolhidos. Fale com a nossa equipe para receber uma indicação de acordo com o seu tipo de serviço.</p>'+lauFoot()+'</div>';
  return'<div class="lau" id="parecer">'+lauHead()+'<div class="lau-b">'+(out.length?'<h3><span class="lau-ic">★</span>Destaques</h3><ul class="lau-d">'+out.join("")+'</ul>':'')+(rec.length?'<h3><span class="lau-ic">✔</span>Indicação de uso</h3><ul class="lau-r">'+rec.join("")+'</ul>':'')+(faltam?'<p class="lau-n">Alguns modelos têm poucas informações técnicas disponíveis; para eles a análise é parcial.</p>':'')+lauFoot()+'</div></div>';
}
function lauFoot(){var n=waNum(),u=n?"https://wa.me/"+n+"?text="+encodeURIComponent("Olá! Estou comparando produtos no site e gostaria de uma indicação."):"#contato";return'<div class="lau-f"><p>Os dados técnicos são dos fabricantes. Ficou com dúvida? Nossa equipe ajuda você a escolher.</p><a class="lau-wa" href="'+esc(u)+'"'+(n?' target="_blank" rel="noopener"':'')+'>💬 Falar com a equipe</a></div>'}

function lauHead(){return'<div class="lau-h"><span class="lau-badge">📋</span><div><h2>Parecer técnico da comparação</h2><p>Análise feita a partir das especificações oficiais de cada fabricante, para ajudar você a escolher o modelo certo para o seu tipo de trabalho.</p></div></div>'}

function compPage(){return'<div class="pp"><div class="wrap"><div class="bc"><a href="#inicio">'+T("bcH")+'</a><span>›</span><span>'+T("cmpPg")+'</span></div><h1 class="pt">'+T("cmpPg")+'</h1><div id="cpc">'+compBody()+'</div></div></div>'}
var SHI='<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/></g><path d="M8.6 10.6l6.8-4M8.6 13.4l6.8 4" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
var SHO={tg:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M21.5 3.2 2.9 10.4c-.8.3-.8 1.4 0 1.7l4.6 1.6 1.8 5.6c.2.7 1.1.9 1.6.4l2.5-2.4 4.7 3.5c.6.4 1.4.1 1.6-.6L22.9 4.6c.2-.9-.6-1.7-1.4-1.4zM9.6 13.3l8.1-5-6.3 6.3-.3 3z"/></svg>',fb:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M13.6 21v-8h2.7l.4-3.2h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.2H7.7V13h2.7v8z"/></svg>',ml:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M3 5h18a1 1 0 0 1 1 1v.4l-10 6.2L2 6.4V6a1 1 0 0 1 1-1zm-1 3.8 10 6.2 10-6.2V18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/></svg>'};
function shareData(p){var nm=tv("brand"),pr=p.p?" ("+money(p.p)+")":"";return{title:p.n+" | "+nm,text:"Olha este produto do "+nm+": "+p.n+pr,url:siteBase()+pHref(p)}}
function shareP(id){
  var p=S.prods.filter(function(x){return x.id===id})[0];if(!p)return;
  shareGo(shareData(p));
}
function shareGo(d){
  var touch=false;try{touch=window.matchMedia("(pointer:coarse)").matches}catch(e){}
  if(touch&&navigator.share){try{navigator.share(d).catch(function(err){if(!err||err.name!=="AbortError")shareBox(d)})}catch(e){shareBox(d)}return}
  shareBox(d);
}
function shareBox(d){
  var dl=$("shd");
  if(!dl){dl=document.createElement("dialog");dl.id="shd";dl.setAttribute("aria-label","Compartilhar produto");document.body.appendChild(dl);dl.addEventListener("click",function(e){if(e.target===dl)dl.close()})}
  var t=encodeURIComponent(d.text),u=encodeURIComponent(d.url),both=encodeURIComponent(d.text+"\n"+d.url);
  var o=[["WhatsApp","https://wa.me/?text="+both,WAI,1],["Telegram","https://t.me/share/url?url="+u+"&text="+t,SHO.tg,1],["Facebook","https://www.facebook.com/sharer/sharer.php?u="+u,SHO.fb,1],["E-mail","mailto:?subject="+encodeURIComponent(d.title)+"&body="+both,SHO.ml,0]];
  dl.innerHTML='<h3>'+esc(d.h||"Compartilhar produto")+'</h3><p class="note">'+esc(d.text)+'</p><div class="shg">'+o.map(function(x){return'<a href="'+esc(x[1])+'"'+(x[3]?' target="_blank" rel="noopener"':'')+'>'+x[2]+x[0]+'</a>'}).join("")+'</div><label for="shl">'+esc(d.lab||"Link do produto")+'</label><div class="shr"><input id="shl" type="text" readonly value="'+esc(d.url)+'"><button class="btn sm" type="button" data-act="shc">Copiar link</button></div><p class="note" id="shm" role="status"></p><div class="row"><button class="btn dark" type="button" data-act="shx">Fechar</button></div>';
  if(!dl.open)dl.showModal();
}
function shareCopy(){
  var i=$("shl"),m=$("shm");if(!i)return;
  function ok(v){if(m)m.textContent=v?"Link copiado! É só colar onde quiser.":"Não consegui copiar sozinho: o link está selecionado, toque em copiar do seu aparelho."}
  function fb(){var r=false;try{i.focus();i.select();i.setSelectionRange(0,9999);r=document.execCommand("copy")}catch(e){}ok(r)}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(i.value).then(function(){ok(true)},fb)}else fb();
}
document.addEventListener("click",function(e){
  if(!e.target.closest(".sw")){var sr0=$("sr");if(sr0)sr0.hidden=true}var kmi=e.target.closest(".kmw");if(!kmi||e.target.closest(".kp a"))kmClose();if(!e.target.closest(".kcw")||e.target.closest(".kcp a"))kcClose();if(!e.target.closest(".kcw")||e.target.closest(".kcp a"))kcClose();if(!e.target.closest(".kcw")||e.target.closest(".kcp a"))kcClose();
  var ta=e.target.closest("a[href^='tel:'],a[href^='mailto:']");if(ta&&INFRAME&&!ta.hasAttribute("data-native")){e.preventDefault();var th=ta.getAttribute("href");if(/^tel:/i.test(th))callBox(th);else mailBox(th);return}
  if(e.target.closest("a"))return;var b=e.target.closest("[data-act],[data-cat]");if(!b)return;
  var a=b.getAttribute("data-act"),id=b.getAttribute("data-id");
  if(a==="x")$("dlg").close();
  else if(a==="xd")$("det").close();
  else if(a==="vp")go("#p-"+id);
  else if(a==="gi"){$("gmain").src=rpImg(id);Array.prototype.forEach.call(document.querySelectorAll(".th"),function(t){t.classList.toggle("on",t===b)})}
  else if(a==="sl")$("sim").scrollBy({left:-300,behavior:"smooth"});
  else if(a==="sr")$("sim").scrollBy({left:300,behavior:"smooth"});
  else if(a==="gc"){kcClose();go("#cat-"+id)}
  else if(a==="kcd"){var kcp=document.querySelector(".kcp");if(kcp){var ko=kcp.hidden;kcp.hidden=!ko;b.setAttribute("aria-expanded",String(ko))}}
  else if(a==="la"){var rs=$("lrs");if(rs.querySelectorAll(".lr").length>=LC.max){$("err").textContent="Limite de itens atingido.";return}rs.insertAdjacentHTML("beforeend",lrow(Object.assign({},LC.blank)))}
  else if(a==="lx"){var r1=b.closest(".lr");if(r1)r1.parentNode.removeChild(r1)}
  else if(a==="lu"){var r2=b.closest(".lr");if(r2&&r2.previousElementSibling)r2.parentNode.insertBefore(r2,r2.previousElementSibling)}
  else if(a==="ld"){var r3=b.closest(".lr");if(r3&&r3.nextElementSibling)r3.parentNode.insertBefore(r3.nextElementSibling,r3)}
  else if(a==="rl"||a==="rr"){var rt=b.closest(".rail").querySelector(".rt");railGo(rt,a==="rl"?-1:1)}
  else if(a==="rx"){var rw=b.closest(".rail");rw.classList.toggle("open");b.querySelector("span").textContent=rw.classList.contains("open")?T("railL"):T("railM");railFit()}
  else if(a==="ft"){var ly=$("lay");if(ly){ly.classList.toggle("fclosed");fopen=!ly.classList.contains("fclosed");b.textContent=fopen?T("fltH"):T("fltS")}}
  else if(a==="fc"){F=newF();render()}
  else if(a==="ip"){var pk=b.closest(".ipk"),pp=pk.querySelector(".ipp");if(pp.hidden){if(!pp.innerHTML)pp.innerHTML=ipanel();pp.hidden=false;var si=pp.querySelector("input");if(si)si.focus()}else pp.hidden=true}
  else if(a==="pi"){var pk2=b.closest(".ipk");pk2.querySelector("[data-k]").value=id;pk2.querySelector(".cur").innerHTML=iconSvg(id)+"<span>Trocar ícone</span>";pk2.querySelector(".ipp").hidden=true}
  else if(a==="fmore"){fmore++;featUpd()}   else if(a==="lmore"){LN+=48;listUpd()}   else if(a==="rvs"){RVS=Number(id);Array.prototype.forEach.call(document.querySelectorAll(".rvb"),function(x){x.textContent=Number(x.getAttribute("data-id"))<=RVS?"★":"☆"})}   else if(a==="rvsend"){rvSend(id)}
  else if(a==="km"){var kpp=document.querySelector(".kp"),kbb=document.querySelector(".kb");if(kpp){var opn=kpp.hidden;kpp.hidden=!opn;if(kbb)kbb.setAttribute("aria-expanded",String(opn))}}
  else if(a==="bn")showBn(bi+1);
  else if(a==="bp")showBn(bi-1);
  else if(a==="bd")showBn(Number(id));
  else if(a==="bgo"){go(id==="__nov"?"#novidades":String(id).indexOf("p:")===0?"#p-"+String(id).slice(2):(id&&catOf(id))?"#cat-"+id:"#produtos")}
  else if(a==="mass"){go("#edicao-em-massa")}
  else if(a==="rep"){if(typeof repOpen==="function")repOpen(id)}
  else if(a==="bsl"){bsOpen()}
  else if(a==="avl"){if(typeof avOpen==="function")avOpen()}
  else if(a==="nvmore"){NVR+=2;novFit()}
  else if(a==="bf"){go("#marca-"+slug(id))}
  else if(a==="eb")banForm();
  else if(a==="em")brandForm();
  else if(a==="ev")videoForm();
  else if(a==="efs")footForm();
  else if(a==="efl")linksForm();
  else if(a==="eo")storesForm();
  else if(a==="sh")shareP(id);
  else if(a==="cp")cpToggle(id);
  else if(a==="cpgo"){cpClean();if(CMP.length>1)go(cpHash())}
  else if(a==="cpclr"){CMP=[];cpW=null;CPG=null;CPQ="";if(pg==="compare")go("#comparar");else cpRefresh()}
  else if(a==="cpnew"){CMP=[id];cpW=null;cpRefresh()}
  else if(a==="cpg"){CPG=id;CPQ="";CPN=20;cpRefresh()}
  else if(a==="cpgb"){CPG=null;CPQ="";cpRefresh()}
  else if(a==="cpmore"){CPN+=20;cpListUpd()}
  else if(a==="cpd"){cpDiff=!cpDiff;cpRefresh()}
  else if(a==="shcmp"){var sp2=CMP.map(prodById).filter(Boolean);if(sp2.length){var nm2=tv("brand"),lst=sp2.map(function(x){return x.n}).join(" x ");shareGo({h:"Compartilhar comparação",lab:"Link da comparação",title:"Comparação: "+lst+" | "+nm2,text:"Compare estes produtos no "+nm2+": "+lst,url:siteBase()+cpHash()})}}
  else if(a==="ftab"){var ff=$("f");Array.prototype.forEach.call(ff.querySelectorAll(".tpn"),function(d){d.hidden=d.getAttribute("data-tab")!==id});Array.prototype.forEach.call(ff.querySelectorAll(".tbt"),function(t){var on=t===b;t.classList.toggle("on",on);t.setAttribute("aria-selected",String(on))})}
  else if(a==="shc")shareCopy();
  else if(a==="cq")cqBox(id);
  else if(a==="cqx"){var qd0=$("cqd");if(qd0)qd0.close()}
  else if(a==="qs")qStep(b,Number(id));
  else if(a==="cadd")cDoAdd(b,id);
  else if(a==="crm"){CART=CART.filter(function(x){return x.k!==id});cSave();render()}
  else if(a==="cclr"){if(b.getAttribute("data-arm")){CART=[];cSave();render()}else{b.setAttribute("data-arm","1");b.textContent=tv("cartClrQ");setTimeout(function(){if(b.isConnected){b.removeAttribute("data-arm");b.textContent=tv("cartClr")}},4000)}}
  else if(a==="ccopy"){copyText(cMsg(),function(ok){var m=$("ccm");if(m)m.textContent=ok?"Lista copiada! É só colar onde quiser.":"Não consegui copiar sozinho."})}
  else if(a==="clc"){copyText(id,function(ok){var m=$("clm");if(m)m.textContent=ok?(b.getAttribute("data-m")||"Número copiado! Cole no discador do celular."):"Não consegui copiar sozinho. Segure o texto acima e copie."})}
  else if(a==="clx"){var cd=$("cld");if(cd)cd.close()}
  else if(a==="shx"){var sd=$("shd");if(sd)sd.close()}
  else if(a==="sa"){go("#busca")}
  else if(a==="cs"){term="";bfil="";render()}
  else if(a==="vt"){var vv=document.querySelector(".vid video");if(vv){if(vv.paused){vv.play();b.textContent="Pausar vídeo"}else{vv.pause();b.textContent="Reproduzir vídeo"}}}
  else if(a==="te"){edit=!edit;render()}
  else if(a==="np")prodForm();
  else if(a==="ep")prodForm(id);
  else if(a==="dp")delForm(id);
  else if(a==="ec")catForm();
  else if(a==="es")setForm();
  else if(a==="ebt")cbForm();
  else if(a==="ecm")cmForm();
  else if(a==="pub")pub();
});
document.addEventListener("input",function(e){var t=e.target;if(!t||!t.classList)return;if(t.id==="cnm"){CNM=t.value.slice(0,60);cSave();cLive();return}if(t.closest(".cri"))cRow(t)});
document.addEventListener("change",function(e){var t=e.target;if(!t||!t.classList)return;if(t.classList.contains("cqu")||t.classList.contains("cqq")){var w=t.closest(".qc,.cri");if(!w)return;var i=w.querySelector(".cqq"),u=w.querySelector(".cqu").value,q=qParse(i.value);if(isFinite(q)&&q>0){if(!unOf(u)[4])q=Math.max(1,Math.ceil(q));i.value=qFmt(q)}if(w.classList.contains("cri"))cRow(t)}});
/* ===== GitHub Pages + Supabase ===== */
var RPC=window.RP_CFG||{},SB=null,EXT={"7cdffe24322cfc6bd40d8e20adcf74a3": "jpg", "0839075d551e07b4f116e808714a3049": "webp", "dc55e5d30a9d62d0ef3be0186a33fec6": "jpg", "d74dbd0e8dead93252c404a7c543df70": "jpg", "e0cfd9a940348acc81da7cef70ed158b": "jpg", "12ba665f2502698f5a22c2eef97dac20": "jpg", "7c8e9ad9d7d2d3550b0045bca3778a9f": "webp", "2494355c272168c4d00ed07348dfd2c4": "webp", "f66519e416ea846627ee39e5e0df9950": "jpg", "388d5e768f9f8ce12c6c6f239807ecaa": "webp", "ef771af49b2d3b892d5320a909a5010b": "jpg", "8161274d391c1de0e39cc69dc26ecd4c": "jpg", "0b66a8747e482ebe80272e83b2aa60df": "jpg", "945d4920f3e630c28f7ad9f16234ca3a": "webp"};
function rpImg(x){x=String(x||"");if(/^(https?:|data:|img\/)/.test(x))return x;if(EXT[x])return"img/"+x+"."+EXT[x];return"/_blob/"+x}
function rpOn(){return!!(RPC.url&&RPC.key&&!window.claude)}
function rpBase(){return String(RPC.url).replace(/\/+$/,"")}
/* Economia de tráfego do Supabase (11/11/2026): pergunta só a data da última alteração (updated_at, poucos bytes);
   se o aparelho já tem a lista dessa mesma data guardada (Cache do navegador), não baixa os ~4 MB de novo. */
async function rpFetchSite(sig){
  var H={headers:{apikey:RPC.key},signal:sig,cache:"no-store"},B=rpBase()+"/rest/v1/site?id=eq.1&select=",k=null,cc=null;
  try{var v=await fetch(B+"updated_at",H);if(v.ok){var vj=await v.json();if(vj&&vj[0]&&vj[0].updated_at)k=B+"data&v="+encodeURIComponent(vj[0].updated_at)}}catch(e){}
  if(k&&window.caches){try{cc=await caches.open("rp-site-v1");var hit=await cc.match(k);if(hit)return await hit.json()}catch(e){cc=null}}
  var r=await fetch(B+"data",H);
  if(!r.ok)return null;
  if(k&&cc){try{var r2=r.clone();cc.put(k,r2).then(function(){cc.keys().then(function(ks){ks.forEach(function(q){if(q.url!==k)cc.delete(q)})})}).catch(function(){})}catch(e){}}
  return await r.json();
}
async function rpLoad(){
  if(!rpOn())return null;
  try{
    var c=new AbortController(),tm=setTimeout(function(){c.abort()},7000);
    var j=await rpFetchSite(c.signal);
    clearTimeout(tm);
    if(!j)return null;
    if(j&&j[0]&&j[0].data&&j[0].data.prods){var D=j[0].data;if((D.ver||0)>=(S.ver||0)){var hb={};(D.brands||[]).forEach(function(b){hb[String(b.n).toLowerCase()]=b});(S.brands||[]).forEach(function(b){var o=hb[String(b.n).toLowerCase()];if(!o){(D.brands=D.brands||[]).push(b)}else if(!o.img&&b.img){o.img=b.img}});S=D;return true}var L=await dLoad();if(!L||!L.prods){S=D;return true}S=L;var JK=["jj","kjk","ljkl","jkjk","jkujkl","rthjrtj","klhjkl"],nb=(D.brands||[]).filter(function(b){return JK.indexOf(String(b.n))<0}),hv={};nb.forEach(function(b){hv[String(b.n).toLowerCase()]=1});(S.brands||[]).forEach(function(b){var lk=String(b.n).toLowerCase();if(!hv[lk])nb.push(b);else nb.forEach(function(o){if(String(o.n).toLowerCase()===lk&&!o.img&&b.img)o.img=b.img})});D.prods=(typeof rpMerge==="function")?rpMerge(S.prods,D.prods,S.ver,D.del):S.prods;D.brands=nb;D.ver=S.ver;S=D;return false}
    return false;
  }catch(e){return null}
}
function rpHasSession(){try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(/^sb-.*-auth-token$/.test(k))return true}}catch(e){}return false}
function rpLib(){return new Promise(function(ok,no){if(window.supabase)return ok();var s=document.createElement("script");s.src="/sb-2.119.2.js";s.onload=function(){ok()};s.onerror=no;document.head.appendChild(s)})}
function rpBar(email){
  var d=document.createElement("div");
  d.style.cssText="position:fixed;left:10px;bottom:10px;z-index:9999;background:#102257;color:#fff;font:600 13px Barlow,sans-serif;padding:8px 12px;border-radius:10px;box-shadow:0 4px 14px rgba(0,0,0,.25);display:flex;gap:10px;align-items:center";
  d.innerHTML='<span>Admin: '+esc(email)+'</span><button type="button" style="background:#ffc20e;color:#102257;border:0;border-radius:6px;padding:4px 10px;font:700 13px Barlow,sans-serif;cursor:pointer">Sair</button>';
  d.querySelector("button").onclick=async function(){try{await SB.auth.signOut()}catch(e){}location.reload()};
  document.body.appendChild(d);
}
async function rpAdmin(loaded){
  if(!rpOn()||!rpHasSession())return;
  try{
    await rpLib();
    SB=window.supabase.createClient(rpBase(),RPC.key);
    var ss=(await SB.auth.getSession()).data.session;if(!ss)return;
    var q=await SB.from("admins").select("user_id").eq("user_id",ss.user.id).maybeSingle();
    if(q.error||!q.data){rpBar(ss.user.email+" (sem permissão)");return}
    art={publish:async function(){
      var r=await SB.from("site").upsert({id:1,data:S,updated_at:new Date().toISOString()});
      if(r.error)throw r.error;
      location.reload();
    }};
    assets={upload:async function(f){
      if(typeof shrinkImg==="function")f=await shrinkImg(f);
      var ext=(String(f.name||"").split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"")||"jpg";
      var path=Date.now()+"-"+Math.random().toString(36).slice(2,8)+"."+ext;
      var r=await SB.storage.from("fotos").upload(path,f,{contentType:f.type||undefined,upsert:false,cacheControl:"31536000"});
      if(r.error)throw r.error;
      return{id:SB.storage.from("fotos").getPublicUrl(path).data.publicUrl};
    }};
    canEdit=true;if(typeof avCount==="function")avCount();
    if(loaded===false){try{await SB.from("site").upsert({id:1,data:S,updated_at:new Date().toISOString()})}catch(e){}}
    rpBar(ss.user.email);
    render();
  }catch(e){}
}
/* Página recarregada (inclusive puxando a tela para baixo no celular): o site começa do topo, sem o navegador tentar devolver a rolagem antes de a página carregar */
try{if("scrollRestoration" in history)history.scrollRestoration="manual"}catch(e){}
/* O CSS tem scroll-behavior:smooth; por isso toY() rola na hora ("instant"): rolagem animada era interrompida pelo navegador e a página ficava cortada.
   Chrome no iPhone (12/11/2026): mesmo com "manual", ele devolve a rolagem antiga depois que a página cresce.
   topLock: nos primeiros 4 s, se a página rolar sozinha (sem o cliente tocar, rolar ou teclar), volta ao topo. Não vale para links com âncora (#contato). */
function toY(y){try{window.scrollTo({top:y,left:0,behavior:"instant"})}catch(e){window.scrollTo(0,y)}}
function topLock(){var until=Date.now()+4000,u=false,ev=["touchstart","wheel","keydown","mousedown"];
  function mark(){u=true;ev.forEach(function(e){removeEventListener(e,mark,true)})}
  ev.forEach(function(e){addEventListener(e,mark,{capture:true,passive:true})});
  function fix(){if(u||Date.now()>until)return;var h=location.hash.slice(1);if(h&&h!=="inicio"&&document.getElementById(h))return;if(window.scrollY>0)toY(0)}
  topLock.renew=function(){until=Math.max(until,Date.now()+2500);fix()};
  addEventListener("scroll",fix,{passive:true});addEventListener("load",function(){topLock.renew();setTimeout(fix,60);setTimeout(fix,400)});addEventListener("pageshow",fix)}
topLock();
cLoad();window.addEventListener("hashchange",route);window.addEventListener("popstate",route);
(async function(){
  route();
  var loaded=await rpLoad();
  if(loaded===null){var L=await dLoad();if(L&&L.prods)S=L}
  RPL=false;
  route();
  if(!location.hash||location.hash==="#"||location.hash==="#inicio")toY(0);if(topLock.renew)topLock.renew();
  if(typeof orcLoad==="function")orcLoad();
  if(window.claude){
    try{var u=await claude.use("user");canEdit=!!(u&&((u.isOwner&&u.isOwner())||(u.canEdit&&u.canEdit())))}catch(e){}
    try{art=await claude.use("artifact")}catch(e){}
    try{assets=await claude.use("assets")}catch(e){}
    if(!art)canEdit=false;
    render();
    return;
  }
  rpAdmin(loaded);
})();

