(function () {
  const root = document.querySelector('#push-demo');
  const channels = DATA.filter(r => r.cat === 'content');
  const schedule = { silicon:545, hn:555, podcast:565, roast:1390, funding:1400,
    like1:850, like2:860, like3:875, like4:910, like5:965, like6:1395, gap1:1410, gap2:1420 };
  let scenario = 'flow', now = 1920;
  const cfg = { push:true, permission:true, likes:true, alerts:true, aggregate:true, quiet:true, cap:true,
    delivery:'instant', channels:new Set(channels.map(r=>r.id)),
    seed:{ordinary:0, content:0, likes:0, alert:0, channels:{}}, readAt:new Map(), resolvedAt:new Map() };
  function time(t) { return `${t>=1440?'次日':'当日'} ${String(Math.floor(t%1440/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`; }
  function events() {
    return DATA.map(r=>({id:r.id, kind:r.alert?'alert':r.cat==='social'?'like':'content', title:r.title,
      channel:r.cat==='content'?r.id:'', source:r.source||r.name, name:r.name,
      time:scenario==='pressure'&&r.alert?(r.id==='gap1'?605:610):schedule[r.id]}));
  }
  function title(batch) {
    const content=batch.items.filter(e=>e.kind==='content'), likes=batch.items.filter(e=>e.kind==='like');
    if(batch.pool==='alert')return batch.items.length===1?`${batch.items[0].source}：${batch.items[0].title}`:`${batch.items.length} 个频道有运行提醒：${batch.items.map(e=>e.source).join('、')}`;
    if(content.length)return content[0].title+(content.length>1?` · 另有 ${content.length-1} 条内容更新`:'')+(likes.length?` · 另有 ${likes.length} 条点赞提醒`:'');
    if(likes.length===1)return `${likes[0].name} 赞了《${likes[0].title}》`;
    return `你的 ${new Set(likes.map(e=>e.title)).size} 篇内容收到了 ${likes.length} 个赞`;
  }
  root.innerHTML=`<h2>Push 改造效果推演</h2>
    <p class="push-intro">用上面同一批 13 条真实通知，验证聚合、频控和夜间延后。<strong>下面的发生时刻、已消耗预算与开关是演示设定，不是实际投递日志。</strong>左侧是假设逐条即时发送的对照，不代表线上旧版。推演与上方账户快照独立，不修改真实账号。</p>
    <div class="push-controls"><label>场景 <select id="push-scenario"><option value="flow">完整流程</option><option value="pressure">预算接近上限</option></select></label>
    <label><input type="checkbox" data-push-option="aggregate" checked>聚合</label><label><input type="checkbox" data-push-option="cap" checked>频控</label><label><input type="checkbox" data-push-option="quiet" checked>夜间延后</label>
    <label>新内容 <select id="push-delivery"><option value="instant">即时</option><option value="digest">每日摘要</option><option value="off">关闭</option></select></label>
    <button class="icon" id="push-reset" title="重置推演" aria-label="重置推演">${icon('RotateCcw')}</button></div>
    <p class="push-muted" id="push-assumptions"></p>
    <div class="push-clock"><label for="push-time">演示时间</label><input id="push-time" type="range" min="0" max="2640" step="1" value="1920"><output id="push-time-label"></output></div>
    <div class="push-jumps"><button data-push-time="890">当日 14:50</button><button data-push-time="900">当日 15:00</button><button data-push-time="1080">当日 18:00</button><button data-push-time="1200">当日 20:00</button><button data-push-time="1439">当日 23:59</button><button data-push-time="1919">次日 07:59</button><button data-push-time="1920">次日 08:00</button><button data-push-time="2520">次日 18:00</button></div>
    <div class="push-stats" id="push-stats" aria-live="polite"></div><p class="push-audit" id="push-audit"></p>
    <div class="push-phones"><div><h3>逐条即时 · 对照假设</h3><div class="push-lock"><div class="push-lock-head"></div><div class="push-lock-list" id="push-before"></div></div></div><div><h3>方案规则 · 推演结果</h3><div class="push-lock"><div class="push-lock-head"></div><div class="push-lock-list" id="push-after"></div></div></div></div>
    <details class="push-advanced"><summary>推演开关与预算</summary><p>为观察合并过程，本场景显式开启全部样本频道和赞类 Push；产品方案仍建议新增频道、赞类默认关闭。取消勾选规则仅作效果拆解，不修改方案。两侧共用相同的渠道开关和设备授权假设。</p>
    <div class="push-controls"><label><input type="checkbox" data-push-option="push" checked>App Push</label><label><input type="checkbox" data-push-option="permission" checked>设备已授权（假设）</label><label><input type="checkbox" data-push-option="likes" checked>赞类 Push</label><label><input type="checkbox" data-push-option="alerts" checked>运行告警 Push</label></div>
    <div class="push-channel">${channels.map(r=>`<label><input type="checkbox" data-push-channel="${r.id}" checked>${esc(r.source)}</label>`).join('')}</div>
    <p>预设当日已消耗的次数（不计入下方本场景发送数；次日按新一天预算计算）</p>
    <div class="push-controls">${[['ordinary','普通',5],['content','新内容',4],['likes','赞类',2],['alert','P0',3]].map(([key,label,max])=>`<label>${label} <input type="number" min="0" max="${max}" value="0" data-push-budget="${key}"> / ${max}</label>`).join('')}</div>
    <p>新内容每频道 2 次/日、合计 4 次/日；普通 Push 合计 5 次/日；赞类 1 次/小时、2 次/日。P0 独立 3 次/日，第三次在 20:00 汇总。摘要不绕过预算，超限仅留站内，不次日补发。</p></details>
    <h3>逐条通知去了哪里</h3><p class="push-muted">在时间轴上推进到通知发生后，可模拟“读取通知”或“告警恢复”。尚未发送的会撤销，已经发送的记录不会被抹掉。此处读取只影响本推演；回退时间可查看当时状态。改变规则会重算整个场景，不代表可以撤回真实 Push。</p>
    <div class="push-ledger"><table><thead><tr><th>演示发生时刻</th><th>真实通知</th><th>方案处理结果</th><th>操作</th></tr></thead><tbody id="push-ledger"></tbody></table></div>
    <p class="push-muted">本次样本覆盖新内容、作品点赞和数据缺口告警。其他类型的触发、P1 频控、真实设备投递、网络失败及跨时区行为仍以方案和开发验收为准；本演示不据此承诺线上降噪比例。</p>`;
  let latest;
  function draw() {
    const input=events(), next=NotificationPushPlan.plan(input,cfg,now), before=NotificationPushPlan.plan(input,cfg,now,true);
    latest={next,before};
    root.querySelector('#push-time').value=now;root.querySelector('#push-time-label').textContent=time(now);
    const arrived=input.filter(e=>e.time<=now), sent=next.out.reduce((n,b)=>n+b.items.length,0);
    const pending=[...next.states.values()].filter(s=>s.status==='pending').length, blocked=[...next.states.values()].filter(s=>s.status==='blocked').length;
    const unread=arrived.filter(e=>!cfg.readAt.has(e.id)||cfg.readAt.get(e.id)>now).length;
    root.querySelector('#push-assumptions').textContent=scenario==='flow'?'完整流程：3 条白天内容、6 条分时点赞、2 条夜间内容、2 条夜间告警。13 条通知的内容均来自已采集样本；仅重设发生时刻，假定告警尚未恢复。':'压力场景：仍是同一批 13 条通知；两条告警安排在白天，并预设已有 Push 消耗预算。预算是测试条件，不是真实历史。';
    root.querySelector('#push-stats').innerHTML=[['本场景站内未读',unread,`已发生 ${arrived.length} / 13 条；不是账户总数95`],['对照假设已发',before.out.length,'相同开关，逐条即时、无频控'],['方案推演已发',next.out.length,'按实际批次数计，不按包含条数'],['待发通知',pending,`另有 ${blocked} 条仅留站内或已撤销`]].map(([label,value,note])=>`<div><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join('');
    root.querySelector('#push-audit').textContent=`对账：已发生 ${arrived.length} 条＝已发送批次包含 ${sent} 条＋待发 ${pending} 条＋未发送 ${blocked} 条。已发送的 ${sent} 条合成 ${next.out.length} 次 Push，合并节省 ${sent-next.out.length} 次；站内通知不因此删除。`;
    root.querySelectorAll('.push-lock-head').forEach(el=>el.innerHTML=`<span>${now>=1440?'次日':'当日'} · 演示时钟</span><strong>${time(now).slice(3)}</strong>`);
    for(const [key,result] of [['before',before],['after',next]]) {
      root.querySelector('#push-'+key).innerHTML=result.out.length?result.out.map((b,i)=>`<button class="push-card ${b.pool==='alert'?'alert':''}" data-push-card="${key}:${i}"><small><span>NeoDrop</span><span>${time(b.time)}</span></small><strong>${esc(title(b))}</strong><em>${key==='after'?esc(b.reason):'对照假设：逐条即时'} · 包含 ${b.items.length} 条通知</em></button>`).reverse().join(''):'<div class="push-empty">尚无已发送的推送</div>';
    }
    root.querySelector('#push-ledger').innerHTML=input.sort((a,b)=>a.time-b.time).map(e=>{
      const s=next.states.get(e.id), readDone=cfg.readAt.has(e.id)&&cfg.readAt.get(e.id)<=now, resolved=cfg.resolvedAt.has(e.id)&&cfg.resolvedAt.get(e.id)<=now;
      const label=s.status==='sent'?`已发送 · 第 ${s.batch+1} 次 Push`:s.status==='pending'?`待发 · ${time(s.due)}`:s.status==='blocked'?'不发送':'尚未发生';
      return `<tr data-event="${e.id}"><td>${time(e.time)}</td><td><strong>${esc(e.title)}</strong><small>${esc(e.source)} · ${e.kind==='content'?'新内容':e.kind==='like'?'点赞':'运行提醒'}</small></td><td><strong>${label}</strong><small>${esc(s.reason)}</small>${readDone?'<small>通知已读</small>':''}${resolved?'<small>告警已恢复（模拟）</small>':''}</td><td>${e.time<=now?`${!readDone?`<button class="icon" data-push-read="${e.id}" title="读取通知" aria-label="读取通知">${icon('CheckCheck')}</button>`:''}${e.kind==='alert'&&!resolved?`<button class="icon" data-push-resolve="${e.id}" title="模拟告警恢复" aria-label="模拟告警恢复">${icon('Settings')}</button>`:''}`:''}</td></tr>`;
    }).join('');
  }
  function reset() {
    cfg.readAt.clear();cfg.resolvedAt.clear();scenario='flow';now=1920;
    Object.assign(cfg,{push:true,permission:true,likes:true,alerts:true,aggregate:true,quiet:true,cap:true,delivery:'instant',channels:new Set(channels.map(r=>r.id)),seed:{ordinary:0,content:0,likes:0,alert:0,channels:{}}});
    root.querySelector('#push-scenario').value='flow';root.querySelector('#push-delivery').value='instant';
    root.querySelectorAll('input[type=checkbox]').forEach(el=>el.checked=true);root.querySelectorAll('[data-push-budget]').forEach(el=>el.value=0);draw();
  }
  root.addEventListener('input',e=>{if(e.target.id==='push-time'){now=Number(e.target.value);draw();}});
  root.addEventListener('change',e=>{
    const el=e.target;
    if(el.dataset.pushOption)cfg[el.dataset.pushOption]=el.checked;
    else if(el.dataset.pushChannel){if(el.checked)cfg.channels.add(el.dataset.pushChannel);else cfg.channels.delete(el.dataset.pushChannel);}
    else if(el.dataset.pushBudget){const n=Number(el.value);if(!Number.isInteger(n)||n<0||n>Number(el.max)){el.value=cfg.seed[el.dataset.pushBudget];return;}cfg.seed[el.dataset.pushBudget]=n;}
    else if(el.id==='push-delivery')cfg.delivery=el.value;
    else if(el.id==='push-scenario'){scenario=el.value;cfg.readAt.clear();cfg.resolvedAt.clear();cfg.seed=scenario==='pressure'?{ordinary:4,content:3,likes:1,alert:2,channels:{}}:{ordinary:0,content:0,likes:0,alert:0,channels:{}};root.querySelectorAll('[data-push-budget]').forEach(n=>n.value=cfg.seed[n.dataset.pushBudget]);}
    draw();
  });
  root.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.id==='push-reset'){reset();return;}
    if(b.dataset.pushTime){now=Number(b.dataset.pushTime);draw();}
    else if(b.dataset.pushRead){cfg.readAt.set(b.dataset.pushRead,now);draw();}
    else if(b.dataset.pushResolve){cfg.resolvedAt.set(b.dataset.pushResolve,now);draw();}
    else if(b.dataset.pushCard){const [side,index]=b.dataset.pushCard.split(':');const batch=latest[side==='after'?'next':'before'].out[Number(index)];show('推送包含的通知',`<p>${time(batch.time)} · ${esc(batch.reason)}</p><ul class="push-detail-list">${batch.items.map(item=>`<li>${esc(item.source)}：${esc(item.title)}</li>`).join('')}</ul><p>这是方案推演，点击不发送真实 Push，也不将整批内容标为已看。</p>`,'<button class="command" data-cancel>关闭</button>');}
  });
  draw();
})();
