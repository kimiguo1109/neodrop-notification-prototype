/* 推演只处理这批样本中的内容、点赞和告警，不产生真实投递。 */
(function () {
  function plan(input, cfg, now, baseline = false) {
    const unique = new Map();
    for (const event of input) if (!unique.has(event.id)) unique.set(event.id, event);
    const events = [...unique.values()].sort((a, b) => a.time - b.time);
    const states = new Map(events.map(e => [e.id, { status: 'upcoming', reason: '尚未发生' }]));
    const out = [], queue = [], days = new Map();
    const quiet = t => t % 1440 < 480 || t % 1440 >= 1320;
    const morning = t => Math.floor(t / 1440) * 1440 + (t % 1440 >= 1320 ? 1920 : 480);
    function budget(t) {
      const day = Math.floor(t / 1440);
      if (!days.has(day)) days.set(day, {
        ordinary: day === 0 ? cfg.seed.ordinary : 0,
        content: day === 0 ? cfg.seed.content : 0,
        likes: day === 0 ? cfg.seed.likes : 0,
        alert: day === 0 ? cfg.seed.alert : 0,
        channels: new Map(day === 0 ? Object.entries(cfg.seed.channels) : []), hours: new Set()
      });
      return days.get(day);
    }
    function enqueue(time, pool, items, reason, group) {
      const existing = group && queue.find(b => b.time === time && b.pool === pool && b.group === group);
      if (existing) existing.items.push(...items);
      else queue.push({ time, pool, items: [...items], reason, group });
      queue.sort((a, b) => a.time - b.time || Number(b.pool === 'alert') - Number(a.pool === 'alert'));
    }
    function block(e, reason) { states.set(e.id, { status: 'blocked', reason }); }
    for (const e of events) {
      if (e.time > now) continue;
      const disabled = !cfg.push ? 'App Push 总开关关闭' : !cfg.permission ? '设备未授权'
        : e.kind === 'content' && (cfg.delivery === 'off' || !cfg.channels.has(e.channel)) ? '该频道新内容 Push 未开启'
        : e.kind === 'like' && !cfg.likes ? '赞类 Push 关闭' : e.kind === 'alert' && !cfg.alerts ? '运行告警 Push 关闭' : '';
      if (disabled) { block(e, disabled); continue; }
      let time = e.time, reason = '即时发送', group = '';
      const pool = e.kind === 'alert' ? 'alert' : 'ordinary';
      if (!baseline) {
        if (e.kind === 'content' && cfg.delivery === 'digest') {
          time = Math.floor(e.time / 1440) * 1440 + (e.time % 1440 <= 1080 ? 1080 : 2520);
          reason = '18:00 每日摘要，替代即时'; group = 'digest';
        } else if (e.kind === 'like' && cfg.aggregate) {
          time = (Math.floor(e.time / 60) + 1) * 60; reason = '赞类等待整点汇总'; group = 'likes';
        }
        if (cfg.quiet && quiet(time)) {
          time = morning(time); reason = '夜间延后至次日或当日 08:00'; group = cfg.aggregate ? 'morning' : '';
        }
      }
      states.set(e.id, { status: 'pending', reason, due: time });
      enqueue(time, pool, [e], reason, group);
    }
    while (queue.length) {
      const batch = queue.shift();
      const b = budget(batch.time);
      let valid = batch.items.filter(e => {
        const readAt = cfg.readAt.get(e.id), resolvedAt = cfg.resolvedAt.get(e.id);
        const checkTime = Math.min(now, batch.time);
        if (readAt !== undefined && readAt <= checkTime) { block(e, '发送前已读，撤销待发'); return false; }
        if (resolvedAt !== undefined && resolvedAt <= checkTime) { block(e, '发送前已恢复，撤销待发'); return false; }
        return true;
      });
      if (!valid.length) continue;
      if (batch.time > now) continue;
      if (!baseline && cfg.cap && batch.pool === 'alert' && b.alert === 2 && batch.time % 1440 < 1200) {
        const due = Math.floor(batch.time / 1440) * 1440 + 1200;
        valid.forEach(e => states.set(e.id, { status: 'pending', reason: 'P0 前两次已用，第三次保留给 20:00 汇总', due }));
        enqueue(due, 'alert', valid, 'P0 第三次额度：20:00 待处理汇总', 'reserved');
        continue;
      }
      if (!baseline && cfg.cap) {
        valid = valid.filter(e => {
          let reason = '';
          if (e.kind === 'alert' && b.alert >= 3) reason = 'P0 每日 3 次上限';
          if (e.kind === 'content' && (b.channels.get(e.channel) || 0) >= 2) reason = '本频道每日 2 次上限';
          else if (e.kind === 'content' && b.content >= 4) reason = '新内容每日 4 次上限';
          if (e.kind === 'like' && b.likes >= 2) reason = '赞类每日 2 次上限';
          else if (e.kind === 'like' && b.hours.has(Math.floor(batch.time / 60))) reason = '赞类每小时 1 次上限';
          if (!reason && e.kind !== 'alert' && b.ordinary >= 5) reason = '普通 Push 每日 5 次上限';
          if (reason) { block(e, reason + '，仅保留站内，不次日补发'); return false; }
          return true;
        });
      }
      if (!valid.length) continue;
      if (batch.pool === 'alert') b.alert++;
      else {
        b.ordinary++;
        if (valid.some(e => e.kind === 'content')) b.content++;
        if (valid.some(e => e.kind === 'like')) { b.likes++; b.hours.add(Math.floor(batch.time / 60)); }
        for (const ch of new Set(valid.filter(e => e.kind === 'content').map(e => e.channel))) b.channels.set(ch, (b.channels.get(ch) || 0) + 1);
      }
      const index = out.length;
      out.push({ ...batch, items: valid });
      valid.forEach(e => states.set(e.id, { status: 'sent', batch: index, due: batch.time, reason: batch.reason }));
    }
    return { out, states, events };
  }
  globalThis.NotificationPushPlan = { plan };
})();
