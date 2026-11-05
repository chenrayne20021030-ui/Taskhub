// Taskhub MV3 service worker · v1.4.0
// Uses one-shot alarms scheduled in the device's local time zone.
// Reminder preferences and existing tasks are stored under separate, stable keys.
const DATA_KEY = 'taskhubPlannerDataV1';
const REMINDER_KEY = 'taskhubReminderSettingsV1';
const ALARM_PREFIX = 'taskhub:daily:';
const NOTIFICATION_PREFIX = 'taskhub-notice:';

const isTime = s => typeof s==='string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
const defaultSettings = {enabled:false,times:['09:00','20:00']};
function normalizeSettings(raw) {
  const obj=raw&&typeof raw==='object'?raw:defaultSettings;
  const times=Array.isArray(obj.times)?[...new Set(obj.times.filter(isTime))].sort().slice(0,12):[...defaultSettings.times];
  return {enabled:obj.enabled===true,times};
}
function dateKey(d){
  const pad=n=>String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}
function taskDate(value) {
  if(typeof value!=='string')return null;
  const match=value.match(/^(\d{4})-(\d\d)-(\d\d)(?:$|T)/);
  if(!match)return null;
  const y=Number(match[1]),m=Number(match[2]),d=Number(match[3]);
  const v=new Date(y,m-1,d);
  return v.getFullYear()===y&&v.getMonth()===m-1&&v.getDate()===d?dateKey(v):null;
}
function nextOccurrence(time, now=new Date()) {
  const [hours, minutes]=time.split(':').map(Number);
  const next=new Date(now.getFullYear(),now.getMonth(),now.getDate(),hours,minutes,0,0);
  // Scheduling tomorrow if the minute has already begun avoids a notification on enabling.
  if(next.getTime()<=now.getTime()+1000)next.setDate(next.getDate()+1);
  return next.getTime();
}
async function openDashboard() {
  const page=chrome.runtime.getURL('index.html');
  const tabs=await chrome.tabs.query({url:page});
  if(tabs.length){
    await chrome.tabs.update(tabs[0].id,{active:true});
    await chrome.windows.update(tabs[0].windowId,{focused:true});
  }else await chrome.tabs.create({url:page});
}
// V1.6: toolbar icon opens the native Edge side panel.
// A context menu also offers the full dashboard / standalone window.
async function openStandaloneWindow(){
  const url=chrome.runtime.getURL('index.html');
  const windows=await chrome.windows.getAll({populate:true});
  const existing=windows.find(w=>w.type==='popup'&&w.tabs?.some(t=>t.url===url));
  if(existing){await chrome.windows.update(existing.id,{focused:true});return existing.id}
  const w=await chrome.windows.create({url,type:'popup',width:1180,height:800,focused:true});
  return w.id;
}
async function setupSidebar(){
  if(chrome.sidePanel?.setPanelBehavior)await chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:true});
}
function createContextMenus(){
  chrome.contextMenus.removeAll().then(()=>{
    chrome.contextMenus.create({id:'taskhub_tab',title:'Taskhub · 完整看板 / Dashboard',contexts:['action']});
    chrome.contextMenus.create({id:'taskhub_window',title:'Taskhub · 独立窗口 / Separate window',contexts:['action']});
  }).catch(console.error);
}
chrome.contextMenus.onClicked.addListener(info=>{
  if(info.menuItemId==='taskhub_tab')openDashboard().catch(console.error);
  if(info.menuItemId==='taskhub_window')openStandaloneWindow().catch(console.error);
});


let scheduleQueue=Promise.resolve();
async function synchronizeAlarms() {
  const result=await chrome.storage.local.get(REMINDER_KEY);
  const settings=normalizeSettings(result[REMINDER_KEY]);
  const existing=await chrome.alarms.getAll();
  // Only clear Taskhub alarms, never alarms belonging to other extension features.
  for(const alarm of existing)if(alarm.name.startsWith(ALARM_PREFIX))await chrome.alarms.clear(alarm.name);
  if(!settings.enabled)return;
  for(const time of settings.times)await chrome.alarms.create(ALARM_PREFIX+time,{when:nextOccurrence(time)});
}
function syncAlarms() {
  scheduleQueue=scheduleQueue.catch(()=>{}).then(synchronizeAlarms).catch(err=>console.error('Taskhub alarm schedule error',err));
  return scheduleQueue;
}
chrome.runtime.onInstalled.addListener(()=>{syncAlarms();setupSidebar().catch(console.error);createContextMenus()});
chrome.runtime.onStartup.addListener(()=>{syncAlarms();setupSidebar().catch(console.error)});
chrome.storage.onChanged.addListener((changes,area)=>{
  if(area==='local' && Object.prototype.hasOwnProperty.call(changes,REMINDER_KEY))syncAlarms();
});

