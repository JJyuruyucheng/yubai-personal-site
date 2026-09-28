(() => {
  'use strict';
  const root=document.documentElement,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const storage={get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,v)}catch{}}};
  const state={theme:root.dataset.theme,motion:!reduced.matches&&storage.get('yubai-demo-motion')!=='false'};
  function setTheme(theme){state.theme=theme;root.dataset.theme=theme;$('#theme-button').setAttribute('aria-label',theme==='dark'?'切换为浅色主题':'切换为深色主题');$('#theme-button use').setAttribute('href',theme==='dark'?'#i-sun':'#i-moon');$('meta[name="theme-color"]').content=theme==='dark'?'#111310':'#f5f6ef';storage.set('yubai-demo-theme',theme);window.dispatchEvent(new Event('yubai-theme'));}
  $('#theme-button').addEventListener('click',()=>setTheme(state.theme==='dark'?'light':'dark'));setTheme(state.theme);
  const art=$('#light-art');art.src='./assets/light-study.png';art.hidden=false;$('.art-fallback')?.remove();

  // Abstract torus geometry; no video or external animation service.
  const canvas=$('#orbit-canvas'),stage=$('#orbit-stage'),ctx=canvas.getContext('2d');
  let width=1,height=1,dpr=1,frame=0,time=0,lastTime=0,visible=true;
  let pointer={x:0,y:0},smooth={x:0,y:0},colors={bright:'210,245,128',line:'137,161,108'};
  function readColors(){const s=getComputedStyle(root);colors={bright:s.getPropertyValue('--orbit-bright').trim(),line:s.getPropertyValue('--orbit-line').trim()};}
  function project(x,y,z,rx,ry,rz){const y1=y*Math.cos(rx)-z*Math.sin(rx),z1=y*Math.sin(rx)+z*Math.cos(rx),x2=x*Math.cos(ry)+z1*Math.sin(ry),z2=-x*Math.sin(ry)+z1*Math.cos(ry),x3=x2*Math.cos(rz)-y1*Math.sin(rz),y3=x2*Math.sin(rz)+y1*Math.cos(rz),p=650/(650+z2);return{x:width/2+x3*p,y:height/2+y3*p,z:z2};}
  function paint(){
    if(!ctx)return;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
    const r=Math.min(width*.285,height*.315),tube=r*.33,rx=.82+smooth.y*.22,ry=.26+Math.sin(time*.16)*.24+smooth.x*.3,rz=-.48;
    const point=(u,v)=>project((r+tube*Math.cos(v))*Math.cos(u),(r+tube*Math.cos(v))*Math.sin(u),tube*Math.sin(v),rx,ry,rz);
    ctx.beginPath();ctx.ellipse(width/2,height/2,r*1.62,r*1.30,-.20,0,Math.PI*2);ctx.strokeStyle=`rgba(${colors.line},.16)`;ctx.lineWidth=.7;ctx.setLineDash([2,7]);ctx.stroke();ctx.setLineDash([]);
    const lines=width<400?16:23,segments=width<400?80:112;
    for(let k=0;k<lines;k++){const v=k/lines*Math.PI*2+time*.085;ctx.beginPath();let depth=0;for(let n=0;n<=segments;n++){const p=point(n/segments*Math.PI*2,v);depth+=p.z;n===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);}ctx.strokeStyle=`rgba(${colors.bright},${.09+(Math.cos(v)+1)*.105+(depth<0?.09:0)})`;ctx.lineWidth=.6;ctx.stroke();}
    for(let k=0;k<36;k++){ctx.beginPath();const u=k/36*Math.PI*2+time*.035;for(let n=0;n<=42;n++){const p=point(u,n/42*Math.PI*2);n===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);}ctx.strokeStyle=`rgba(${colors.line},.22)`;ctx.lineWidth=.55;ctx.stroke();}
    for(let k=0;k<68;k++){const p=point(k*2.39996+time*.06,k*1.618+time*.09),size=k%17===0?2.4:.8,alpha=.2+(Math.sin(k+time*.45)+1)*.23;if(k%17===0){const glow=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,13);glow.addColorStop(0,`rgba(${colors.bright},.35)`);glow.addColorStop(1,`rgba(${colors.bright},0)`);ctx.fillStyle=glow;ctx.beginPath();ctx.arc(p.x,p.y,13,0,Math.PI*2);ctx.fill();}ctx.fillStyle=`rgba(${colors.bright},${alpha})`;ctx.beginPath();ctx.arc(p.x,p.y,size,0,Math.PI*2);ctx.fill();}
    for(let k=0;k<3;k++){const a=time*.09+k*2.1+.4,x=width/2+Math.cos(a)*r*1.62,y=height/2+Math.sin(a)*r*1.30;ctx.beginPath();ctx.arc(x,y,k===0?2.2:1.2,0,Math.PI*2);ctx.fillStyle=`rgba(${colors.bright},.7)`;ctx.fill();}
  }
  function tick(now){frame=0;const dt=lastTime?Math.min((now-lastTime)/1000,.05):0;lastTime=now;time+=dt;smooth.x+=(pointer.x-smooth.x)*.045;smooth.y+=(pointer.y-smooth.y)*.045;paint();if(state.motion&&visible&&!document.hidden)frame=requestAnimationFrame(tick);}
  function refresh(){cancelAnimationFrame(frame);frame=0;lastTime=0;paint();if(state.motion&&visible&&!document.hidden)frame=requestAnimationFrame(tick);}
  function resize(){const rect=stage.getBoundingClientRect();width=rect.width;height=rect.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);paint();}
  function setMotion(enabled,save=true){state.motion=enabled;const b=$('#motion-button');b.setAttribute('aria-pressed',String(enabled));b.setAttribute('aria-label',enabled?'暂停轨道动态':'开启轨道动态');b.querySelector('span').textContent=enabled?'暂停动态':'开启动效';b.querySelector('use').setAttribute('href',enabled?'#i-pause':'#i-play');if(save)storage.set('yubai-demo-motion',String(enabled));refresh();}
  new ResizeObserver(resize).observe(stage);new IntersectionObserver(e=>{visible=e[0].isIntersecting;refresh();},{threshold:.01}).observe(stage);
  stage.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=stage.getBoundingClientRect();pointer={x:(e.clientX-r.left)/width*2-1,y:(e.clientY-r.top)/height*2-1};});stage.addEventListener('pointerleave',()=>{pointer={x:0,y:0};});
  $('#motion-button').addEventListener('click',()=>setMotion(!state.motion));document.addEventListener('visibilitychange',refresh);window.addEventListener('yubai-theme',()=>{readColors();paint();});reduced.addEventListener('change',()=>{if(reduced.matches)setMotion(false,false);});readColors();resize();setMotion(state.motion,false);

  const contentDialog=$('#content-dialog'),terminalDialog=$('#terminal-dialog'),dialogs=[contentDialog,terminalDialog];
  function openDialog(dialog){for(const d of dialogs)if(d.open)d.close();dialog.showModal();document.body.classList.add('dialog-open');dialog.scrollTop=0;}
  dialogs.forEach(d=>{d.querySelector('[data-close]').addEventListener('click',()=>d.close());d.addEventListener('close',()=>{if(!dialogs.some(x=>x.open))document.body.classList.remove('dialog-open');});d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});});
  const projects={
    light:{title:'光的形状',category:'VISUAL EXPERIMENT / 概念作品',subtitle:'一张原创生成图，和一次关于“少一点”的练习。',body:'<img src="./assets/light-study.png" width="1536" height="1024" alt="青柠色光沿烟色玻璃环的边缘流动"><h3>让光成为主角</h3><p>这件示例作品从三个词开始：玻璃、光、留白。让一个不完全规则的环停留在深色空间里，用边缘的一点青柠色光，描述它的形状。</p><p>素材为这次 Demo 专门生成的数字艺术图，用来演示个人作品的展示方式，并非你的真实项目经历。</p><h3>真实作品可以怎样呈现</h3><p>替换成自己的作品后，这里可以记录起点、过程与最后的结果。除了图片，也给访客留下一点你做出选择的理由。</p><span class="detail-label">原创生成素材 · 演示内容</span>'},
    notes:{title:'每日一页',category:'READING EXPERIENCE / 概念作品',subtitle:'把零散的想法，收进可以慢慢阅读的页面。',body:'<blockquote>不必每一天都有答案。<br>有时，记下一个问题就很好。</blockquote><h3>先从一段文字开始</h3><p>这是一个轻量阅读体验的概念示例：简单的标题、舒服的行距，以及足够安静的页面。内容不需要很长，读起来也不应该费力。</p><h3>留给未来的自己</h3><p>一页可以是一段旅行片刻、一条学习笔记，也可以是工作结束后的一个念头。重要的是，它有一个可以再次被找到的位置。</p><p>在这次 Demo 中，可以继续点开“手记”里的三篇示例文章，体验阅读和返回流程。</p><span class="detail-label">阅读概念 · 演示内容</span>'}
  };
  const notes={
    space:{title:'留白，也是一种表达',category:'FIELD NOTE / 设计观察',subtitle:'示例手记 · 约 2 分钟',body:'<p>一张页面里，总会有一些地方什么都没有。它们看起来没有承担信息，却决定了我们怎样看见其他内容。</p><h3>给重要的东西一点距离</h3><p>当标题、图片、按钮都紧挨在一起，每个元素都在争取注意力。往后退一步，留出一点空隙，视线反而更容易找到方向。</p><blockquote>留白，是给注意力安排一个可以停留的地方。</blockquote><h3>让页面有自己的节奏</h3><p>文字需要行距，段落需要停顿，内容之间也需要呼吸。设计中的间隔，像对话里短暂的停顿，让下一句话更容易被听见。</p><p>这个个人空间也采用了同样的想法：先认识这里，再看作品，最后读一些零散的想法。每一部分都可以慢慢来。</p><span class="detail-label">原创示例文章</span>'},
    small:{title:'先做一个小小的版本',category:'FIELD NOTE / 创作随想',subtitle:'示例手记 · 约 2 分钟',body:'<p>想做一件事时，我们很容易先看见它最终的样子：内容完整，功能齐全，每个细节都刚刚好。可真正开始的那一天，手边通常只有一个模糊的想法。</p><h3>把第一步缩小</h3><p>如果想做一个网站，可以先做好一页。如果想写一组文章，可以先写清一个片段。让第一步小到今天就能完成，反馈才有机会出现。</p><blockquote>一个能够被打开的小版本，<br>会告诉你接下来该做什么。</blockquote><h3>从实际感受里调整</h3><p>真正点开页面以后，才能发现标题是不是太长、按钮是否容易找到、哪段话还没有说清。把这些具体的问题改好，远比在脑海中一次解决所有问题轻松。</p><p>先完成一个小小的版本。剩下的，让下一次尝试继续。</p><span class="detail-label">原创示例文章</span>'},
    internet:{title:'为什么还想拥有一个个人网站',category:'FIELD NOTE / 数字生活',subtitle:'示例手记 · 约 3 分钟',body:'<p>我们在很多地方留下内容：社交动态、聊天里的链接、手机相册中的截图。它们记录过某一个瞬间，但常常很快就被新的内容盖住。</p><h3>一个可以自己安排的地方</h3><p>个人网站可以让这些片段重新有一个次序。你决定哪些作品放在前面，哪些文章留给慢慢阅读的人，以及怎样介绍现在的自己。</p><blockquote>这里不需要一直热闹，<br>只需要有一点属于自己的声音。</blockquote><h3>内容可以慢慢长出来</h3><p>开始时只有一句介绍和一张照片也没关系。以后有了新作品，就为它添一页；想清楚了一件事，就写下一段。每次回来看，它都多了一点时间留下的痕迹。</p><p>最后，网站的样子会逐渐接近你。因为那些被留下来的东西，本身就在介绍你。</p><span class="detail-label">原创示例文章</span>'}
  };
  function showContent(item){$('#content-category').textContent=item.category;const body=$('#content-body');body.replaceChildren();const title=document.createElement('h2');title.id='content-title';title.textContent=item.title;const subtitle=document.createElement('p');subtitle.className='detail-subtitle';subtitle.textContent=item.subtitle;body.append(title,subtitle);const article=document.createElement('article');article.innerHTML=item.body;body.append(article);openDialog(contentDialog);}
  $$('[data-project]').forEach(b=>b.addEventListener('click',()=>showContent(projects[b.dataset.project])));$$('[data-note]').forEach(b=>b.addEventListener('click',()=>showContent(notes[b.dataset.note])));

  const output=$('#terminal-output'),input=$('#terminal-input');
  const commands=['help','whoami','work','notes','about','home','theme dark','theme light','motion on','motion off','clear'];
  const history=[];let historyCursor=0;
  function openTerminal(){openDialog(terminalDialog);input.focus({preventScroll:true});}
  $$('[data-command]').forEach(b=>b.addEventListener('click',openTerminal));
  function say(text,kind=''){const p=document.createElement('p');p.textContent=text;if(kind)p.className=kind;output.append(p);output.scrollTop=output.scrollHeight;}
  function go(id){terminalDialog.close();location.hash=id;document.getElementById(id).scrollIntoView({behavior:reduced.matches?'instant':'smooth'});}
  function run(raw){
    const command=raw.trim();if(!command)return;history.push(command);historyCursor=history.length;say('❯ '+command,'terminal-echo');const parts=command.toLowerCase().split(/\s+/),name=parts[0],arg=parts[1];
    if(name==='help'){const grid=document.createElement('div');grid.className='help-grid';const items=[['whoami','认识这个空间'],['work / notes','打开作品 / 手记'],['about / home','前往关于 / 首页'],['theme light','切换浅色（或 theme dark）'],['motion off','暂停轨道（或 motion on）'],['clear','清空输出']];items.forEach(row=>row.forEach(value=>{const span=document.createElement('span');span.textContent=value;grid.append(span);}));output.append(grid);}
    else if(name==='whoami'){say('余白 / YUBAI\n一个关于作品、手记与好奇心的个人空间。\n当前为原创设计 Demo，名字和内容都可以替换成你的。');}
    else if(['work','projects','notes','about','home'].includes(name)){say('正在打开…');go(name==='projects'?'work':name);}
    else if(name==='ls'){say('home   work   notes   about');}
    else if(name==='theme'&&['dark','light'].includes(arg)&&parts.length===2){setTheme(arg);say('已切换为'+(arg==='dark'?'深色':'浅色')+'主题。');}
    else if(name==='motion'&&['on','off'].includes(arg)&&parts.length===2){setMotion(arg==='on');say(arg==='on'?'轨道动态已开启。':'轨道动态已暂停。');}
    else if(name==='clear'&&parts.length===1){output.replaceChildren();}
    else{say('没有找到这个命令。输入 help 查看可用操作。','terminal-error');}
    input.value='';output.scrollTop=output.scrollHeight;
  }
  $('#terminal-form').addEventListener('submit',e=>{e.preventDefault();run(input.value);});output.addEventListener('click',e=>{const b=e.target.closest('[data-run]');if(b)run(b.dataset.run);});
  input.addEventListener('keydown',e=>{if(e.key==='ArrowUp'){e.preventDefault();historyCursor=Math.max(0,historyCursor-1);input.value=history[historyCursor]||'';}if(e.key==='ArrowDown'){e.preventDefault();historyCursor=Math.min(history.length,historyCursor+1);input.value=history[historyCursor]||'';}if(e.key==='Tab'&&!e.shiftKey&&input.value.trim()){const matches=commands.filter(c=>c.startsWith(input.value.trim().toLowerCase()));if(matches.length){e.preventDefault();if(matches.length===1)input.value=matches[0];else say(matches.join('   '));}}if(e.ctrlKey&&e.key.toLowerCase()==='l'){e.preventDefault();output.replaceChildren();}});
  document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(terminalDialog.open)terminalDialog.close();else openTerminal();}});
  const sections=$$('main > section[id]');let scrollFrame=0;
  function updateNav(){scrollFrame=0;let current='home';for(const section of sections)if(section.getBoundingClientRect().top<180)current=section.id;$$('.main-nav a').forEach(a=>{if(a.hash==='#'+current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});}
  window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateNav);},{passive:true});updateNav();
})();
