/* 纯推演：内容即时且无每日配额；点赞按小时聚合并单独限频。 */
(function () {
 function plan(input,cfg,now,baseline=false){
  const events=[...new Map(input.map(e=>[e.id,e])).values()].sort((a,b)=>a.time-b.time);
  const states=new Map(events.map(e=>[e.id,{status:'upcoming',reason:'尚未发生'}])),out=[],groups=new Map(),days=new Map();
  const block=(e,reason)=>states.set(e.id,{status:'blocked',reason});
  for(const e of events){
   if(e.time>now)continue;
   const reason=!cfg.push?'App 推送未启用':!cfg.permission?'设备未授权':e.kind==='content'&&!cfg.channels.has(e.channel)?'频道未关联 App 推送':e.kind==='like'&&!cfg.likes?'点赞推送关闭':e.kind==='alert'&&!cfg.alerts?'运行提醒推送关闭':'';
   if(reason){block(e,reason);continue;}
   const time=!baseline&&e.kind==='like'&&cfg.aggregate?(Math.floor(e.time/60)+1)*60:e.time;
   const key=!baseline&&e.kind==='like'&&cfg.aggregate?`like:${time}`:e.id;
   if(!groups.has(key))groups.set(key,{time,pool:e.kind,items:[],reason:e.kind==='like'&&!baseline&&cfg.aggregate?'点赞窗口合并':'即时送达'});
   groups.get(key).items.push(e);
  }
  for(const batch of [...groups.values()].sort((a,b)=>a.time-b.time)){
   const effective=Math.min(batch.time,now);
   const items=batch.items.filter(e=>{
    if(cfg.readAt.has(e.id)&&cfg.readAt.get(e.id)<=effective){block(e,'发送前通知已读');return false;}
    if(cfg.resolvedAt.has(e.id)&&cfg.resolvedAt.get(e.id)<=effective){block(e,'发送前告警已恢复');return false;}
    return true;
   });
   if(!items.length)continue;
   if(batch.time>now){items.forEach(e=>states.set(e.id,{status:'pending',due:batch.time,reason:'等待点赞窗口结束'}));continue;}
   if(!baseline&&cfg.cap&&batch.pool==='like'){
    const day=Math.floor(batch.time/1440),hour=Math.floor(batch.time/60);
    if(!days.has(day))days.set(day,{used:day===0?cfg.seedLikes:0,hours:new Set()});
    const budget=days.get(day);
    if(budget.used>=2||budget.hours.has(hour)){items.forEach(e=>block(e,budget.used>=2?'点赞达到每日 2 次上限，仅留站内':'点赞达到每小时 1 次上限，仅留站内'));continue;}
    budget.used++;budget.hours.add(hour);
   }
   const index=out.length;out.push({...batch,items});items.forEach(e=>states.set(e.id,{status:'sent',batch:index,reason:batch.reason}));
  }
  return {events,states,out};
 }
 globalThis.NotificationPushPlan={plan};
})();