function summarizeTasks(tasks,now=new Date()) {
  const today=dateKey(now);
  const all=Array.isArray(tasks)?tasks:[];
  const todays=[],missed=[];
  for(const t of all) {
    if(!t||typeof t!=='object')continue;
    const start=taskDate(t.start??t.startDate??t.date),end=taskDate(t.end??t.endDate??t.start??t.startDate??t.date);
    if(!start||!end)continue;
    // Unfinished tasks are displayed on today until completed or marked missed.
    const carried=!t.done&&!t.missed&&end<today;
    if(start<=today&&end>=today||carried)todays.push(t);
    else if(t.missed&&end<today)missed.push(t);
  }
  const pending=todays.filter(t=>!t.done&&!t.missed);
  return {today,total:todays.length,done:todays.filter(t=>t.done).length,pending,overdue:missed};
}
function truncate(text,n){const str=String(text||'Untitled').replace(/[\r\n\t]+/g,' ').trim();return str.length>n?str.slice(0,n-1)+'…':str;}
async function notifyTasks({test=false,expectedTime=null}={}) {
  const result=await chrome.storage.local.get([DATA_KEY,REMINDER_KEY,'taskhubLanguage']);
  const settings=normalizeSettings(result[REMINDER_KEY]);
  if(!test && (!settings.enabled||!settings.times.includes(expectedTime)))return {ok:true,skipped:true,reason:'disabled'};
  const lang=result.taskhubLanguage==='en'?'en':'zh';
  const sum=summarizeTasks(result[DATA_KEY]?.tasks);
  const waiting=sum.pending.length+sum.overdue.length;
  if(!test && waiting===0)return {ok:true,skipped:true,reason:'clear'};
  const zh=lang!=='en';
  let title=zh?`Taskhub · 今日待办 ${sum.pending.length} 项`:`Taskhub · ${sum.pending.length} pending today`;
  if(test)title=zh?'Taskhub · 测试提醒':'Taskhub · Test reminder';
  let message=(zh
    ? `今日 ${sum.total} 项 · 已完成 ${sum.done} 项 · 待完成 ${sum.pending.length} 项`
    : `Today ${sum.total} · Done ${sum.done} · Pending ${sum.pending.length}`);
  const pendingNames=sum.pending.slice().sort((a,b)=>Number(!!b.important)-Number(!!a.important)).slice(0,4).map(x=>truncate((x.important?'⭐ ':'')+x.title,24));
  const overdueNames=sum.overdue.slice(0,3).map(x=>truncate(x.title,24));
  if(pendingNames.length)message+='\n'+(zh?'今日未完成：':'Still to do: ')+pendingNames.join(zh?'、':', ')+(sum.pending.length>4?` +${sum.pending.length-4}`:'');
  if(overdueNames.length)message+='\n'+(zh?`逾期 ${sum.overdue.length} 项：`:`${sum.overdue.length} overdue: `)+overdueNames.join(zh?'、':', ')+(sum.overdue.length>3?` +${sum.overdue.length-3}`:'');
  if(!waiting)message+='\n'+(zh?'目前没有未完成事项。':'All caught up!');
  const permission=await chrome.notifications.getPermissionLevel();
  if(permission==='denied')return {ok:false,error:zh?'Edge 或系统已禁止扩展通知':'Notifications are blocked by Edge or the system'};
  const id=NOTIFICATION_PREFIX+Date.now()+'-'+Math.floor(Math.random()*100000);
  await chrome.notifications.create(id,{
    type:'basic',iconUrl:'icons/icon128.png',title,message,priority:2,
    contextMessage:zh?'点击通知打开 Taskhub':'Click to open Taskhub'
  });
  return {ok:true,waiting,today:sum.total,pending:sum.pending.length,overdue:sum.overdue.length};
}
chrome.alarms.onAlarm.addListener(alarm=>{
  if(!alarm.name.startsWith(ALARM_PREFIX))return;
  const time=alarm.name.slice(ALARM_PREFIX.length);
  (async()=>{
    // Do not produce a stale notification hours after a laptop wakes from sleep.
    if(Date.now()-alarm.scheduledTime<=30*60*1000)await notifyTasks({expectedTime:time});
  })().catch(err=>console.error('Taskhub reminder failed',err)).finally(()=>{syncAlarms()});
});
chrome.notifications.onClicked.addListener(id=>{
  if(!id.startsWith(NOTIFICATION_PREFIX))return;
  openDashboard().catch(console.error);
  chrome.notifications.clear(id).catch(()=>{});
});
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
  if(message?.type==='TASKHUB_OPEN_WINDOW'){
    openStandaloneWindow().then(windowId=>sendResponse({ok:true,windowId})).catch(err=>sendResponse({ok:false,error:String(err)}));
    return true;
  }
  if(message?.type==='TASKHUB_OPEN_TAB'){
    openDashboard().then(()=>sendResponse({ok:true})).catch(err=>sendResponse({ok:false,error:String(err)}));
    return true;
  }
  if(message?.type!=='TASKHUB_TEST_REMINDER')return false;
  notifyTasks({test:true}).then(sendResponse).catch(err=>sendResponse({ok:false,error:String(err?.message||err)}));
  return true;
});
// Alarms can disappear on browser restart/extension update. Recheck at worker start.
syncAlarms();

setupSidebar().catch(console.error);
