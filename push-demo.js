(function () {
  const root = document.querySelector('#push-demo'),
    channels = DATA.filter((r) => r.cat === 'content');
  const schedule = {
    silicon: 545,
    hn: 555,
    podcast: 565,
    roast: 1390,
    funding: 1400,
    like1: 850,
    like2: 860,
    like3: 875,
    like4: 910,
    like5: 920,
    like6: 1000,
    gap1: 1410,
    gap2: 1420,
  };
  let now = 1439,
    scenario = 'flow',
    platform = 'ios',
    latest;
  const expandedCards = new Set();
  const cfg = {
    push: true,
    permission: true,
    likes: true,
    alerts: true,
    aggregate: true,
    cap: true,
    seedLikes: 0,
    channels: new Set(channels.map((r) => r.id)),
    readAt: new Map(),
    resolvedAt: new Map(),
  };
  const time = (t) =>
    `${t >= 1440 ? '次日' : '当日'} ${String(Math.floor((t % 1440) / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
  const events = () =>
    DATA.map((r) => ({
      id: r.id,
      kind: r.alert ? 'alert' : r.cat === 'social' ? 'like' : 'content',
      title: r.title,
      contentCount: r.batch || 1,
      channel: r.cat === 'content' ? r.id : '',
      source: r.source || r.name,
      name: r.name,
      time: schedule[r.id],
    }));
  function heading(b) {
    const first = b.items[b.items.length - 1];
    return b.pool === 'like'
      ? b.items.length === 1
        ? first.name
        : `${first.name} 等 ${b.items.length} 人`
      : first.source;
  }
  function title(b) {
    if (b.pool !== 'like') {
      const e = b.items[0];
      return (
        e.title +
        (e.kind === 'content' && e.contentCount > 1
          ? ` · 另有 ${e.contentCount - 1} 篇`
          : '')
      );
    }
    if (b.items.length === 1) return `赞了你的内容《${b.items[0].title}》`;
    return `赞了你的 ${new Set(b.items.map((e) => e.title)).size} 篇内容，共 ${b.items.length} 个赞`;
  }
  function pushIcon(batch) {
    if (batch.pool === 'alert')
      return platform === 'ios'
        ? '<img class="push-app-logo" src="neodrop-logo.png" alt="NeoDrop">'
        : '';
    const event = batch.items[batch.items.length - 1],
      r = DATA.find((x) => x.id === event.id);
    return `<span class="push-avatar" role="img" aria-label="${esc(batch.pool === 'like' ? `${r.name}的头像占位` : `${r.source}频道图`)}${platform === 'ios' ? '，右下角为 NeoDrop 标识' : ''}">${avatar(r)}${platform === 'ios' ? '<img class="push-brand-badge" src="neodrop-logo.png" alt="">' : ''}</span>`;
  }
  function pushCard(batch, index, side) {
    const key = `${side}:${index}`,
      open = expandedCards.has(key),
      stamp = time(batch.time).slice(3);
    const message = `<span class="push-message"><span class="push-meta"><strong>${esc(heading(batch))}</strong>${platform === 'ios' ? `<time>${stamp}</time>` : ''}</span><span class="push-text">${esc(title(batch))}</span></span>`;
    const sourceIcon = pushIcon(batch);
    const body = `<button class="push-card-open" data-push-card="${key}">${platform === 'ios' ? sourceIcon : ''}${message}${platform === 'android' ? sourceIcon : ''}</button>`;
    const header =
      platform === 'android'
        ? `<div class="push-app-header"><span class="push-small-logo"><img src="neodrop-logo.png" alt="NeoDrop"></span><span>NeoDrop</span><span aria-hidden="true">·</span><time>${stamp}</time><button class="push-expand" data-push-expand="${key}" aria-expanded="${open}" aria-label="${open ? '收起' : '展开'}通知内容" title="${open ? '收起' : '展开'}通知内容">${icon('ChevronRight')}</button></div>`
        : '';
    return `<article class="push-card ${open ? 'is-expanded' : ''}" data-push-kind="${batch.pool}">${header}${body}</article>`;
  }
  root.innerHTML = `<h2>Push 改造效果推演</h2><p class="push-intro">13 条真实采样通知，另设发生时间以检验策略。左侧是假设逐条即时发送的对照，不代表线上旧版。右侧内容即时、点赞聚合限频、告警及时；<strong>不做每日摘要或夜间延后</strong>。与上方列表的已读、偏好相互独立，不修改真实账户。</p>
 <div class="push-controls"><label>场景 <select id="push-scenario"><option value="flow">完整流程</option><option value="pressure">点赞额度仅余一次</option></select></label><label><input type="checkbox" data-push-option="aggregate" checked>点赞聚合</label><label><input type="checkbox" data-push-option="cap" checked>点赞频控</label><button class="icon" id="push-reset" title="重置推演" aria-label="重置推演">${icon('RotateCcw')}</button></div>
 <p class="push-muted" id="push-assumptions"></p><div class="push-clock"><label for="push-time">演示时间</label><input id="push-time" type="range" min="0" max="1440" step="1" value="1439"><output id="push-time-label"></output></div>
 <div class="push-jumps">${[890, 900, 960, 1020, 1439].map((t) => `<button data-push-time="${t}">${time(t)}</button>`).join('')}</div>
 <div class="push-stats" id="push-stats" aria-live="polite"></div><p class="push-audit" id="push-audit"></p>
 <div class="push-platform"><span>系统外观</span><div class="push-platform-switch" role="group" aria-label="推送预览平台"><button data-push-platform="ios" aria-pressed="true">iOS</button><button data-push-platform="android" aria-pressed="false">Android</button></div><span class="push-muted" id="push-style-name"></span></div><p class="push-muted" id="push-platform-note"></p>
 <div class="push-phones"><div><h3>逐条即时 · 对照假设</h3><div class="push-lock"><div class="push-lock-head"></div><div class="push-lock-list" id="push-before"></div></div></div><div><h3>方案规则 · 推演结果</h3><div class="push-lock"><div class="push-lock-head"></div><div class="push-lock-list" id="push-after"></div></div></div></div>
 <details class="push-advanced"><summary>推演偏好与测试条件</summary><p>为展示策略，已开启全部样本频道和点赞。实际新频道沿用“新订阅频道默认关联”的账户选择；点赞默认关。这些测试开关独立于上方通知渠道设置。</p><div class="push-controls">${[
   ['push', 'App 推送'],
   ['permission', '设备已授权（假设）'],
   ['likes', '点赞推送'],
   ['alerts', '运行提醒推送'],
 ]
   .map(
     ([key, label]) =>
       `<label><input type="checkbox" data-push-option="${key}" checked>${label}</label>`,
   )
   .join(
     '',
   )}</div><div class="push-channel">${channels.map((r) => `<label><input type="checkbox" data-push-channel="${r.id}" checked>${esc(r.source)}</label>`).join('')}</div><p>已关联频道的内容更新不设每天 2 次或 4 次的上限，也不占用点赞预算。点赞最多 1 次/小时、2 次/日，触顶只保留站内，不次日补发。运行异常按同一事件去重，不等待定时汇总。</p></details>
 <h3>逐条通知去了哪里</h3><p class="push-muted">读取或恢复发生在发送前，会撤销待发；发生在发送后，保留已发送历史。改变测试规则会重算整个场景，不代表撤回真实 Push。下表未读仅属于本场景，不是账户总数。</p><div class="push-ledger"><table><thead><tr><th>演示发生时间</th><th>真实通知</th><th>方案处理结果</th><th>操作</th></tr></thead><tbody id="push-ledger"></tbody></table></div>
 <p class="push-muted">iOS 展示来源头像叠 App 小标的目标视觉，原生接入条件与真机效果仍需验收。频道图为内容来源，用户图为行为人；多人聚合文字保留“等 N 人”。用户头像未采集，首字圆形是占位。运行提醒仅使用 NeoDrop 图标。Android 单独按其系统模板示意，不照搬 iOS；最终位置、裁切与展开外观以系统版本和真机为准。<a href="https://developer.apple.com/design/human-interface-guidelines/notifications" target="_blank" rel="noopener">Apple 通知规范</a> · <a href="https://developer.android.com/design/ui/mobile/guides/home-screen/notifications" target="_blank" rel="noopener">Android 通知规范</a></p>`;
  function draw() {
    root.dataset.platform = platform;
    root
      .querySelectorAll('[data-push-platform]')
      .forEach((el) =>
        el.setAttribute(
          'aria-pressed',
          String(el.dataset.pushPlatform === platform),
        ),
      );
    root.querySelector('#push-style-name').textContent =
      platform === 'ios' ? '来源头像方案' : '普通通知';
    root.querySelector('#push-platform-note').textContent =
      platform === 'ios'
        ? '左侧为频道图或用户头像，右下角叠 NeoDrop 小标；右侧仅显示时间。运行提醒使用 App 图标。'
        : '上方为系统 App 小图标、名称和时间；右侧为频道或用户大图标。箭头展开正文，品牌不叠在头像角上；厂商模板可能不同。';
    const input = events(),
      next = NotificationPushPlan.plan(input, cfg, now),
      before = NotificationPushPlan.plan(input, cfg, now, true);
    latest = { next, before };
    const arrived = input.filter((e) => e.time <= now),
      sent = next.out.reduce((n, b) => n + b.items.length, 0),
      pending = [...next.states.values()].filter(
        (s) => s.status === 'pending',
      ).length,
      blocked = [...next.states.values()].filter(
        (s) => s.status === 'blocked',
      ).length;
    const unread = arrived.filter(
      (e) => !cfg.readAt.has(e.id) || cfg.readAt.get(e.id) > now,
    ).length;
    root.querySelector('#push-time').value = now;
    root.querySelector('#push-time-label').textContent = time(now);
    root.querySelector('#push-assumptions').textContent =
      scenario === 'flow'
        ? '演示设定：5 条内容更新、6 条不同作品的点赞、2 条未恢复运行提醒。点赞分为 3、2、1 条三个窗口；全部时间为构造。'
        : '同一批通知，预设当天已经用过一次点赞 Push 额度。历史消耗不计入本场景发送数；内容和告警不受它影响。';
    root.querySelector('#push-stats').innerHTML = [
      ['场景站内未读', unread, `已发生 ${arrived.length} / 13 条`],
      ['对照假设已发', before.out.length, '相同偏好，逐条即时'],
      ['方案推演已发', next.out.length, '按批次计数，不是通知条数'],
      ['待发通知', pending, `另有 ${blocked} 条未发送`],
    ]
      .map(
        ([label, value, note]) =>
          `<div><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`,
      )
      .join('');
    root.querySelector('#push-audit').textContent =
      `对账：已发生 ${arrived.length} 条＝已发批次包含 ${sent} 条＋待发 ${pending} 条＋未发送 ${blocked} 条。${sent} 条合成 ${next.out.length} 次 Push，合并减少 ${sent - next.out.length} 次；站内记录不因此减少。`;
    root
      .querySelectorAll('.push-lock-head')
      .forEach(
        (el) =>
          (el.innerHTML = `<span>9月29日 · 演示时钟</span><strong>${time(now).slice(3)}</strong>`),
      );
    for (const [key, result] of [
      ['before', before],
      ['after', next],
    ])
      root.querySelector('#push-' + key).innerHTML = result.out.length
        ? result.out
            .map((b, i) => pushCard(b, i, key))
            .reverse()
            .join('')
        : '<div class="push-empty">尚无已发送的推送</div>';
    root.querySelector('#push-ledger').innerHTML = input
      .sort((a, b) => a.time - b.time)
      .map((e) => {
        const s = next.states.get(e.id),
          isRead = cfg.readAt.has(e.id) && cfg.readAt.get(e.id) <= now,
          resolved =
            cfg.resolvedAt.has(e.id) && cfg.resolvedAt.get(e.id) <= now;
        return `<tr data-event="${e.id}"><td>${time(e.time)}</td><td><strong>${esc(e.title)}</strong><small>${esc(e.source)}</small></td><td><strong>${s.status === 'sent' ? `已发送 · 第 ${s.batch + 1} 次` : s.status === 'pending' ? `待发 · ${time(s.due)}` : s.status === 'blocked' ? '不发送' : '尚未发生'}</strong><small>${esc(s.reason)}</small>${isRead ? '<small>通知已读</small>' : ''}${resolved ? '<small>告警已恢复（模拟）</small>' : ''}</td><td>${e.time <= now ? `${!isRead ? `<button class="icon" data-push-read="${e.id}" title="读取通知" aria-label="读取通知">${icon('CheckCheck')}</button>` : ''}${e.kind === 'alert' && !resolved ? `<button class="icon" data-push-resolve="${e.id}" title="模拟恢复" aria-label="模拟恢复">${icon('Settings')}</button>` : ''}` : ''}</td></tr>`;
      })
      .join('');
  }
  function reset() {
    Object.assign(cfg, {
      push: true,
      permission: true,
      likes: true,
      alerts: true,
      aggregate: true,
      cap: true,
      seedLikes: 0,
      channels: new Set(channels.map((r) => r.id)),
      readAt: new Map(),
      resolvedAt: new Map(),
    });
    scenario = 'flow';
    now = 1439;
    expandedCards.clear();
    root.querySelector('#push-scenario').value = 'flow';
    root
      .querySelectorAll('input[type=checkbox]')
      .forEach((el) => (el.checked = true));
    draw();
  }
  root.addEventListener('input', (e) => {
    if (e.target.id === 'push-time') {
      now = Number(e.target.value);
      expandedCards.clear();
      draw();
    }
  });
  root.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset.pushOption) cfg[el.dataset.pushOption] = el.checked;
    else if (el.dataset.pushChannel) {
      el.checked
        ? cfg.channels.add(el.dataset.pushChannel)
        : cfg.channels.delete(el.dataset.pushChannel);
    } else if (el.id === 'push-scenario') {
      scenario = el.value;
      cfg.seedLikes = scenario === 'pressure' ? 1 : 0;
      cfg.readAt.clear();
      cfg.resolvedAt.clear();
    }
    expandedCards.clear();
    draw();
  });
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.id === 'push-reset') reset();
    else if (b.dataset.pushPlatform) {
      platform = b.dataset.pushPlatform;
      draw();
    } else if (b.dataset.pushExpand) {
      const key = b.dataset.pushExpand;
      expandedCards.has(key)
        ? expandedCards.delete(key)
        : expandedCards.add(key);
      draw();
    } else if (b.dataset.pushTime) {
      now = Number(b.dataset.pushTime);
      expandedCards.clear();
      draw();
    } else if (b.dataset.pushRead) {
      cfg.readAt.set(b.dataset.pushRead, now);
      expandedCards.clear();
      draw();
    } else if (b.dataset.pushResolve) {
      cfg.resolvedAt.set(b.dataset.pushResolve, now);
      expandedCards.clear();
      draw();
    } else if (b.dataset.pushCard) {
      const [side, index] = b.dataset.pushCard.split(':'),
        batch = latest[side === 'after' ? 'next' : 'before'].out[Number(index)];
      show(
        '推送对应的内容',
        `<p>${time(batch.time)} · ${esc(batch.reason)}</p><ul class="push-detail-list">${batch.items.map((e) => `<li>${esc(e.source)}：${esc(e.title)}</li>`).join('')}</ul><p>${batch.pool === 'content' ? '单篇直达内容，多篇落到频道页对应更新区域。' : batch.pool === 'like' ? '单目标进入对应互动，多目标进入本批次互动清单。' : '进入对应频道的可处理位置。'}此处仅演示落点，不修改上方列表或真实账户。</p>`,
        '<button class="command" data-cancel>关闭</button>',
      );
    }
  });
  draw();
})();
