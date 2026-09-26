'use strict';
const CONFIG = {
  emailEnabled: true,
  emailEndpoint: 'https://formsubmit.co/ajax/antuansabe@gmail.com',
  email: 'antuansabe@gmail.com',
  siteUrl: new URL('.', window.location.href).href,
};
const $ = id => document.getElementById(id);
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollToEl=el=>el.scrollIntoView({behavior:reduceMotion?'instant':'smooth',block:'start'});
$('open-surprise').onclick=()=>{scrollToEl($('note'));celebrate(9)};
document.querySelectorAll('.memory').forEach(b=>b.onclick=()=>b.setAttribute('aria-expanded',String(b.getAttribute('aria-expanded')!=='true')));
$('ogre').onclick=()=>{$('ogre-note').hidden=!$('ogre-note').hidden};
const plans={
 cafe:{title:'Cafecito y calles bonitas',icon:'🍵',description:'Un café o matcha, algo dulce y un paseo sin prisa. De esos planes sencillos que se quedan contigo.',places:[
  {id:'vegamo-centro',name:'VegAmo Centro + un paseo por la Alameda',description:'Café, repostería vegana y después caminar juntos. Un ratito bonito, sin tanta producción.',url:'https://www.vegamomx.com/menu.html'},
  {id:'madre-cafe',name:'Madre Café + Plaza Luis Cabrera',description:'Un matcha con leche vegetal, una mesa linda y un paseo por la Roma. La buena compañía ya está incluida.',url:'https://madrecafe.com/menu-roma-2/'}]},
 cena:{title:'Una cena con calma',icon:'🥂',description:'Ponernos guapos, elegir una mesa linda y brindar por ti. Una cena especial con opciones que sí se te antojen.',places:[
  {id:'plantasia',name:'Plantasia · Roma Norte',description:'Edamames, dumplings de hongos y cocina asiática vegetal entre plantas. Tengo la impresión de que este lugar es muy tú.',url:'https://www.plantasia.cafe/menu'},
  {id:'madrecena',name:'Madre Café · Roma',description:'Una noche bonita, con boloñesa de hongos, portobello y otras opciones vegetarianas. Y la sobremesa que nos haga falta.',url:'https://madrecafe.com/menu-roma-2/'}]},
 cine:{title:'Una tarde de película',icon:'🎬',description:'Escogemos una buena peli, buscamos algo dulce después y nos olvidamos un rato de la semana.',places:[
  {id:'cineteca',name:'Cineteca Nacional · Xoco',description:'Una función, una caminadita y tiempo para platicar. Elegimos juntos la película según la cartelera.',url:'https://www.cinetecanacional.net/sedes/index.php?cinemaId=003'},
  {id:'tonala',name:'Cine Tonalá · Roma Sur',description:'Cine y luego un antojo vegetal por la Roma. La película la decidimos entre los dos.',url:'https://cinetonala.mx/'}]}
};
const dates=[
 ['2026-09-28','Lunes 28 de septiembre'],['2026-09-29','Martes 29 de septiembre'],['2026-09-30','Miércoles 30 de septiembre'],['2026-10-01','Jueves 1 de octubre'],['2026-10-02','Viernes 2 de octubre · por la tarde'],['2026-09-27','Domingo 27 · alternativa por confirmar'],['pending','Prefiero que lo acordemos por chat']
];
const state={step:0,plan:'',place:'',customPlace:'',customUrl:'',date:'',time:'',note:'',requestId:crypto.randomUUID?crypto.randomUUID():String(Date.now()),sent:false,busy:false};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function option(name,value,title,description,selected,url=''){
 return `<label class="option"><input type="radio" name="${name}" value="${esc(value)}" ${selected?'checked':''}><span><b>${esc(title)}</b><small>${esc(description)}</small>${url?`<a class="place-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Ver el lugar ↗</a>`:''}</span></label>`;
}
function button(id,text,secondary=false){return `<button type="button" class="button${secondary?' secondary':''}" id="${id}">${text}</button>`}
function actions(nextText='Siguiente →'){return `<div class="game-actions"><button type="button" class="text-button" id="back">← Volver</button>${button('next',nextText)}</div>`}
function error(message){$('form-error').textContent=message;$('form-error').hidden=!message}
function render(focus=true){
 error('');const n=state.step;
 $('progress-label').textContent=n===0?'Una invitación para ti':n===5?'Tu plan está en camino':n<0?'A tu ritmo':`Capítulo ${n} de 4`;
 $('progress-fill').style.width=(n>0?Math.min(n,4)/4*100:0)+'%';
 let html='';
 if(n===0)html=`<h3 class="game-title">Truqui, ¿te dejas festejar?</h3><p class="game-copy">Esta aventura tiene tres ingredientes: algo rico, un ratito juntos y una cumpleañera muy consentida.</p><div class="game-actions">${button('yes','Sí, armemos el plan ✨')}<button type="button" class="text-button" id="maybe">Me voy a hacer del rogar</button></div>`;
 if(n===-1)html=`<div class="success-icon" aria-hidden="true">🐈</div><h3 class="game-title">¿Segura, segurísima?</h3><p class="game-copy">El comité de gatitos solicita una segunda revisión. Su argumento es bastante sólido: hay comida y buena compañía.</p><div class="game-actions">${button('yes','Bueno, a ver esos planes')}<button type="button" class="text-button" id="later">Ahora no, lo hablamos después</button></div>`;
 if(n===-2)html=`<h3 class="game-title">Te guardo el apapacho.</h3><p class="game-copy">Disfruta tu cumpleaños a tu manera. Podemos decidirlo juntos otro día; tu notita y esta página siguen siendo tuyas. 🪻</p><div class="game-actions">${button('yes','Ya me dio curiosidad: ver planes')}</div>`;
 if(n===1)html=`<h3 class="game-title">¿Qué se te antoja?</h3><p class="game-copy">Escoge el plan que hoy te haga decir “sí jalo”.</p><div class="option-grid" role="radiogroup" aria-label="Tipo de plan">${Object.entries(plans).map(([id,p])=>option('plan',id,p.icon+' '+p.title,p.description,state.plan===id)).join('')}</div>${actions()}`;
 if(n===2)html=`<h3 class="game-title">Ahora, nuestro pequeño destino.</h3><p class="game-copy">Te dejo un par de ideas pensadas para ti. Si tienes un lugar guardado desde hace mil años, éste es tu momento.</p><div class="option-grid" role="radiogroup" aria-label="Lugar">${plans[state.plan].places.map(p=>option('place',p.id,p.name,p.description,state.place===p.id,p.url)).join('')}${option('place','custom','Tengo otro lugar en mente','Puedes escribir su nombre o pegar el enlace.',state.place==='custom')}</div><div id="custom-fields" ${state.place==='custom'?'':'hidden'}><label class="field"><span>¿Cómo se llama?</span><input id="custom-place" maxlength="120" placeholder="Ese lugar que quiero conocer…" value="${esc(state.customPlace)}"></label><label class="field"><span>Enlace del lugar (opcional)</span><input id="custom-url" type="url" maxlength="500" placeholder="https://…" value="${esc(state.customUrl)}"></label></div>${actions()}`;
 if(n===3)html=`<h3 class="game-title">Hagámosle espacio.</h3><p class="game-copy">Me gustaría verte la próxima semana. El viernes puedo por la tarde, hasta las 10 p. m. Si prefieres el domingo, lo revisamos juntos.</p>${state.plan==='cine'?'<p class="notice">Elegimos una función que termine antes de las 10 p. m.; estos horarios son tentativos hasta revisar la cartelera.</p>':''}<div class="twocol"><label class="field"><span>El día que te acomoda</span><select id="date"><option value="">Elige un día</option>${dates.map(([v,t])=>`<option value="${v}" ${state.date===v?'selected':''}>${t}</option>`).join('')}</select></label><label class="field" id="time-field"><span>Un horario tentativo</span><select id="time">${timeOptions()}</select></label></div><label class="field"><span>¿Algo más que se te antoje? (opcional)</span><textarea id="note" maxlength="500" placeholder="Un postre, otra hora, algo que prefieras evitar…">${esc(state.note)}</textarea><small>Si el horario no te queda, proponme otro aquí.</small></label>${actions('Ver mi plan →')}`;
 if(n===4)html=`<h3 class="game-title">Así queda nuestro capítulo.</h3><p class="game-copy">Revísalo con calma. Al enviarlo, me llega por correo para que podamos organizarlo.</p>${reviewHtml()}<p class="notice">Es una propuesta: yo confirmo contigo el día y me encargo de revisar disponibilidad. Si algo cambia, lo ajustamos juntos.</p><p class="notice">Al enviar, este plan se comparte con Antonio por correo mediante FormSubmit.</p>${actions('Enviar mi plan a Antonio ✨')}`;
 if(n===5)html=`<div class="success-icon" aria-hidden="true">💌</div><h3 class="game-title">Tu plan ya va en camino.</h3><p class="game-copy">Me va a dar mucho gusto recibirlo. Ahora nos ponemos de acuerdo para hacerlo realidad.</p><div class="success-box">${esc(summary()).replace(/\n/g,'<br>')}</div><p class="notice">El envío fue aceptado. Falta que confirmemos juntos fecha y disponibilidad.</p><div class="game-actions">${button('copy-plan','Guardar el texto de mi plan',true)}</div><p class="game-copy" style="margin-top:24px">Mientras tanto: feliz cumpleaños, San. Te quiero mucho. 🪻</p>`;
 $('game-screen').innerHTML=html;
 if(focus)$('game-screen').focus({preventScroll:true});
 const bind=(id,fn)=>{if($(id))$(id).onclick=fn};
 bind('yes',()=>go(1));bind('maybe',()=>go(-1));bind('later',()=>go(-2));bind('back',()=>go(n-1));bind('next',next);
 bind('copy-plan',async()=>{try{await navigator.clipboard.writeText(summary());$('copy-plan').textContent='Texto copiado ✓'}catch{$('copy-plan').textContent='Puedes seleccionar el resumen de arriba'}});
 if(n===1)document.querySelectorAll('[name=plan]').forEach(r=>r.onchange=()=>{if(state.plan!==r.value){state.place='';state.date='';state.time=''}state.plan=r.value});
 if(n===2){document.querySelectorAll('[name=place]').forEach(r=>r.onchange=()=>{state.place=r.value;$('custom-fields').hidden=r.value!=='custom'});$('custom-place').oninput=e=>state.customPlace=e.target.value;$('custom-url').oninput=e=>state.customUrl=e.target.value}
 if(n===3){$('date').onchange=e=>{state.date=e.target.value;state.time='';$('time').innerHTML=timeOptions();$('time-field').hidden=state.date==='pending'};$('time').onchange=e=>state.time=e.target.value;$('note').oninput=e=>state.note=e.target.value;$('time-field').hidden=state.date==='pending'}
}
function go(step){state.step=step;render();scrollToEl($('adventure'))}
function timeOptions(){const slots=state.date==='2026-10-02'||state.date==='2026-09-27'?['16:00–18:00','18:00–20:00','19:00–21:00','20:00–22:00']:['18:00–20:00','19:00–21:00','20:00–22:00'];return '<option value="">Elige un horario</option>'+slots.map(t=>`<option ${state.time===t?'selected':''}>${t}</option>`).join('')+'<option value="Por acordar" '+(state.time==='Por acordar'?'selected':'')+'>Lo acordamos por chat</option>'}
function next(){
 if(state.busy||state.sent)return;
 if(state.step===1&&!state.plan)return error('Primero elige el plan que más se te antoje.');
 if(state.step===2){
  if(!state.place)return error('Elige un lugar o cuéntame cuál tienes en mente.');
  if(state.place==='custom'){
   state.customPlace=state.customPlace.trim();state.customUrl=state.customUrl.trim();
   if(!state.customPlace&&!state.customUrl)return error('Escribe el nombre del lugar o pega su enlace.');
   if(state.customUrl){try{const u=new URL(state.customUrl);if(!['https:','http:'].includes(u.protocol))throw Error()}catch{return error('El enlace debe comenzar con https:// o http://. También puedes dejar solo el nombre.')}}
  }
 }
 if(state.step===3){if(!state.date)return error('Elige un día, o la opción de acordarlo por chat.');if(state.date!=='pending'&&!state.time)return error('Elige un horario tentativo o la opción de acordarlo por chat.')}
 if(state.step===4)return send();
 go(state.step+1);
}
function place(){return state.place==='custom'?{name:state.customPlace||'Lugar propuesto por San',url:state.customUrl}:plans[state.plan].places.find(p=>p.id===state.place)}
function dateText(){return dates.find(([id])=>id===state.date)?.[1]||'Por acordar'}
function summary(){const p=place();return `Plan: ${plans[state.plan].title}\nLugar: ${p.name}${p.url?'\nEnlace: '+p.url:''}\nDía: ${dateText()}\nHorario: ${state.date==='pending'?'Por acordar':state.time}${state.note?'\nNota: '+state.note:''}\nFecha y reservación por confirmar juntos.`}
function reviewHtml(){const p=place();return `<dl class="review"><div><dt>El plan</dt><dd>${esc(plans[state.plan].title)}</dd></div><div><dt>El lugar</dt><dd>${esc(p.name)}${p.url?`<br><a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Ver referencia ↗</a>`:''}</dd></div><div><dt>Cuándo</dt><dd>${esc(dateText())}<br>${esc(state.date==='pending'?'Horario por acordar':state.time)}</dd></div>${state.note?`<div><dt>Tu nota</dt><dd>${esc(state.note)}</dd></div>`:''}</dl>`}
async function send(){
 if(!CONFIG.emailEnabled)return error('El envío por correo todavía está en preparación. Por ahora puedes revisar tu plan y volver a ajustarlo.');
 state.busy=true;error('');$('next').disabled=true;$('back').disabled=true;$('next').textContent='Enviando tu plan…';
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);
 const p=place();
 try{
  const r=await fetch(CONFIG.emailEndpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},signal:controller.signal,body:JSON.stringify({
   _subject:'San eligió su plan de cumpleaños 🪻',_template:'table',_captcha:'false',_url:CONFIG.siteUrl,
   De:'San',Plan:plans[state.plan].title,Lugar:p.name,Enlace:p.url||'Por acordar',Fecha:dateText(),Horario:state.date==='pending'?'Por acordar':state.time,Nota:state.note||'Sin nota adicional',Referencia:state.requestId,Estado:'Propuesta; confirmar fecha y disponibilidad juntos.'
  })});
  const data=await r.json();
  if(!r.ok||!(data.success===true||data.success==='true'))throw new Error(data.message||'No se confirmó el envío');
  state.sent=true;go(5);celebrate(22);
 }catch(e){
  error('No pudimos confirmar el envío. Tu plan sigue aquí. Puedes intentar otra vez o enviarlo desde tu aplicación de correo.');
  if(!$('email-fallback')){const a=document.createElement('a');a.id='email-fallback';a.className='button secondary';a.textContent='Abrir mi correo con este plan';a.href='mailto:'+CONFIG.email+'?subject='+encodeURIComponent('Mi plan de cumpleaños 🪻')+'&body='+encodeURIComponent(summary());$('game-screen').appendChild(a)}
  $('next').disabled=false;$('back').disabled=false;$('next').textContent='Volver a intentar el envío';
 }finally{clearTimeout(timeout);state.busy=false}
}
function celebrate(count){if(reduceMotion)return;const box=document.createElement('div');box.className='confetti';box.setAttribute('aria-hidden','true');for(let i=0;i<count;i++){const s=document.createElement('span');s.textContent=['✦','🪻','💜'][i%3];s.style.left=Math.random()*100+'%';s.style.animationDelay=Math.random()*.65+'s';box.appendChild(s)}document.body.appendChild(box);setTimeout(()=>box.remove(),3800)}
render(false);
