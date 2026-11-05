
(async()=>{
  const $=id=>document.getElementById(id);
  let today=new Date(); today.setHours(0,0,0,0);
  const pad=n=>String(n).padStart(2,'0');
  const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const parse=s=>{
    if(s instanceof Date)return new Date(s.getFullYear(),s.getMonth(),s.getDate());
    if(typeof s!=='string')return new Date(NaN);
    const match=s.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/);
    if(!match)return new Date(NaN);
    const y=Number(match[1]),m=Number(match[2]),d=Number(match[3]);
    const result=new Date(y,m-1,d);
    if(result.getFullYear()!==y||result.getMonth()!==m-1||result.getDate()!==d)return new Date(NaN);
    return result;
  };
  const normalizeDate=value=>{const d=parse(value);return Number.isNaN(d.getTime())?null:iso(d)};
  const hasValidRange=t=>!!t&&!!normalizeDate(t.start)&&!!normalizeDate(t.end)&&normalizeDate(t.end)>=normalizeDate(t.start);
  const monthNames=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
  const i18n = {
    zh: {
      '侧边栏':'侧边栏','独立窗口':'独立窗口','未完成':'未完成','标记未完成说明':'标记为未完成后留在原日期并显示浅红色；未标记的过期待办自动顺延到今天。',
      'Personal Workspace':'个人工作区','Home':'首页','My Tasks':'我的任务','Task List':'任务列表','Categories':'分类管理','PROJECTS':'任务分类',
      'Your plans, all in one place.':'所有计划，一目了然。','Make every day count.':'让每一天都有收获。','Monitor all of your tasks here':'在这里管理全部日程',
      '＋ New':'＋ 新建','本月任务':'本月任务','已完成':'已完成','待完成任务数':'待完成任务数','⭐ 重要任务':'⭐ 重要任务','重要任务提示':'为这项日程添加星标，日历、任务列表和侧边栏都会显示。','完成进度':'完成进度','List':'列表','Calendar':'日历','Today':'今天',
      '⚙ Settings':'⚙ 设置','Your monthly overview':'本月日程概览','点击任务色条可编辑':'点击日程可编辑 · 点击日期可新增',
      'Sun':'周日','Mon':'周一','Tue':'周二','Wed':'周三','Thu':'周四','Fri':'周五','Sat':'周六',
      '还没有任务，点击右上角「＋ New」开始安排。':'暂无任务，点击任意日期快速添加。','任务色条会按日期区间自动延展':'日程色条会按照日期区间自动延展',
      'Task list':'任务列表','全部':'全部','待完成':'待完成','新建任务':'新建任务','任务名称':'任务名称','开始日期':'开始日期',
      '结束日期':'结束日期','任务分类':'任务分类','开启后，日历任务会变成灰色并显示完成标记':'开启后，日历任务会变灰并出现完成标记',
      '选择开始和结束日期后，任务会以连续色条显示在日历中；跨周或跨月的任务会自动延续。':'选择日期区间后，日程会在日历中连续显示，跨周和跨月自动延续。',
      '删除任务':'删除任务','取消':'取消','保存任务':'保存任务','添加分类':'添加分类','分类名称':'分类名称',
      '标记颜色':'标记颜色','选择一种颜色，用于日历色条和任务标记。':'请选择日历日程与分类的颜色。','自定义颜色':'自定义颜色','点击色卡快速选择，或使用调色盘自定义。':'点击色卡快速选择，或使用调色盘自定义。',
      '删除分类':'删除分类','保存分类':'保存分类','Data & Settings · 数据管理':'数据与设置','自动保存已启用':'自动保存已启用',
      '任务和分类自动保存在本 Edge 扩展中。正常更新且扩展 ID 不变时，无需迁移。':'所有任务和分类自动保存在当前扩展中；使用同一扩展更新无需迁移。',
      '安全备份（可选）':'安全备份（可选）','只有更换电脑、卸载扩展或意外丢失数据时，才需要使用备份。':'只有更换电脑或重装扩展时，才建议使用备份。',
      '备份到文件':'备份到文件','从备份恢复':'从备份恢复','正在读取存储状态…':'正在读取存储状态…',
      'Search tasks...':'搜索任务...','例如：完成文献综述初稿':'例如：完成文献综述初稿','例如：雅思备考':'例如：雅思备考',
      '添加分类':'添加分类','管理分类':'管理分类','使用说明':'使用说明','数据与设置':'数据与设置',
      '提醒':'提醒','每日提醒设置':'每日提醒设置','按时提醒今日事项':'按时提醒今日事项','提醒说明':'每天可设置多个时间，通知会显示当日待办及尚未完成的过期任务。','开启桌面通知':'开启桌面通知','仅在你设置的时刻提醒；无待完成事项时不打扰。':'仅在你设置的时刻提醒；无待完成事项时不打扰。','每天提醒时间':'每天提醒时间','添加时间':'＋ 添加时间','最多设置12个提醒时刻，点击时间右侧的叉号可删除。':'最多设置 12 个提醒时刻，点击时间右侧的 × 可删除。','常用时间':'常用时间','今日待办预览':'今日待办预览','提醒使用说明':'请保持 Edge 运行并允许 Windows 或 macOS 的浏览器通知。电脑休眠、关机或系统勿扰时，通知可能延迟或不显示。','发送测试通知':'发送测试通知','完成':'完成','每日提醒':'每日提醒','提醒设置入口说明':'可设置每天多次的 Edge 桌面提醒，汇总今天及逾期未完成的任务。','设置提醒时间':'设置提醒时间',
      '重复日程':'重复日程','Excel 导入':'Excel 导入','创建重复日程':'创建重复日程','重复截止日期':'重复截止日期','重复周期':'重复周期','重复间隔':'重复间隔','每周重复星期':'每周重复星期','每':'每','天':'天','周':'周','月':'月','周日':'日','周一':'一','周二':'二','周三':'三','周四':'四','周五':'五','周六':'六','重复日程说明':'生成后的每次日程都可独立编辑、勾选完成或删除；修改其中一次不会改变其他日期。','重复日程示例':'例如：每日英语听力','Excel 日程导入':'Excel 日程导入','Excel导入说明':'先下载固定模板，在 Tasks 工作表填写日程。支持普通日程和重复规则；未知分类会自动创建。','下载 Excel 模板':'下载 Excel 模板','选择 Excel 文件':'选择 Excel 文件','选择 .xlsx 文件':'选择 .xlsx 文件','导入日程':'导入日程','正在解析 Excel…':'正在解析 Excel…','请选择 .xlsx 文件':'请选择 .xlsx 文件','每次':'每次','次':'次','设置为重复日程':'设置为重复日程','开启后可设置每天、每周或每月的重复规则':'开启后可设置每天、每周或每月的重复规则','当前正在编辑重复日程中的单次任务；修改只影响本次。':'这属于一项重复日程，修改只影响当前这一次。'
    },
    en: {
      '侧边栏':'Sidebar','独立窗口':'Window','未完成':'Missed','标记未完成说明':'Mark as missed to keep this event on its original date in pale red. Other overdue tasks roll forward to today.',
      'Personal Workspace':'Personal Workspace','Home':'Home','My Tasks':'My Tasks','Task List':'Task List','Categories':'Categories','PROJECTS':'CATEGORIES',
      'Your plans, all in one place.':'Your plans, all in one place.','Make every day count.':'Make every day count.','Monitor all of your tasks here':'Manage all your tasks here',
      '＋ New':'＋ New','本月任务':'Monthly tasks','已完成':'Completed','待完成任务数':'Pending tasks','⭐ 重要任务':'⭐ Important','重要任务提示':'Star this task to highlight it in calendar, list and sidebar.','完成进度':'Progress','List':'List','Calendar':'Calendar','Today':'Today',
      '⚙ Settings':'⚙ Settings','Your monthly overview':'Your monthly overview','点击任务色条可编辑':'Click an event to edit · Click a day to add',
      'Sun':'Sun','Mon':'Mon','Tue':'Tue','Wed':'Wed','Thu':'Thu','Fri':'Fri','Sat':'Sat',
      '还没有任务，点击右上角「＋ New」开始安排。':'No tasks yet. Click a day to create one.','任务色条会按日期区间自动延展':'Events span their selected date range',
      'Task list':'Task list','全部':'All','待完成':'Pending','新建任务':'New task','任务名称':'Task title','开始日期':'Start date',
      '结束日期':'End date','任务分类':'Category','开启后，日历任务会变成灰色并显示完成标记':'Completed events turn gray and show a checkmark',
      '选择开始和结束日期后，任务会以连续色条显示在日历中；跨周或跨月的任务会自动延续。':'Select a date range to show a continuous calendar event, including across weeks and months.',
      '删除任务':'Delete task','取消':'Cancel','保存任务':'Save task','添加分类':'Add category','分类名称':'Category name',
      '标记颜色':'Color','选择一种颜色，用于日历色条和任务标记。':'Choose a color for calendar events and categories.','自定义颜色':'Custom color','点击色卡快速选择，或使用调色盘自定义。':'Pick a preset, or open the color picker for a custom shade.',
      '删除分类':'Delete category','保存分类':'Save category','Data & Settings · 数据管理':'Data & Settings','自动保存已启用':'Auto-save enabled',
      '任务和分类自动保存在本 Edge 扩展中。正常更新且扩展 ID 不变时，无需迁移。':'Tasks and categories are stored automatically in this extension. Updates with the same extension ID keep the data.',
      '安全备份（可选）':'Optional backup','只有更换电脑、卸载扩展或意外丢失数据时，才需要使用备份。':'Backups are recommended when switching computers or reinstalling the extension.',
      '备份到文件':'Export backup','从备份恢复':'Restore backup','正在读取存储状态…':'Reading storage status…',
      'Search tasks...':'Search tasks...','例如：完成文献综述初稿':'e.g. Finish literature review','例如：雅思备考':'e.g. IELTS preparation',
      '管理分类':'Manage categories','使用说明':'Help','数据与设置':'Data & Settings',
      '提醒':'Reminders','每日提醒设置':'Daily reminders','按时提醒今日事项':'Stay on top of today','提醒说明':'Choose multiple times per day. Notifications summarize today and any overdue unfinished tasks.','开启桌面通知':'Enable desktop notifications','仅在你设置的时刻提醒；无待完成事项时不打扰。':'Only at your chosen times. Silent when nothing is pending.','每天提醒时间':'Daily reminder times','添加时间':'+ Add time','最多设置12个提醒时刻，点击时间右侧的叉号可删除。':'Up to 12 times per day. Use × to remove a time.','常用时间':'Quick choices','今日待办预览':'Today’s task preview','提醒使用说明':'Keep Edge running and allow browser notifications in your system settings. Sleep, shutdown, and Do Not Disturb may delay or hide alerts.','发送测试通知':'Send test notification','完成':'Done','每日提醒':'Daily reminders','提醒设置入口说明':'Set multiple Edge notifications per day for today’s tasks and overdue unfinished work.','设置提醒时间':'Set reminder times',
      '重复日程':'Recurring','Excel 导入':'Import Excel','创建重复日程':'Create recurring events','重复截止日期':'Repeat until','重复周期':'Repeat unit','重复间隔':'Repeat every','每周重复星期':'Repeat on weekdays','每':'Every','天':'day(s)','周':'week(s)','月':'month(s)','周日':'Sun','周一':'Mon','周二':'Tue','周三':'Wed','周四':'Thu','周五':'Fri','周六':'Sat','重复日程说明':'Each occurrence can be edited, completed, or deleted independently. Editing one occurrence will not change the others.','重复日程示例':'e.g. Daily English listening','Excel 日程导入':'Import events from Excel','Excel导入说明':'Download the template and fill in the Tasks sheet. One-off events and recurrence rules are supported; unknown categories are created automatically.','下载 Excel 模板':'Download Excel template','选择 Excel 文件':'Choose Excel file','选择 .xlsx 文件':'Choose .xlsx file','导入日程':'Import events','正在解析 Excel…':'Parsing Excel…','请选择 .xlsx 文件':'Please choose an .xlsx file','每次':'Every','次':'times','设置为重复日程':'Repeat this task','开启后可设置每天、每周或每月的重复规则':'Set a daily, weekly, or monthly schedule','当前正在编辑重复日程中的单次任务；修改只影响本次。':'This is one occurrence of a recurring task. Changes affect only this occurrence.'
    }
  };
  let lang = 'zh';
  const tr=(zh,en)=>lang==='en'?en:zh;
  const translateStatic=()=>{
    document.documentElement.lang=lang==='zh'?'zh-CN':'en';
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key=el.dataset.i18n, value=i18n[lang][key];
      if(value===undefined)return;
      // Update the element's text node without deleting nested controls or counters.
      const textNode=[...el.childNodes].find(node=>node.nodeType===Node.TEXT_NODE);
      if(textNode)textNode.nodeValue=value;else el.textContent=value;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{el.placeholder=i18n[lang][el.dataset.i18nPlaceholder]||''});
    document.querySelectorAll('[data-i18n-title]').forEach(el=>{el.title=i18n[lang][el.dataset.i18nTitle]||''});
    document.querySelectorAll('[data-lang]').forEach(el=>el.classList.toggle('active',el.dataset.lang===lang));
    $('homeNav').lastChild.textContent=tr('首页','Home');
    $('myTasksNav').lastChild.textContent=tr('我的任务','My Tasks');
    $('listNav').lastChild.textContent=tr('任务列表','Task List');
    $('categoriesNav').lastChild.textContent=tr('分类管理','Categories');
    $('addTaskTop').textContent=tr('＋ 新建','＋ New');
    document.querySelector('.sidebar-footer').textContent=tr('所有计划，一目了然。 让每一天都有收获。','Your plans, all in one place. Make every day count.');
    $('manageCatsTop').title=tr('管理分类','Manage categories');
    $('helpButton').title=tr('使用说明','Help');
    $('reminderTop').title=tr('提醒设置','Reminder settings');
    $('prevMonth').setAttribute('aria-label',tr('上个月','Previous month'));
    $('nextMonth').setAttribute('aria-label',tr('下个月','Next month'));
    $('taskCountLabel').textContent=tr('0 项','0 tasks');
    document.querySelector('[data-filter="done"]').textContent=tr('已完成','Completed');
    $('taskDone').setAttribute('aria-label',tr('切换任务完成状态','Toggle completed'));
    $('taskMissed').setAttribute('aria-label',tr('标记未完成','Mark missed'));
    $('taskImportant').setAttribute('aria-label',tr('标记为重要任务','Mark as important'));
    $('openSidebarButton').title=tr('在 Edge 侧边栏打开','Open in Edge sidebar');
    $('openWindowButton').title=tr('在独立窗口打开','Open in separate window');
    $('mobileAdd').setAttribute('aria-label',tr('新建任务','New task'));
    $('calendarHint').textContent=tr('暂无任务，点击任意日期快速添加。','No tasks yet. Click a day to create one.');
    if($('repeatUnitSuffix')){const u=$('repeatUnit')?.value||'day';$('repeatUnitSuffix').textContent=u==='week'?tr('周','week(s)'):u==='month'?tr('月','month(s)'):tr('天','day(s)')}
    if($('repeatPreview'))updateRepeatModeUI();
    if($('reminderTimeChips'))drawReminderControls();
  };
  const defaultData={categories:[
    {id:'study',name:'学习',color:'#6f91bd'},{id:'research',name:'科研',color:'#9a83bd'},{id:'work',name:'工作',color:'#d49a62'},{id:'life',name:'生活',color:'#78a184'},{id:'important',name:'重要',color:'#cf7777'}
  ],tasks:[]};
  // Persist data in the extension's dedicated storage, not file:// localStorage.
  const storageKey='taskhubPlannerDataV1';
  let stored={};
  try { stored=await chrome.storage.local.get(storageKey); }
  catch(err){ console.error('Unable to load extension storage',err); alert('无法读取扩展存储。请检查 Edge 扩展权限。'); return; }
  let data=stored[storageKey] || structuredClone(defaultData);
  // V1.4 reminder settings are separate from task storage: older data remains intact.
  const reminderKey='taskhubReminderSettingsV1';
  const isReminderTime=s=>typeof s==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(s);
  let reminderSettings={enabled:false,times:['09:00','20:00']};
  try {
    const savedReminders=await chrome.storage.local.get(reminderKey);
    const old=savedReminders[reminderKey];
    if(old&&typeof old==='object'){
      reminderSettings={enabled:old.enabled===true,times:Array.isArray(old.times)?[...new Set(old.times.filter(isReminderTime))].sort().slice(0,12):['09:00','20:00']};
    }
  }catch(err){console.error('Failed loading Taskhub reminder settings',err)}
  let reminderSaveQueue=Promise.resolve();
  function saveReminderSettings(){
    const snapshot=structuredClone(reminderSettings);
    reminderSaveQueue=reminderSaveQueue.catch(()=>{}).then(()=>chrome.storage.local.set({[reminderKey]:snapshot})).catch(err=>{
      console.error('Failed to save reminders',err);showToast(tr('提醒设置保存失败','Could not save reminder settings'));
    });
    return reminderSaveQueue;
  }

  try { const pref=await chrome.storage.local.get('taskhubLanguage'); lang=pref.taskhubLanguage==='en'?'en':'zh'; } catch(_) {}
  if(!Array.isArray(data.categories)||!data.categories.length)data.categories=structuredClone(defaultData.categories);
  if(!Array.isArray(data.tasks))data.tasks=[];
  let repairedTaskDates=0;
  data.tasks=data.tasks.filter(t=>t&&typeof t==='object').map((t,index)=>{
    const rawStart=t.start??t.startDate??t.date??t.dueDate??t.deadline;
    const rawEnd=t.end??t.endDate??rawStart;
    let start=normalizeDate(rawStart),end=normalizeDate(rawEnd);
    if(!start&&end)start=end;
    if(start&&!end)end=start;
    // Keep undated legacy tasks visible and editable instead of allowing one record to blank the whole calendar.
    if(!start&&!end){start=iso(today);end=start;repairedTaskDates++;}
    if(end<start){[start,end]=[end,start];repairedTaskDates++;}
    const fallbackCategory=data.categories[0]?.id||'uncategorized';
    return {...t,important:!!t.important,missed:!!t.missed&&!t.done,id:typeof t.id==='string'&&t.id?t.id:`legacy-${index}-${Date.now()}`,title:String(t.title??t.name??'未命名任务'),start,end,category:typeof t.category==='string'?t.category:fallbackCategory,done:!!t.done};
  });
  let viewDate=new Date(today.getFullYear(),today.getMonth(),1),editingTask=null,editingCategory=null,activeFilter='all',activeCategory='all',searchQuery='';
  let pendingSave=Promise.resolve();
  const save=()=>{
    // Snapshot data at each change, serialize writes to preserve their order.
    const snapshot=structuredClone(data);
    pendingSave=pendingSave.catch(()=>{}).then(()=>chrome.storage.local.set({[storageKey]:snapshot})).catch(err=>{
      console.error('Failed saving Taskhub data',err);showToast('保存失败，请检查扩展存储');
    });
    return pendingSave;
  };
  // V1.6: carry an overdue *pending* task to today without changing its
  // original dates. Explicitly marked missed tasks remain in their original slot.
  const carried=t=>hasValidRange(t)&&!t.done&&!t.missed&&t.end<iso(today);
  const displayRange=t=>carried(t)?{start:iso(today),end:iso(today),carry:true}:{start:t.start,end:t.end,carry:false};
  function changeStatus(id,status){
    const task=data.tasks.find(t=>t.id===id);if(!task)return;
    if(status==='done'){task.done=!task.done;if(task.done)task.missed=false}
    else if(status==='missed'){task.missed=!task.missed;if(task.missed)task.done=false}
    else if(status==='important'){task.important=!task.important}
    save();render();
    showToast(status==='important'?(task.important?tr('已标记重要 ⭐','Marked important ⭐'):tr('已取消重要标记','Important flag removed')):status==='missed'?(task.missed?tr('已标记未完成','Marked as missed'):tr('已恢复为待办','Moved back to pending')):(task.done?tr('任务已完成 ✓','Task completed ✓'):tr('已恢复为待办','Moved back to pending')));
  }
  const matchesTask=t=>(activeCategory==='all'||t.category===activeCategory)&&(!searchQuery||String(t.title||'').toLowerCase().includes(searchQuery.toLowerCase()));
  const cat=id=>data.categories.find(c=>c.id===id)||{name:'未分类',color:'#b6b7b0'};
  const showToast=msg=>{const t=$('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1900)};
  const openModal=id=>$(id).classList.add('open');
  const closeModal=id=>$(id).classList.remove('open');
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal(b.dataset.close)));
  document.querySelectorAll('.modal-backdrop').forEach(b=>b.addEventListener('click',e=>{if(e.target===b)closeModal(b.id)}));

  document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',async()=>{lang=b.dataset.lang;try{await chrome.storage.local.set({taskhubLanguage:lang})}catch(e){console.error(e)}translateStatic();render()}));
  function toggleDone(id){changeStatus(id,'done')}
  function renderCalendar(){
    const y=viewDate.getFullYear(),m=viewDate.getMonth();
    $('monthTitle').textContent=lang==='en'?`${monthNames[m]} ${y}`:`${y} 年 ${m+1} 月`;
    $('overviewMonth').textContent=lang==='en'?`${monthNames[m].slice(0,3)} ${y}`:`${y}年${m+1}月`;
    const first=new Date(y,m,1),offset=first.getDay(),start=new Date(y,m,1-offset),last=new Date(y,m+1,0);
    const total=Math.ceil((offset+last.getDate())/7)*7;
    const weeks=[];
    for(let i=0;i<total;i+=7){const days=[];for(let j=0;j<7;j++){const d=new Date(start);d.setDate(start.getDate()+i+j);days.push(d)}weeks.push(days)}
    const cal=$('calendar');cal.innerHTML='';
    weeks.forEach(days=>{
      const week=document.createElement('div');week.className='week';
      const dayGrid=document.createElement('div');dayGrid.className='week-days';
      days.forEach(d=>{
        const cell=document.createElement('button');cell.type='button';cell.className='day'+(d.getMonth()!==m?' outside':'')+(iso(d)===iso(today)?' today':'');
        const num=document.createElement('span');num.className='day-num';num.textContent=d.getDate();cell.append(num);
        cell.title=tr(`点击添加 ${iso(d)} 的日程`,`Add an event on ${iso(d)}`);
        cell.setAttribute('aria-label',cell.title);cell.addEventListener('click',()=>openTask(null,iso(d)));dayGrid.append(cell);
      });
      const barGrid=document.createElement('div');barGrid.className='week-bars';
      const weekStart=days[0],weekEnd=days[6];
      const relevant=data.tasks.filter(t=>{
        if(!hasValidRange(t)||!matchesTask(t))return false;
        const range=displayRange(t);return parse(range.start)<=weekEnd&&parse(range.end)>=weekStart;
      }).sort((a,b)=>displayRange(a).start.localeCompare(displayRange(b).start)||displayRange(a).end.localeCompare(displayRange(b).end));
      const laneEnds=[];
      relevant.forEach(t=>{
        const range=displayRange(t),rs=parse(range.start),re=parse(range.end);
        const s=rs>weekStart?rs:weekStart,e=re<weekEnd?re:weekEnd;
        const startCol=s.getDay()+1,endCol=e.getDay()+1;
        let lane=laneEnds.findIndex(end=>end<startCol);if(lane<0)lane=laneEnds.length;laneEnds[lane]=endCol;
        const c=cat(t.category),bar=document.createElement('button');bar.type='button';
        bar.className='event'+(s>rs?' continues-left':'')+(e<re?' continues-right':'')+(t.done?' done':'')+(t.missed?' missed':'')+(range.carry?' carried':'')+(t.important?' important':'');
        bar.style.gridColumn=`${startCol} / ${endCol+1}`;bar.style.gridRow=String(lane+1);
        bar.style.background=t.done?'#f1f4f5':t.missed?'#ffeaec':range.carry?'#fff1df':hexToRgba(c.color,.23);
        bar.style.borderLeft=`3px solid ${t.done?'#aab8bc':t.missed?'#e45e70':range.carry?'#e1a24c':c.color}`;
        bar.title=(t.important?'⭐ '+tr('重要任务','Important task')+'\n':'')+`${t.title}\n${t.start} ${tr('至','to')} ${t.end}\n${c.name}`+(range.carry?tr('\n已顺延到今天','\nCarried forward to today'):'')+(t.done?tr(' · 已完成',' · Completed'):t.missed?tr(' · 未完成',' · Missed'):'');
        bar.textContent=(t.important?'⭐ ':'')+(t.repeatGroupId?'↻ ':'')+(range.carry?tr('↪ 顺延 · ','↪ Carried · '):'')+(t.done?tr('✓ 已完成 · ','✓ Completed · '):t.missed?tr('! 未完成 · ','! Missed · '):'')+(s>rs?'↳ ':'')+t.title;
        bar.addEventListener('click',()=>openTask(t.id));barGrid.append(bar);
      });
      barGrid.style.gridTemplateRows=`repeat(${Math.max(1,laneEnds.length)},25px)`;
      week.append(dayGrid,barGrid);
      week.addEventListener('click',evt=>{
        if(evt.target.closest('.event,.day'))return;
        const rect=week.getBoundingClientRect(),x=evt.clientX-rect.left,col=Math.min(6,Math.max(0,Math.floor(x/rect.width*7)));
        openTask(null,iso(days[col]));
      });cal.append(week);
    });
    $('calendarHint').hidden=data.tasks.some(t=>{if(!hasValidRange(t)||!matchesTask(t))return false;const r=displayRange(t);return parse(r.start)<=last&&parse(r.end)>=first});
  }
  function hexToRgba(hex,a){const h=hex.replace('#','');const v=h.length===3?h.split('').map(x=>x+x).join(''):h;const n=parseInt(v,16);return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`}
  function renderOverview(){const y=viewDate.getFullYear(),m=viewDate.getMonth();const monthTasks=data.tasks.filter(t=>{if(!hasValidRange(t))return false;const r=displayRange(t);return parse(r.start)<=new Date(y,m+1,0)&&parse(r.end)>=new Date(y,m,1)});const done=monthTasks.filter(t=>t.done).length;const pending=monthTasks.filter(t=>!t.done&&!t.missed).length;$('totalTasks').textContent=monthTasks.length;$('doneTasks').textContent=done;$('pendingTasks').textContent=pending}
  function renderTaskList(){
    const y=viewDate.getFullYear(),m=viewDate.getMonth(),begin=new Date(y,m,1),end=new Date(y,m+1,0);
    let list=data.tasks.filter(t=>{if(!hasValidRange(t)||!matchesTask(t))return false;const r=displayRange(t);return parse(r.start)<=end&&parse(r.end)>=begin});
    if(activeFilter==='pending')list=list.filter(t=>!t.done&&!t.missed);
    if(activeFilter==='done')list=list.filter(t=>t.done);
    if(activeFilter==='missed')list=list.filter(t=>t.missed);
    list.sort((a,b)=>Number(!!b.important)-Number(!!a.important)||displayRange(a).start.localeCompare(displayRange(b).start));
    $('taskCountLabel').textContent=lang==='en'?`${list.length} tasks`:`${list.length} 项`;
    $('taskList').innerHTML='';
    if(!list.length){const p=document.createElement('div');p.className='helper';p.textContent=tr('暂无匹配日程。点击日历日期快速添加。','No matching tasks. Click a date to add one.');$('taskList').append(p);return}
    list.forEach(task=>{
      const c=cat(task.category),r=displayRange(task),row=document.createElement('div');row.className='task-item'+(task.missed?' is-missed':'');
      const cb=document.createElement('input');cb.type='checkbox';cb.checked=!!task.done;cb.setAttribute('aria-label',tr('标记完成','Mark as completed'));
      cb.addEventListener('change',()=>changeStatus(task.id,'done'));
      const body=document.createElement('div');const name=document.createElement('div');name.className='task-name'+(task.done?' done':'')+(task.missed?' missed':'');name.textContent=(task.important?'⭐ ':'')+task.title;
      const meta=document.createElement('div');meta.className='task-meta';
      meta.textContent=`${task.start===task.end?task.start:task.start+' — '+task.end} · ${c.name}${task.repeatGroupId?' · ↻ '+recurrenceLabel(task.repeatRule):''}`;
      body.append(name,meta);
      if(task.missed||r.carry){const status=document.createElement('span');status.className='status-label '+(task.missed?'missed':'carried');status.textContent=task.missed?tr('未完成','Missed'):tr('已顺延到今天','Carried to today');body.append(status)}
      const actions=document.createElement('div');actions.className='task-actions';
      const star=document.createElement('button');star.type='button';star.className='mini-btn star-action'+(task.important?' active':'');star.textContent=task.important?'★':'☆';star.title=task.important?tr('取消重要标记','Unmark important'):tr('标记为重要任务','Mark important');star.setAttribute('aria-label',star.title);star.setAttribute('aria-pressed',String(!!task.important));star.onclick=()=>changeStatus(task.id,'important');
      const missed=document.createElement('button');missed.type='button';missed.className='mini-btn missed-action'+(task.missed?' active':'');missed.textContent='!';missed.title=task.missed?tr('取消未完成标记','Unmark missed'):tr('标记未完成（留在原日期）','Mark missed (keep original date)');missed.setAttribute('aria-label',missed.title);missed.onclick=()=>changeStatus(task.id,'missed');
      const edit=document.createElement('button');edit.type='button';edit.className='mini-btn';edit.textContent='✎';edit.title=tr('编辑','Edit');edit.onclick=()=>openTask(task.id);
      actions.append(star,missed,edit);row.append(cb,body,actions);$('taskList').append(row);
    });
  }
  function renderCategories(){
    const list=$('categoryList');list.innerHTML='';
    const allRow=document.createElement('div');allRow.className='category-row'+(activeCategory==='all'?' selected':'');
    const allButton=document.createElement('button');allButton.type='button';allButton.className='category-select';allButton.innerHTML=`<span class="project-dot all-dot">✦</span><span class="cat-name">${tr('全部任务','All tasks')}</span><span class="category-count">${data.tasks.length}</span>`;
    allButton.onclick=()=>{activeCategory='all';render()};allRow.append(allButton);list.append(allRow);
    data.categories.forEach(c=>{
      const row=document.createElement('div');row.className='category-row'+(activeCategory===c.id?' selected':'');
      const left=document.createElement('button');left.type='button';left.className='category-select';
      const sw=document.createElement('span');sw.className='project-dot';sw.style.background=c.color;
      const name=document.createElement('span');name.className='cat-name';name.textContent=c.name;
      const count=document.createElement('span');count.className='category-count';count.textContent=data.tasks.filter(t=>t.category===c.id).length;
      left.append(sw,name,count);left.onclick=()=>{activeCategory=activeCategory===c.id?'all':c.id;render()};
      const actions=document.createElement('div');actions.className='category-actions';
      const edit=document.createElement('button');edit.className='mini-btn';edit.textContent='···';edit.title=tr('编辑分类','Edit category');edit.onclick=()=>openCategory(c.id);
      actions.append(edit);row.append(left,actions);list.append(row);
    });
    const select=$('taskCategory');const old=select.value;select.innerHTML='';data.categories.forEach(c=>{const o=document.createElement('option');o.value=c.id;o.textContent=c.name;select.append(o)});if(data.categories.some(c=>c.id===old))select.value=old;
  }
  function render(){renderCalendar();renderOverview();renderTaskList();renderCategories();renderLegend();if($('reminderModalBackdrop')?.classList.contains('open'))drawReminderPreview();$('filterButton').textContent=tr('筛选：','Filter: ')+(activeCategory==='all'?tr('全部','All'):cat(activeCategory).name)}
  function renderLegend(){const el=$('calendarLegend');el.innerHTML='';data.categories.slice(0,5).forEach(c=>{const item=document.createElement('span');item.className='legend-item';const dot=document.createElement('i');dot.className='legend-dot';dot.style.background=c.color;const label=document.createElement('span');label.textContent=c.name;item.append(dot,label);el.append(item)})}
  // V1.5: one unified task form. Recurring mode is opt-in and uses the same title,
  // category and date inputs as a one-off task, without a second create dialog.
  function updateRepeatModeUI(){
    const isEditingOccurrence=!!(editingTask&&data.tasks.find(t=>t.id===editingTask)?.repeatGroupId);
    const repeating=!isEditingOccurrence&&$('taskRepeatToggle').checked;
    $('repeatTaskSwitchRow').hidden=isEditingOccurrence;
    $('repeatEditNote').hidden=!isEditingOccurrence;
    $('taskRepeatOptions').hidden=!repeating;
    $('repeatInterval').disabled=!repeating;
    $('taskEndLabel').textContent=repeating?tr('重复截止日期','Repeat until'):tr('结束日期','End date');
    $('taskRangeHelp').textContent=repeating
      ?tr('此处的结束日期是重复截止日；将按所选周期创建各次独立日程。','The end date is the recurrence limit. Each occurrence becomes its own task.')
      :tr('选择日期区间后，日程会在日历中连续显示，跨周和跨月自动延续。','Select a date range to show a continuous calendar event across weeks and months.');
    if(repeating)updateRepeatWeekdayVisibility();
  }
  function openTask(id=null, selectedDate=null){
    editingTask=id;
    const t=id?data.tasks.find(x=>x.id===id):null;
    $('taskModalTitle').textContent=t?tr('编辑任务','Edit task'):tr('新建任务','New task');
    $('taskTitle').value=t?.title||'';
    $('taskStart').value=t?.start||selectedDate||iso(viewDate.getFullYear()===today.getFullYear()&&viewDate.getMonth()===today.getMonth()?today:new Date(viewDate.getFullYear(),viewDate.getMonth(),1));
    $('taskEnd').value=t?.end||$('taskStart').value;
    $('deleteTask').hidden=!t;
    $('taskDone').checked=!!t?.done;
    $('taskMissed').checked=!!t?.missed;
    $('taskImportant').checked=!!t?.important;
    renderCategories();
    $('taskCategory').value=t?.category||(activeCategory!=='all'?activeCategory:data.categories[0]?.id)||'';
    $('taskRepeatToggle').checked=false;
    $('repeatUnit').value='day';
    $('repeatInterval').value='1';
    $('repeatWeekdays').dataset.touched='';
    setDefaultRepeatWeekday();
    updateRepeatModeUI();
    openModal('taskModalBackdrop');
    setTimeout(()=>$('taskTitle').focus(),50);
  }
  $('taskDone').addEventListener('change',()=>{if($('taskDone').checked)$('taskMissed').checked=false});
  $('taskMissed').addEventListener('change',()=>{if($('taskMissed').checked)$('taskDone').checked=false});
  $('taskRepeatToggle').addEventListener('change',()=>{
    if($('taskRepeatToggle').checked){
      // Give a new daily habit a useful 30-day default without overwriting a
      // meaningful date range the user already selected.
      if($('taskEnd').value===$('taskStart').value){
        const until=parse($('taskStart').value);
        if(!Number.isNaN(until.getTime())){until.setDate(until.getDate()+30);$('taskEnd').value=iso(until)}
      }
      if(!selectedRepeatWeekdays().length)setDefaultRepeatWeekday();
    }
    updateRepeatModeUI();
  });
  $('taskForm').addEventListener('submit',async e=>{
    e.preventDefault();
    const title=$('taskTitle').value.trim(),start=$('taskStart').value,end=$('taskEnd').value,category=$('taskCategory').value,done=$('taskDone').checked,missed=$('taskMissed').checked&&!done,important=$('taskImportant').checked;
    if(!title||!start||!end){showToast(tr('请填写任务名称和日期','Enter a title and dates'));return}
    if(end<start){showToast(tr('结束日期不能早于开始日期','End date cannot be before start date'));return}
    const existing=editingTask?data.tasks.find(t=>t.id===editingTask):null;
    const repeating=!existing?.repeatGroupId&&$('taskRepeatToggle').checked;
    let created=0;
    if(repeating){
      const unit=$('repeatUnit').value,interval=Number($('repeatInterval').value);
      if(!Number.isInteger(interval)||interval<1||interval>365){showToast(tr('重复间隔需为 1–365 的整数','Interval must be an integer from 1 to 365'));return}
      const weekdays=unit==='week'?selectedRepeatWeekdays():[];
      if(unit==='week'&&!weekdays.length){showToast(tr('请至少选择一个重复星期','Select at least one weekday'));return}
      const dates=generateRecurrenceDates(start,end,unit,interval,weekdays);
      if(!dates.length){showToast(tr('当前规则没有生成任何日程','This rule creates no occurrences'));return}
      if(dates.length>1000){showToast(tr('单次最多创建 1,000 项重复日程，请缩短跨度或调整间隔','Maximum 1,000 occurrences per series. Shorten the range or increase the interval.'));return}
      const groupId=crypto.randomUUID?crypto.randomUUID():`repeat-${Date.now()}`;
      const rule={unit,interval,weekdays,rangeStart:start,rangeEnd:end};
      dates.forEach((date,index)=>{
        const payload={title,start:date,end:date,category,done:done&&index===0,missed:missed&&index===0,important,repeatGroupId:groupId,repeatRule:rule};
        if(index===0&&existing)Object.assign(existing,payload);
        else data.tasks.push({id:crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random()}`, ...payload});
      });
      created=dates.length;
    }else if(existing){
      // Editing an existing recurrence only affects this occurrence; its
      // repeatGroupId and repeatRule are preserved, never duplicated.
      Object.assign(existing,{title,start,end,category,done,missed,important});
    }else{
      data.tasks.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),title,start,end,category,done,missed,important});
    }
    await save();closeModal('taskModalBackdrop');render();
    showToast(repeating?tr(`已创建 ${created} 项重复日程`,`Created ${created} recurring events`):tr('任务已保存','Task saved'));
  });
  $('deleteTask').addEventListener('click',()=>{if(!editingTask)return;data.tasks=data.tasks.filter(t=>t.id!==editingTask);save();closeModal('taskModalBackdrop');render();showToast(tr('任务已删除','Task deleted'))});
  // V1.3 recurring schedules: occurrences are stored as ordinary one-day tasks,
  // with shared metadata so each occurrence can be managed independently.
  const dateSerial=d=>Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000);
  function generateRecurrenceDates(startValue,endValue,unit,interval,weekdays=[]){
    const start=parse(startValue),end=parse(endValue);if(Number.isNaN(start.getTime())||Number.isNaN(end.getTime())||end<start)return [];
    interval=Math.max(1,Math.min(365,Math.floor(Number(interval)||1)));
    const out=[];
    if(unit==='day'){
      for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1))if((dateSerial(d)-dateSerial(start))%interval===0)out.push(iso(d));
    }else if(unit==='week'){
      const selected=weekdays.length?weekdays:[start.getDay()];
      const weekStart=new Date(start);weekStart.setDate(weekStart.getDate()-weekStart.getDay());
      for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1)){
        const weekIndex=Math.floor((dateSerial(d)-dateSerial(weekStart))/7);
        if(weekIndex%interval===0&&selected.includes(d.getDay()))out.push(iso(d));
      }
    }else if(unit==='month'){
      const startMonth=start.getFullYear()*12+start.getMonth(),endMonth=end.getFullYear()*12+end.getMonth();
      for(let month=startMonth;month<=endMonth;month+=interval){
        const y=Math.floor(month/12),m=month%12,day=Math.min(start.getDate(),new Date(y,m+1,0).getDate()),d=new Date(y,m,day);
        if(d>=start&&d<=end)out.push(iso(d));
      }
    }
    return out;
  }
  function recurrenceLabel(rule){
    if(!rule)return '';
    const unit=rule.unit||'day',n=Number(rule.interval)||1;
    if(lang==='en')return `every ${n} ${unit}${n===1?'':'s'}`;
    return `每${n===1?'':n}${unit==='day'?'天':unit==='week'?'周':'月'}`;
  }
  function selectedRepeatWeekdays(){return [...document.querySelectorAll('[data-weekday]:checked')].map(x=>Number(x.value))}
  function setDefaultRepeatWeekday(){
    const fromStart=parse($('taskStart').value),d=Number.isNaN(fromStart.getTime())?today:fromStart;
    document.querySelectorAll('[data-weekday]').forEach(x=>x.checked=Number(x.value)===d.getDay());
  }
  function updateRepeatWeekdayVisibility(){
    const weekly=$('repeatUnit').value==='week';
    $('repeatWeekdayField').hidden=!weekly;
    const u=$('repeatUnit').value;
    $('repeatUnitSuffix').textContent=u==='week'?tr('周','week(s)'):u==='month'?tr('月','month(s)'):tr('天','day(s)');
    updateRepeatPreview();
  }
  function updateRepeatPreview(){
    if(!$('taskRepeatToggle').checked||$('taskRepeatOptions').hidden)return;
    const start=$('taskStart').value,end=$('taskEnd').value,unit=$('repeatUnit').value,interval=Number($('repeatInterval').value);
    if(!start||!end||end<start){$('repeatPreview').textContent=tr('请选择有效的日期跨度。','Choose a valid date range.');$('repeatPreview').classList.add('warning');return}
    if(!Number.isInteger(interval)||interval<1||interval>365){$('repeatPreview').textContent=tr('请输入 1–365 的重复间隔。','Enter a repeat interval from 1 to 365.');$('repeatPreview').classList.add('warning');return}
    const dates=generateRecurrenceDates(start,end,unit,interval,selectedRepeatWeekdays());
    $('repeatPreview').textContent=tr(`预计生成 ${dates.length} 项日程。`,`This will create ${dates.length} events.`);
    $('repeatPreview').classList.toggle('warning',dates.length>1000||!dates.length);
  }
  $('repeatUnit').addEventListener('change',()=>{
    if($('repeatUnit').value==='week'&&!selectedRepeatWeekdays().length)setDefaultRepeatWeekday();
    updateRepeatWeekdayVisibility();
  });
  $('repeatInterval').addEventListener('input',updateRepeatPreview);
  document.querySelectorAll('[data-weekday]').forEach(x=>x.addEventListener('change',()=>{$('repeatWeekdays').dataset.touched='1';updateRepeatPreview()}));
  // Minimal XLSX reader using browser-native ZIP decompression; no network or third-party CDN.
  async function unzipXlsxEntries(arrayBuffer){
    const bytes=new Uint8Array(arrayBuffer),view=new DataView(arrayBuffer);let eocd=-1;
    for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--){if(view.getUint32(i,true)===0x06054b50){eocd=i;break}}
    if(eocd<0)throw new Error(tr('无法识别 XLSX 文件结构','Invalid XLSX archive'));
    const count=view.getUint16(eocd+10,true),centralOffset=view.getUint32(eocd+16,true),entries=new Map();let pos=centralOffset;
    for(let n=0;n<count;n++){
      if(view.getUint32(pos,true)!==0x02014b50)throw new Error(tr('Excel 压缩目录损坏','Corrupt XLSX directory'));
      const method=view.getUint16(pos+10,true),compressedSize=view.getUint32(pos+20,true),nameLen=view.getUint16(pos+28,true),extraLen=view.getUint16(pos+30,true),commentLen=view.getUint16(pos+32,true),localOffset=view.getUint32(pos+42,true);
      const name=new TextDecoder().decode(bytes.slice(pos+46,pos+46+nameLen));pos+=46+nameLen+extraLen+commentLen;
      if(!name.endsWith('.xml'))continue;
      if(view.getUint32(localOffset,true)!==0x04034b50)throw new Error(tr('Excel 工作表数据损坏','Corrupt XLSX worksheet'));
      const localNameLen=view.getUint16(localOffset+26,true),localExtraLen=view.getUint16(localOffset+28,true),dataStart=localOffset+30+localNameLen+localExtraLen,compressed=bytes.slice(dataStart,dataStart+compressedSize);
      let raw;
      if(method===0)raw=compressed;
      else if(method===8){if(typeof DecompressionStream==='undefined')throw new Error(tr('当前 Edge 不支持 XLSX 解压，请更新浏览器','This Edge version cannot decompress XLSX. Please update Edge.'));const stream=new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate-raw'));raw=new Uint8Array(await new Response(stream).arrayBuffer())}
      else continue;
      entries.set(name,new TextDecoder('utf-8').decode(raw));
    }
    return entries;
  }
  function xmlDoc(text){const doc=new DOMParser().parseFromString(text,'application/xml');if(doc.getElementsByTagName('parsererror').length)throw new Error(tr('Excel XML 解析失败','Unable to parse XLSX XML'));return doc}
  function excelColIndex(ref){const letters=(String(ref).match(/^[A-Z]+/i)||['A'])[0].toUpperCase();let n=0;for(const c of letters)n=n*26+c.charCodeAt(0)-64;return n-1}
  async function readXlsxRows(file){
    const entries=await unzipXlsxEntries(await file.arrayBuffer());const sheetText=entries.get('xl/worksheets/sheet1.xml');if(!sheetText)throw new Error(tr('未找到 Tasks 工作表。请使用 Taskhub 固定模板，并将 Tasks 放在第一个工作表。','Tasks sheet not found. Use the Taskhub template and keep Tasks as the first sheet.'));
    const shared=[];if(entries.has('xl/sharedStrings.xml')){const sd=xmlDoc(entries.get('xl/sharedStrings.xml'));[...sd.getElementsByTagNameNS('*','si')].forEach(si=>shared.push([...si.getElementsByTagNameNS('*','t')].map(t=>t.textContent).join('')))}
    const doc=xmlDoc(sheetText),rows=[...doc.getElementsByTagNameNS('*','row')].map(row=>{
      const values=[];[...row.getElementsByTagNameNS('*','c')].forEach(cell=>{const idx=excelColIndex(cell.getAttribute('r'));const type=cell.getAttribute('t');let value='';
        if(type==='inlineStr')value=[...cell.getElementsByTagNameNS('*','t')].map(t=>t.textContent).join('');
        else{const v=cell.getElementsByTagNameNS('*','v')[0];value=v?v.textContent:'';if(type==='s')value=shared[Number(value)]??'';}
        values[idx]=value;
      });return values;
    });
    return rows;
  }
  function excelDateToISO(value){
    if(value instanceof Date)return iso(value);
    const s=String(value??'').trim();if(!s)return null;
    const m=s.match(/^(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})日?$/);if(m){const y=Number(m[1]),mo=Number(m[2]),day=Number(m[3]),d=new Date(y,mo-1,day);if(d.getFullYear()!==y||d.getMonth()!==mo-1||d.getDate()!==day)return null;return iso(d)}
    if(/^\d+(?:\.\d+)?$/.test(s)){const serial=Math.floor(Number(s));if(serial>0&&serial<2958466){const d=new Date(Date.UTC(1899,11,30)+serial*86400000);return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`}}
    return null;
  }
  function parseRepeatUnit(value){const s=String(value??'').trim().toLowerCase();if(!s||['none','no','false','不重复','无','否'].includes(s))return 'none';if(['day','daily','days','每天','每日','日'].includes(s))return 'day';if(['week','weekly','weeks','每周','周'].includes(s))return 'week';if(['month','monthly','months','每月','月'].includes(s))return 'month';return null}
  function parseWeekdays(value,startDate){
    const s=String(value??'').trim();if(!s)return [parse(startDate).getDay()];
    const tokens=s.split(/[，,、;；\s]+/).filter(Boolean),map={sun:0,sunday:0,日:0,周日:0,星期日:0,mon:1,monday:1,一:1,周一:1,星期一:1,tue:2,tues:2,tuesday:2,二:2,周二:2,星期二:2,wed:3,wednesday:3,三:3,周三:3,星期三:3,thu:4,thur:4,thurs:4,thursday:4,四:4,周四:4,星期四:4,fri:5,friday:5,五:5,周五:5,星期五:5,sat:6,saturday:6,六:6,周六:6,星期六:6};
    const out=[];for(const token of tokens){const k=token.toLowerCase();if(Object.prototype.hasOwnProperty.call(map,k))out.push(map[k]);else if(/^[0-6]$/.test(k))out.push(Number(k));else throw new Error(tr(`无法识别星期：${token}`,`Unknown weekday: ${token}`))}return [...new Set(out)].sort();
  }
  function parseCompleted(value){return ['true','yes','1','是','已完成','done','completed'].includes(String(value??'').trim().toLowerCase())}
  let importPreview=null;
  function openExcelImport(){importPreview=null;$('excelFile').value='';$('excelFileName').textContent='';$('excelImportPreview').hidden=true;$('excelImportSummary').textContent='';$('excelImportErrors').innerHTML='';$('commitExcelImport').disabled=true;openModal('excelImportModalBackdrop')}
  $('excelImportTop').addEventListener('click',openExcelImport);
  $('chooseExcelFile').addEventListener('click',()=>$('excelFile').click());
  $('excelFile').addEventListener('change',async e=>{
    const file=e.target.files?.[0];if(!file)return;$('excelFileName').textContent=file.name;$('excelImportPreview').hidden=false;$('excelImportSummary').textContent=tr('正在解析 Excel…','Parsing Excel…');$('excelImportErrors').innerHTML='';$('commitExcelImport').disabled=true;importPreview=null;
    try{
      if(!file.name.toLowerCase().endsWith('.xlsx'))throw new Error(tr('目前仅支持 .xlsx 文件，请使用模板另存为 .xlsx。','Only .xlsx files are supported. Save the template as .xlsx.'));
      if(file.size>10*1024*1024)throw new Error(tr('文件不能超过 10 MB','Maximum file size: 10 MB'));
      const rows=await readXlsxRows(file);if(rows.length<2)throw new Error(tr('工作表中没有日程数据','No task rows found'));
      const headers=rows[0].map(x=>String(x??'').trim().toLowerCase());
      const findCol=pred=>headers.findIndex(h=>pred.some(p=>h.includes(p)));
      const col={title:findCol(['taskname','任务名称']),start:findCol(['startdate','开始日期']),end:findCol(['enddate','结束日期']),category:findCol(['category','分类名称']),completed:findCol(['completed','已完成']),unit:findCol(['repeatunit','重复周期']),interval:findCol(['repeatinterval','重复间隔']),weekdays:findCol(['weekdays','星期'])};
      if(col.title<0||col.start<0||col.end<0)throw new Error(tr('表头缺少必填列：任务名称、开始日期、结束日期。请勿修改模板表头。','Required headers missing: Task Name, Start Date, End Date. Do not change the template headers.'));
      const plannedCats=[],catMap=new Map(data.categories.map(c=>[c.name.trim().toLowerCase(),c.id]));let newCatIndex=0,expanded=0,skipped=0;const plannedTasks=[],errors=[];const seen=new Set(data.tasks.map(t=>`${t.title}\u0000${t.start}\u0000${t.end}\u0000${t.category}`));
      const cell=(r,k)=>col[k]>=0?String(r[col[k]]??'').trim():'';
      for(let i=1;i<rows.length;i++){
        const r=rows[i]||[];if(!r.some(v=>String(v??'').trim()!==''))continue;const rowNo=i+1;
        try{
          const title=cell(r,'title'),start=excelDateToISO(cell(r,'start')),end=excelDateToISO(cell(r,'end'));
          if(!title)throw new Error(tr('缺少任务名称','Missing task name'));if(!start||!end)throw new Error(tr('开始日期或结束日期无效','Invalid start or end date'));if(end<start)throw new Error(tr('结束日期早于开始日期','End date is before start date'));
          const categoryName=cell(r,'category');let category=data.categories[0]?.id;
          if(categoryName){const key=categoryName.toLowerCase();if(catMap.has(key))category=catMap.get(key);else{let c=plannedCats.find(x=>x.name.toLowerCase()===key);if(!c){const color=presetColors[(data.categories.length+newCatIndex)%presetColors.length];c={id:crypto.randomUUID?crypto.randomUUID():`xlsx-cat-${Date.now()}-${newCatIndex}`,name:categoryName,color};plannedCats.push(c);catMap.set(key,c.id);newCatIndex++}category=c.id}}
          const unit=parseRepeatUnit(cell(r,'unit'));if(unit===null)throw new Error(tr('重复周期仅支持 none/day/week/month','Repeat Unit must be none, day, week, or month'));
          const intervalRaw=cell(r,'interval'),interval=intervalRaw?Number(intervalRaw):1;if(!Number.isInteger(interval)||interval<1||interval>365)throw new Error(tr('重复间隔需为 1–365 的整数','Repeat Interval must be an integer from 1 to 365'));
          const done=parseCompleted(cell(r,'completed'));
          if(unit==='none'){
            const key=`${title}\u0000${start}\u0000${end}\u0000${category}`;if(seen.has(key)){skipped++;continue}seen.add(key);plannedTasks.push({id:crypto.randomUUID?crypto.randomUUID():`xlsx-${Date.now()}-${plannedTasks.length}`,title,start,end,category,done});expanded++;
          }else{
            const weekdays=unit==='week'?parseWeekdays(cell(r,'weekdays'),start):[];const dates=generateRecurrenceDates(start,end,unit,interval,weekdays);if(!dates.length)throw new Error(tr('该重复规则没有生成任何日期','This recurrence rule generated no dates'));
            if(dates.length>1000)throw new Error(tr('单行重复规则超过 1,000 次，请缩短日期跨度或增加间隔','This row exceeds 1,000 occurrences; shorten the range or increase the interval'));
            const groupId=crypto.randomUUID?crypto.randomUUID():`xlsx-repeat-${Date.now()}-${i}`,rule={unit,interval,weekdays,rangeStart:start,rangeEnd:end};
            for(const date of dates){const key=`${title}\u0000${date}\u0000${date}\u0000${category}`;if(seen.has(key)){skipped++;continue}seen.add(key);plannedTasks.push({id:crypto.randomUUID?crypto.randomUUID():`xlsx-${Date.now()}-${plannedTasks.length}`,title,start:date,end:date,category,done,repeatGroupId:groupId,repeatRule:rule});expanded++}
          }
          if(plannedTasks.length>2000)throw new Error(tr('单次导入最多生成 2,000 项日程','Maximum 2,000 events per import'));
        }catch(err){errors.push(`${tr('第','Row ')}${rowNo}${tr('行：',' : ')}${err.message}`)}
      }
      if(!expanded&&!errors.length){
        importPreview={tasks:[],categories:[],errors:[],skipped,expanded:0};
        $('excelImportSummary').textContent=tr(`没有新增日程；${skipped} 项记录已存在，因此已自动跳过。`,`No new events added; ${skipped} existing record(s) were skipped.`);
        $('commitExcelImport').disabled=true;
        return;
      }
      importPreview={tasks:plannedTasks,categories:plannedCats,errors,skipped,expanded};
      $('excelImportSummary').textContent=tr(`识别到 ${expanded} 项新日程、${plannedCats.length} 个待创建分类，跳过 ${skipped} 项重复记录。`,`Found ${expanded} new events, ${plannedCats.length} new categories; skipped ${skipped} duplicates.`);
      if(errors.length){errors.slice(0,12).forEach(msg=>{const li=document.createElement('li');li.textContent=msg;$('excelImportErrors').append(li)});if(errors.length>12){const li=document.createElement('li');li.textContent=tr(`另有 ${errors.length-12} 条错误未显示。`,`And ${errors.length-12} more errors.`);$('excelImportErrors').append(li)}$('excelImportSummary').textContent+=tr(` 存在 ${errors.length} 行错误，请修正模板后重新选择文件。`,` ${errors.length} row(s) contain errors. Fix them and reselect the file.`)}
      $('commitExcelImport').disabled=errors.length>0||!plannedTasks.length;
    }catch(err){$('excelImportSummary').textContent=tr('无法导入：','Import failed: ')+err.message;$('excelImportErrors').innerHTML='';importPreview=null}
  });
  $('commitExcelImport').addEventListener('click',async()=>{
    if(!importPreview||!importPreview.tasks.length||importPreview.errors.length)return;
    data.categories.push(...importPreview.categories);data.tasks.push(...importPreview.tasks);const n=importPreview.tasks.length;await save();closeModal('excelImportModalBackdrop');render();showToast(tr(`成功导入 ${n} 项日程`,`Imported ${n} events successfully`));importPreview=null;
  });

  // V1.2 palette: selection is visual-only until the category form is saved.
  // Persist the same six-digit hex `color` field for compatibility with V1.0/V1.1.
  const presetColors=['#FF565E','#FF8A34','#FFC83D','#A8D92D','#35C878','#19B8B1','#29A8F2','#436BFA','#8A5CF5','#C65BEF','#F062AB','#EE6B5A'];
  let selectedCategoryColor='#7896b8';
  function chooseCategoryColor(color){
    selectedCategoryColor=color.toLowerCase();
    $('categoryColor').value=selectedCategoryColor;
    $('customColorDot').style.background=selectedCategoryColor;
    $('customColorHex').textContent=selectedCategoryColor.toUpperCase();
    [...$('colorPalette').children].forEach(button=>{
      const active=button.dataset.color.toLowerCase()===selectedCategoryColor;
      button.classList.toggle('selected',active);
      button.setAttribute('aria-pressed',String(active));
    });
    $('customColorTrigger').classList.toggle('selected',!presetColors.some(c=>c.toLowerCase()===selectedCategoryColor));
  }
  presetColors.forEach(color=>{
    const button=document.createElement('button');button.type='button';button.className='palette-swatch';
    button.dataset.color=color;button.style.background=color;button.title=color;
    button.setAttribute('aria-label',color);button.setAttribute('aria-pressed','false');
    button.addEventListener('click',()=>chooseCategoryColor(color));$('colorPalette').append(button);
  });
  $('customColorTrigger').addEventListener('click',()=>$('categoryColor').click());
  $('categoryColor').addEventListener('input',e=>chooseCategoryColor(e.target.value));
  function openCategory(id=null){editingCategory=id;const c=id?cat(id):null;$('categoryModalTitle').textContent=c?tr('编辑分类','Edit category'):tr('添加分类','Add category');$('categoryName').value=c?.name||'';chooseCategoryColor(c?.color||presetColors[7]);$('deleteCategory').hidden=!c;openModal('categoryModalBackdrop');setTimeout(()=>$('categoryName').focus(),50)}
  $('categoryForm').addEventListener('submit',e=>{e.preventDefault();const name=$('categoryName').value.trim(),color=selectedCategoryColor;if(!name)return;if(data.categories.some(c=>c.name.toLowerCase()===name.toLowerCase()&&c.id!==editingCategory)){showToast(tr('这个分类名称已经存在','Category name already exists'));return}if(editingCategory){Object.assign(data.categories.find(c=>c.id===editingCategory),{name,color})}else data.categories.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name,color});save();closeModal('categoryModalBackdrop');render();showToast(tr('分类已保存','Category saved'))});
  function removeCategory(id){if(data.categories.length<=1){showToast(tr('至少保留一个分类','Keep at least one category'));return false}const c=cat(id);if(!confirm(tr(`删除「${c.name}」分类？相关任务将转入第一个分类。`,`Delete category '${c.name}'? Its tasks will move to another category.`)))return false;const fallback=data.categories.find(x=>x.id!==id);data.tasks.forEach(t=>{if(t.category===id)t.category=fallback.id});data.categories=data.categories.filter(x=>x.id!==id);if(activeCategory===id)activeCategory='all';save();render();showToast(tr('分类已删除','Category deleted'));return true}
  $('deleteCategory').addEventListener('click',()=>{if(editingCategory&&removeCategory(editingCategory))closeModal('categoryModalBackdrop')});
  $('openSidebarButton').addEventListener('click',async()=>{
    try{
      // Side Panel API can only be called following a user gesture.
      const win=await chrome.windows.getCurrent();
      await chrome.sidePanel.open({windowId:win.id});
    }catch(err){console.warn('Could not open Edge side panel',err);showToast(tr('请点击扩展图标打开侧边栏','Click the extension icon to open its sidebar'))}
  });
  $('openWindowButton').addEventListener('click',async()=>{
    try{await chrome.runtime.sendMessage({type:'TASKHUB_OPEN_WINDOW'})}
    catch(err){console.error(err);showToast(tr('独立窗口打开失败','Could not open separate window'))}
  });
  $('addTaskTop').onclick=()=>openTask();$('mobileAdd').onclick=()=>openTask();$('addCategory').onclick=()=>openCategory();$('manageCatsTop').onclick=()=>showToast(tr("在左侧 PROJECTS 中点击分类旁的 ··· 可编辑分类，点击 ＋ 可新增分类。","In the left sidebar, use ··· to edit categories or + to add one."));$('filterButton').onclick=()=>{activeCategory='all';render();showToast(tr("已显示全部分类","Showing all categories"))};$('helpButton').onclick=()=>showToast(tr("点击 + New 创建任务，点击色条编辑任务；左侧分类可筛选日历。","Click New to create a task, click a day to add on that date, or click an event to edit it."));$('homeNav').onclick=()=>{activeCategory='all';document.querySelector('[data-view=calendar]').click();render()};$('myTasksNav').onclick=()=>{activeCategory='all';document.querySelector('[data-view=calendar]').click();render()};$('listNav').onclick=()=>document.querySelector('[data-view=list]').click();$('categoriesNav').onclick=()=>showToast(tr("在左侧 PROJECTS 中管理分类，点击分类可筛选任务。","Manage categories in the left sidebar. Click a category to filter tasks."));
  $('searchTasks').addEventListener('input',e=>{searchQuery=e.target.value.trim();render()});
  document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{const view=b.dataset.view;document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x===b));$('calendarView').hidden=view!=='calendar';$('listView').hidden=view!=='list';$('myTasksNav').classList.toggle('active',view==='calendar');$('listNav').classList.toggle('active',view==='list');if(view==='list')renderTaskList()}));
  $('prevMonth').onclick=()=>{viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()-1,1);render()};$('nextMonth').onclick=()=>{viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,1);render()};$('goToday').onclick=()=>{viewDate=new Date(today.getFullYear(),today.getMonth(),1);render()};
  $('taskFilters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;activeFilter=b.dataset.filter;document.querySelectorAll('.filter-chip').forEach(x=>x.classList.toggle('active',x===b));renderTaskList()});
  $('taskStart').addEventListener('change',()=>{if(!$('taskEnd').value||$('taskEnd').value<$('taskStart').value)$('taskEnd').value=$('taskStart').value;if(!$('repeatWeekdays').dataset.touched)setDefaultRepeatWeekday();updateRepeatPreview()});
  $('taskEnd').addEventListener('change',updateRepeatPreview);
  // Optional backup; not necessary during ordinary same-ID extension updates.

  // V1.4: globally scheduled daily reminders, independent of task editing.
  function reminderSummary(){
    const now=iso(new Date()),todays=[],overdue=[];
    for(const task of data.tasks){
      if(!hasValidRange(task))continue;
      const range=displayRange(task);
      if(range.start<=now&&range.end>=now)todays.push(task);
      else if(task.missed&&task.end<now)overdue.push(task);
    }
    return {date:now,todays,pending:todays.filter(t=>!t.done&&!t.missed),done:todays.filter(t=>t.done),overdue};
  }
  function nextReminderTime(time){
    const now=new Date(),[hour,minute]=time.split(':').map(Number);
    const candidate=new Date(now.getFullYear(),now.getMonth(),now.getDate(),hour,minute);
    if(candidate.getTime()<=now.getTime())candidate.setDate(candidate.getDate()+1);
    return candidate;
  }
  function drawReminderPreview(){
    const sum=reminderSummary();
    $('reminderDateLabel').textContent=sum.date;
    const el=$('reminderTodayPreview');el.innerHTML='';
    const stats=document.createElement('div');stats.className='reminder-mini-stat';
    [tr(`今日 ${sum.todays.length} 项`,`Today ${sum.todays.length}`),tr(`已完成 ${sum.done.length}`,`Done ${sum.done.length}`),tr(`待完成 ${sum.pending.length}`,`Pending ${sum.pending.length}`),tr(`逾期 ${sum.overdue.length}`,`Overdue ${sum.overdue.length}`)].forEach(str=>{
      const tag=document.createElement('span');tag.textContent=str;stats.append(tag);
    });el.append(stats);
    const pendingTasks=sum.pending.slice().sort((a,b)=>Number(!!b.important)-Number(!!a.important)).slice(0,5),overdueTasks=sum.overdue.slice(0,3);
    for(const item of pendingTasks){
      const line=document.createElement('div');line.className='reminder-task';
      const dot=document.createElement('i');dot.className='reminder-task-dot';
      const name=document.createElement('span');name.textContent=(item.important?'⭐ ':'')+item.title;line.append(dot,name);el.append(line);
    }
    for(const item of overdueTasks){
      const line=document.createElement('div');line.className='reminder-task overdue';
      const dot=document.createElement('i');dot.className='reminder-task-dot';
      const name=document.createElement('span');name.textContent=tr('逾期 · ','Overdue · ')+item.title;line.append(dot,name);el.append(line);
    }
    if(!pendingTasks.length&&!overdueTasks.length){const empty=document.createElement('div');empty.textContent=tr('目前没有未完成的日程。','Nothing outstanding right now.');el.append(empty)}
  }
  function drawReminderControls(){
    $('reminderEnabled').checked=reminderSettings.enabled;
    const area=$('reminderTimeChips');area.innerHTML='';
    reminderSettings.times.forEach(time=>{
      const chip=document.createElement('span');chip.className='reminder-chip';
      const label=document.createElement('span');label.textContent=time;
      const remove=document.createElement('button');remove.type='button';remove.textContent='×';remove.title=tr(`删除 ${time} 提醒`,`Remove ${time} reminder`);remove.setAttribute('aria-label',remove.title);
      remove.onclick=()=>{
        reminderSettings.times=reminderSettings.times.filter(t=>t!==time);
        if(!reminderSettings.times.length)reminderSettings.enabled=false;
        saveReminderSettings();drawReminderControls();
      };
      chip.append(label,remove);area.append(chip);
    });
    const status=$('reminderStatus');status.classList.toggle('off',!reminderSettings.enabled);status.classList.remove('error');
    if(reminderSettings.enabled&&reminderSettings.times.length){
      const next=reminderSettings.times.map(time=>nextReminderTime(time)).sort((a,b)=>a-b)[0];
      const text=next.toLocaleString(lang==='en'?'en-US':'zh-CN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false});
      status.textContent=tr(`已开启 · 每天 ${reminderSettings.times.length} 次 · 下次预计 ${text}`,`On · ${reminderSettings.times.length} time(s) daily · Next around ${text}`);
    }else status.textContent=tr('提醒已关闭。开启后会按下方设置的时间发送系统通知。','Notifications are off. Enable to receive alerts at your chosen times.');
    drawReminderPreview();
  }
  function addReminderTime(time){
    if(!isReminderTime(time)){showToast(tr('请选择有效的提醒时间','Choose a valid time'));return}
    if(reminderSettings.times.includes(time)){showToast(tr('这个时间已添加','This time is already added'));return}
    if(reminderSettings.times.length>=12){showToast(tr('每天最多设置 12 次提醒','Maximum 12 reminders per day'));return}
    reminderSettings.times.push(time);reminderSettings.times.sort();
    saveReminderSettings();drawReminderControls();showToast(tr('提醒时间已添加','Reminder time added'));
  }
  function openReminderSettings(){drawReminderControls();openModal('reminderModalBackdrop')}
  $('reminderTop').onclick=openReminderSettings;
  $('openReminderFromSettings').onclick=()=>{closeModal('settingsModalBackdrop');openReminderSettings()};
  $('reminderEnabled').addEventListener('change',e=>{
    if(e.target.checked&&!reminderSettings.times.length){e.target.checked=false;showToast(tr('请先添加至少一个提醒时间','Add at least one reminder time first'));return}
    reminderSettings.enabled=e.target.checked;saveReminderSettings();drawReminderControls();
    showToast(reminderSettings.enabled?tr('已开启每日提醒','Daily reminders enabled'):tr('已关闭每日提醒','Daily reminders disabled'));
  });
  $('addReminderTime').onclick=()=>addReminderTime($('reminderTimeInput').value);
  document.querySelectorAll('.preset-time').forEach(btn=>btn.onclick=()=>addReminderTime(btn.dataset.time));
  $('testReminder').onclick=async()=>{
    const button=$('testReminder');button.disabled=true;
    try{
      await reminderSaveQueue;
      const result=await chrome.runtime.sendMessage({type:'TASKHUB_TEST_REMINDER'});
      if(!result?.ok)throw Error(result?.error||tr('通知未发出','Notification was not sent'));
      showToast(tr('已发送测试通知，请查看 Edge / 系统通知中心','Test sent. Check Edge / system notifications'));
      $('reminderStatus').classList.remove('off','error');
      $('reminderStatus').textContent=tr('测试通知已发送。如果没有弹窗，请检查系统通知权限与勿扰模式。','Test notification sent. If it is not visible, check system permissions and Do Not Disturb.');
    }catch(err){console.error('Taskhub notification test failed',err);$('reminderStatus').classList.add('error');$('reminderStatus').textContent=tr('测试失败：','Test failed: ')+String(err?.message||err);}
    finally{button.disabled=false}
  };

  $('settingsButton').addEventListener('click',()=>{
    $('storageStatus').textContent=lang==='en'?`Saved ${data.tasks.length} tasks and ${data.categories.length} categories. Updating the extension preserves them.`:`已保存 ${data.tasks.length} 项任务、${data.categories.length} 个分类。扩展更新不会自动清空它们。`;
    openModal('settingsModalBackdrop');
  });
  $('exportData').addEventListener('click',async()=>{
    await pendingSave;
    const payload={format:'taskhub-planner',schemaVersion:1,exportedAt:new Date().toISOString(),data};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;
    a.download=`Taskhub-backup-${iso(new Date())}.json`;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);showToast(tr("备份文件已下载","Backup downloaded"));
  });
  $('importData').addEventListener('click',()=>$('importFile').click());
  $('importFile').addEventListener('change',async e=>{
    const f=e.target.files?.[0];if(!f)return;
    try{
      if(f.size>5*1024*1024)throw Error(tr('文件不能超过 5 MB','Maximum file size: 5 MB'));
      const payload=JSON.parse(await f.text());
      const incoming=payload?.format==='taskhub-planner'?payload.data:payload;
      if(!incoming || !Array.isArray(incoming.tasks)|| !Array.isArray(incoming.categories))throw Error(tr('不是有效的 Taskhub 数据文件','Invalid Taskhub backup'));
      if(!incoming.categories.length)throw Error(tr('分类数据不能为空','Categories cannot be empty'));
      const validColor=x=>typeof x==='string'&&/^#[0-9a-fA-F]{6}$/.test(x);
      const validDate=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&!Number.isNaN(parse(x).getTime());
      if(incoming.categories.some(c=>typeof c.id!=='string'||typeof c.name!=='string'||!validColor(c.color)) ||
         incoming.tasks.some(t=>typeof t.id!=='string'||typeof t.title!=='string'||!validDate(t.start)||!validDate(t.end)||t.end<t.start||typeof t.category!=='string'))throw Error(tr('文件中的任务或分类格式不正确','Invalid task or category data'));
      if(!confirm(lang==='en'?`Replace your ${data.tasks.length} current tasks with ${incoming.tasks.length} tasks from the backup?`:`将用备份中的 ${incoming.tasks.length} 项任务替换当前 ${data.tasks.length} 项任务。是否继续？`))return;
      data={categories:incoming.categories,tasks:incoming.tasks};await save();
      activeCategory='all';closeModal('settingsModalBackdrop');render();showToast(tr("已成功恢复备份","Backup restored"));
    }catch(err){alert(tr('导入失败：','Import failed: ')+err.message)}finally{e.target.value=''}
  });
  // Side panel, main tab and popup window read the same extension storage.
  // Refresh when another view changes tasks; never persist translated content.
  chrome.storage.onChanged.addListener((changes,area)=>{
    if(area==='local'&&changes[storageKey]&&changes[storageKey].newValue){
      data=changes[storageKey].newValue;
      if(!Array.isArray(data.tasks))data.tasks=[];
      if(!Array.isArray(data.categories)||!data.categories.length)data.categories=structuredClone(defaultData.categories);
      render();
    }
  });
  setInterval(()=>{
    const now=new Date();now.setHours(0,0,0,0);
    if(iso(now)!==iso(today)){const oldMonth=viewDate.getFullYear()===today.getFullYear()&&viewDate.getMonth()===today.getMonth();today=now;if(oldMonth)viewDate=new Date(today.getFullYear(),today.getMonth(),1);render()}
  },60000);
  translateStatic();render();
  if(repairedTaskDates){save();showToast(lang==='en'?`${repairedTaskDates} legacy task date(s) were repaired and placed on today. Please review their dates.`:`已修复 ${repairedTaskDates} 项旧日程的日期格式，并暂时放在今天，请检查这些日程的日期。`);}
})();
