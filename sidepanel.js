(async()=>{
  const $=id=>document.getElementById(id),DATA_KEY='taskhubPlannerDataV1',LANG_KEY='taskhubLanguage';
  const pad=n=>String(n).padStart(2,'0'),dateISO=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const parse=s=>{if(typeof s!=='string')return new Date(NaN);const m=s.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/);if(!m)return new Date(NaN);const d=new Date(+m[1],+m[2]-1,+m[3]);return dateISO(d)===m[1]+'-'+m[2]+'-'+m[3]?d:new Date(NaN)};
  const todayKey=()=>dateISO(new Date());
  let lang='zh',data={tasks:[],categories:[]},selected=todayKey(),shown=new Date(new Date().getFullYear(),new Date().getMonth(),1),busy=false;
  const tr=(zh,en)=>lang==='zh'?zh:en;
  const cat=id=>data.categories.find(c=>c.id===id)||{name:tr('未分类','Uncategorized'),color:'#aab5bc'};
  const shifted=t=>t&&!t.done&&!t.missed&&t.end<todayKey();
  const range=t=>shifted(t)?{start:todayKey(),end:todayKey(),shifted:true}:{start:t.start,end:t.end,shifted:false};
  const matches=(t,day)=>{const r=range(t);return r.start<=day&&r.end>=day};
  const toast=text=>{const el=$('toast');el.textContent=text;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1700)};
  async function getData(){
    const v=await chrome.storage.local.get([DATA_KEY,LANG_KEY]);
    if(v[DATA_KEY]&&Array.isArray(v[DATA_KEY].tasks))data=v[DATA_KEY];
    else{
      data={categories:[{id:'study',name:'学习',color:'#6f91bd'},{id:'research',name:'科研',color:'#9a83bd'},{id:'work',name:'工作',color:'#d49a62'},{id:'life',name:'生活',color:'#78a184'},{id:'important',name:'重要',color:'#cf7777'}],tasks:[]};
      await chrome.storage.local.set({[DATA_KEY]:data});
    }
    if(!Array.isArray(data.categories)||!data.categories.length)data.categories=[{id:'study',name:'学习',color:'#6f91bd'}];
    lang=v[LANG_KEY]==='en'?'en':'zh';
  }
  async function mutate(change){if(busy)return false;busy=true;try{const obj=await chrome.storage.local.get(DATA_KEY);const snapshot=obj[DATA_KEY];if(!snapshot||!Array.isArray(snapshot.tasks))throw new Error('Missing task data');change(snapshot);await chrome.storage.local.set({[DATA_KEY]:snapshot});data=snapshot;render();return true}catch(err){console.error(err);toast(tr('保存失败','Save failed'));return false}finally{busy=false}}
  async function status(id,name){await mutate(d=>{const t=d.tasks.find(t=>t.id===id);if(!t)return;if(name==='done'){t.done=!t.done;if(t.done)t.missed=false}else if(name==='missed'){t.missed=!t.missed;if(t.missed)t.done=false}else if(name==='important'){t.important=!t.important}})}
  function render(){
    document.documentElement.lang=lang==='zh'?'zh-CN':'en';$('language').textContent=lang==='zh'?'EN':'中文';
    $('subheading').textContent=tr('今天，专注眼前','Focus on today');$('newLabel').textContent=tr('新建','New');
    $('dateLabel').textContent=tr('TODAY · 今日','TODAY');$('heroDate').textContent=new Date().toLocaleDateString(lang==='zh'?'zh-CN':'en-US',{month:'long',day:'numeric',weekday:'long'});
    $('pendingLabel').textContent=tr('待完成','Pending');$('doneLabel').textContent=tr('已完成','Done');$('missedLabel').textContent=tr('已标未完成','Missed');
    $('selectedHeading').textContent=selected===todayKey()?tr('今日事项','Today’s tasks'):tr('当日日程','Tasks on this date');
    $('missedHeading').textContent=tr('已标记未完成','Marked as missed');
    $('calendarHelp').textContent=tr('点击日期查看日程 · 过期待办自动顺延到今天','Choose a day · Overdue pending tasks roll into today');
    $('fullLabel').textContent=tr('打开完整日历','Open full calendar');$('saveHint').textContent=tr('与主看板自动同步','Automatically synced');
    const pendingToday=data.tasks.filter(t=>matches(t,todayKey())&&!t.done&&!t.missed),doneToday=data.tasks.filter(t=>matches(t,todayKey())&&t.done),missedAll=data.tasks.filter(t=>t.missed);
    $('pendingCount').textContent=pendingToday.length;$('doneCount').textContent=doneToday.length;$('missedCount').textContent=missedAll.length;
    $('monthName').textContent=shown.toLocaleDateString(lang==='zh'?'zh-CN':'en-US',{year:'numeric',month:'long'});
    const labels=lang==='zh'?['日','一','二','三','四','五','六']:['S','M','T','W','T','F','S'];$('weekdays').innerHTML='';labels.forEach(x=>{const s=document.createElement('span');s.textContent=x;$('weekdays').append(s)});
    const first=new Date(shown.getFullYear(),shown.getMonth(),1),start=new Date(first);start.setDate(first.getDate()-first.getDay());
    const total=Math.ceil((first.getDay()+new Date(shown.getFullYear(),shown.getMonth()+1,0).getDate())/7)*7;
    const grid=$('monthGrid');grid.innerHTML='';
    for(let i=0;i<total;i++){
      const d=new Date(start);d.setDate(start.getDate()+i);const key=dateISO(d),button=document.createElement('button');button.type='button';button.className=(d.getMonth()===shown.getMonth()?'':'outside ')+(key===selected?'selected ':'')+(key===todayKey()?'today':'');
      const num=document.createElement('span');num.className='number';num.textContent=d.getDate();const dots=document.createElement('div');dots.className='dots';
      data.tasks.filter(t=>matches(t,key)).slice(0,3).forEach(t=>{const dot=document.createElement('i');dot.className='dot'+(t.missed?' missed':shifted(t)?' carry':'');dots.append(dot)});
      button.append(num,dots);button.setAttribute('aria-label',key);button.onclick=()=>{selected=key;if(d.getMonth()!==shown.getMonth())shown=new Date(d.getFullYear(),d.getMonth(),1);render()};grid.append(button);
    }
    const list=data.tasks.filter(t=>matches(t,selected)).sort((a,b)=>Number(!!b.important)-Number(!!a.important)||Number(shifted(b))-Number(shifted(a))||a.start.localeCompare(b.start));
    $('taskCaption').textContent=tr(`${list.length} 项日程`,`${list.length} events`);
    drawTasks('taskList',list);
    const archive=data.tasks.filter(t=>t.missed&&t.end<todayKey()).sort((a,b)=>b.end.localeCompare(a.end)).slice(0,6);
    $('missedArea').hidden=archive.length===0;drawTasks('missedList',archive);
    $('quickTitle').textContent=tr('快速新建日程','Quick new task');$('labelTitle').textContent=tr('日程名称','Task name');$('labelStart').textContent=tr('开始日期','Start date');$('labelEnd').textContent=tr('结束日期','End date');$('labelCategory').textContent=tr('分类','Category');$('repeatTip').textContent=tr('重复任务可在完整看板中创建。','Use the full dashboard to create recurring tasks.');$('saveQuick').textContent=tr('保存日程','Save task');$('importantLabel').textContent=tr('⭐ 标记为重要任务','⭐ Mark as important');$('titleInput').placeholder=tr('输入任务名称','Enter a task name');
  }
  function drawTasks(id,tasks){
    const dest=$(id);dest.innerHTML='';if(!tasks.length){const e=document.createElement('div');e.className='empty';e.textContent=tr('这里暂时没有日程','Nothing scheduled');dest.append(e);return}
    tasks.forEach(t=>{
      const r=range(t),c=cat(t.category),row=document.createElement('div');row.className='task-row';
      const cb=document.createElement('input');cb.type='checkbox';cb.className='task-check';cb.checked=!!t.done;cb.setAttribute('aria-label',tr('标记完成','Mark done'));cb.onchange=()=>status(t.id,'done');
      const main=document.createElement('div');main.className='task-main';const title=document.createElement('span');title.className='task-title'+(t.done?' done':'')+(t.missed?' missed':'');title.textContent=(t.important?'⭐ ':'')+t.title;
      const meta=document.createElement('div');meta.className='task-meta';meta.textContent=`${c.name} · ${t.start===t.end?t.start:t.start+' — '+t.end}`;main.append(title,meta);
      if(r.shifted||t.missed){const tag=document.createElement('span');tag.className='tag'+(t.missed?' missed':'');tag.textContent=t.missed?tr('未完成','Missed'):tr('顺延到今天','Carried to today');main.append(tag)}
      const star=document.createElement('button');star.type='button';star.className='task-star'+(t.important?' selected':'');star.textContent=t.important?'★':'☆';star.title=t.important?tr('取消重要标记','Remove important flag'):tr('标记为重要任务','Mark as important');star.setAttribute('aria-label',star.title);star.setAttribute('aria-pressed',String(!!t.important));star.onclick=()=>status(t.id,'important');
      const flag=document.createElement('button');flag.type='button';flag.className='task-flag'+(t.missed?' selected':'');flag.textContent='!';flag.title=t.missed?tr('取消未完成标记','Unmark missed'):tr('标记未完成（留在原日期）','Mark missed (keep original date)');flag.setAttribute('aria-label',flag.title);flag.onclick=()=>status(t.id,'missed');
      row.append(cb,main,star,flag);dest.append(row);
    });
  }
  function openQuick(){const options=$('categoryInput');options.innerHTML='';data.categories.forEach(c=>{const op=document.createElement('option');op.value=c.id;op.textContent=c.name;options.append(op)});$('startInput').value=selected;$('endInput').value=selected;$('titleInput').value='';$('importantInput').checked=false;$('quickOverlay').hidden=false;setTimeout(()=>$('titleInput').focus(),40)}
  $('newTask').onclick=openQuick;$('closeQuick').onclick=()=>{$('quickOverlay').hidden=true};$('quickOverlay').addEventListener('click',e=>{if(e.target===$('quickOverlay'))$('quickOverlay').hidden=true});
  $('startInput').addEventListener('change',()=>{if($('endInput').value<$('startInput').value)$('endInput').value=$('startInput').value});
  $('quickForm').addEventListener('submit',async e=>{
    e.preventDefault();const title=$('titleInput').value.trim(),start=$('startInput').value,end=$('endInput').value,category=$('categoryInput').value,important=$('importantInput').checked;
    if(!title||!start||!end||end<start){toast(tr('请检查名称和日期','Check the title and dates'));return}
    const saved=await mutate(d=>{d.tasks.push({id:crypto.randomUUID?.()||`task-${Date.now()}-${Math.random().toString(36).slice(2)}`,title,start,end,category,done:false,missed:false,important})});
    if(!saved)return;
    selected=start;shown=new Date(parse(start).getFullYear(),parse(start).getMonth(),1);$('quickOverlay').hidden=true;render();toast(tr('日程已保存','Task saved'));
  });
  $('language').onclick=async()=>{lang=lang==='zh'?'en':'zh';await chrome.storage.local.set({[LANG_KEY]:lang});render()};
  $('prevMonth').onclick=()=>{shown=new Date(shown.getFullYear(),shown.getMonth()-1,1);render()};
  $('nextMonth').onclick=()=>{shown=new Date(shown.getFullYear(),shown.getMonth()+1,1);render()};
  $('toToday').onclick=()=>{selected=todayKey();shown=new Date(new Date().getFullYear(),new Date().getMonth(),1);render()};
  $('fullBoard').onclick=async()=>{try{await chrome.runtime.sendMessage({type:'TASKHUB_OPEN_TAB'})}catch(e){console.error(e);toast(tr('打开失败','Could not open'))}};
  $('openWindow').onclick=async()=>{try{const result=await chrome.runtime.sendMessage({type:'TASKHUB_OPEN_WINDOW'});if(!result?.ok)throw Error(result?.error)}catch(e){console.error(e);toast(tr('独立窗口打开失败','Could not open a window'))}};
  chrome.storage.onChanged.addListener((changes,area)=>{if(area!=='local')return;if(changes[DATA_KEY]?.newValue)data=changes[DATA_KEY].newValue;if(changes[LANG_KEY])lang=changes[LANG_KEY].newValue==='en'?'en':'zh';render()});
  setInterval(()=>{render()},60000);
  try{await getData();render()}catch(e){console.error(e);toast('Taskhub storage error')}
})();
