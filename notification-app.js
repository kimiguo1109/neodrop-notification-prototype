const DATA = [
  {
    id: 'silicon',
    cat: 'content',
    source: '硅谷101 访谈精华',
    title:
      'E253｜谁在给大模型出题、卖题、判卷：数据公司卖什么、榜单能不能信、专家数据怎么验：完整逐字稿和精华摘要',
    time: '41 分钟前',
    day: '今天',
    batch: 2,
    avatar: 412,
    avatarFill: '#ff6600',
    reconstructed: true,
    articles: [
      {
        id: 'silicon',
        title:
          'E253｜谁在给大模型出题、卖题、判卷：数据公司卖什么、榜单能不能信、专家数据怎么验：完整逐字稿和精华摘要',
      },
      {
        id: 'silicon-e252',
        title:
          'E252｜硅谷睡眠外挂：对话 Eight Sleep 创始人，两万元的床套是富人的玩具还是预防医疗的入口：完整逐字稿和精华摘要',
      },
    ],
  },
  {
    id: 'hn',
    cat: 'content',
    source: 'Hacker News 每日 Top 20',
    title:
      'Claude Sonnet 5.5、一份写着 420 亿美元净亏损的招股书，与用雌蚊口针做成的 3D 打印喷头——Hacker News Top 20（2026 年 9 月 29 日）',
    time: '2 小时前',
    day: '今天',
    avatar: 681,
    avatarFill: '#ff6600',
  },
  {
    id: 'podcast',
    cat: 'content',
    source: '我的播客精华 | 12 档节目速读',
    title:
      '连共和党人都开始反战：Reason 四人圆桌谈伊朗战争、40 万亿国债与 AI 时代的政府',
    time: '2 小时前',
    day: '今天',
    avatar: 992,
    avatarFill: '#f3ebd3',
  },
  {
    id: 'roast',
    cat: 'content',
    source: 'Daily AI Product Roast',
    title:
      "Nvidia's cage for rogue AI agents is free and open source. The watchdog that catches a breakout runs on a chip.",
    time: '4 小时前',
    day: '今天',
    batch: 6,
    avatar: 1302,
    avatarFill: '#101010',
    reconstructed: true,
    articles: [
      {
        id: 'roast',
        title:
          "Nvidia's cage for rogue AI agents is free and open source. The watchdog that catches a breakout runs on a chip.",
      },
      {
        id: 'roast-humalike',
        title:
          "Humalike's GTA NPCs remember every player and gossip about them. Each spoken line is a billed turn.",
      },
      {
        id: 'roast-hemory',
        title:
          "Hemory turns your whole day into searchable memory, including everyone else's half of it.",
      },
      {
        id: 'roast-pixverse',
        title:
          'PixVerse R2 topped Product Hunt with worlds you can walk into. The company has not published what a minute inside one costs.',
      },
      {
        id: 'roast-opaline',
        title:
          "Opaline uploads your team's full Claude Code and Codex transcripts. Not sending them starts at $85 a member.",
      },
      {
        id: 'roast-solid',
        title:
          'Solid hands your agent a computer, a Google account, and one shared wallet',
      },
    ],
  },
  {
    id: 'funding',
    cat: 'content',
    source: 'AI应用融资快讯',
    title: 'HiringCafe 融 680 万美元，去拆 Indeed',
    time: '8 小时前',
    day: '今天',
    avatar: 1614,
    avatarFill: '#001031',
  },
  {
    id: 'like1',
    cat: 'social',
    name: 'vunt',
    title:
      "Humalike's GTA NPCs remember every player and gossip about them. Each spoken line is a billed turn.",
    time: '9 小时前',
    day: '今天',
  },
  {
    id: 'like2',
    cat: 'social',
    name: '邱志明',
    title: '城市一口｜一碗面，一碗粉，都是牛骨汤',
    time: '11 小时前',
    day: '昨天',
  },
  {
    id: 'like3',
    cat: 'social',
    name: 'Luca Moretti',
    title: "Discord's age check is going great",
    time: '13 小时前',
    day: '昨天',
  },
  {
    id: 'like4',
    cat: 'social',
    name: '温雨辰',
    title: '工合，先把月亮看圆',
    time: '13 小时前',
    day: '昨天',
  },
  {
    id: 'like5',
    cat: 'social',
    name: '赵昕',
    title: 'A股综合热度 Top 5｜9月28日',
    time: '21 小时前',
    day: '昨天',
  },
  {
    id: 'like6',
    cat: 'social',
    name: '周沅',
    title: '我捧着一块西瓜：王嘉尔的十六年',
    time: '1 天前',
    day: '近 7 天',
  },
  {
    id: 'gap1',
    cat: 'other',
    source: '悬案深读',
    title: '连续几期存在数据缺口',
    time: '1 天前',
    day: '近 7 天',
    alert: true,
  },
  {
    id: 'gap2',
    cat: 'other',
    source: '硅谷101 访谈精华',
    title: '连续几期存在数据缺口',
    time: '4 天前',
    day: '近 7 天',
    alert: true,
  },
];
// 真实标题来自模拟器频道页；旧通知没有逐篇关联，历史分组按发布顺序重建。
const GROUP_DEMO = [
  {
    id: 'demo-batch',
    cat: 'content',
    source: '科技观察 · 示例频道',
    channel: 'demo-channel',
    title: '端侧模型如何改变手机应用',
    time: '18 分钟前',
    day: '今天',
    batch: 2,
    articles: [
      { id: 'demo-a', title: '端侧模型如何改变手机应用' },
      { id: 'demo-b', title: '从语音到操作：新一代助手的交互方式' },
    ],
  },
  {
    id: 'demo-single',
    cat: 'content',
    source: '科技观察 · 示例频道',
    channel: 'demo-channel',
    title: '开源模型的一周进展',
    time: '昨天',
    day: '昨天',
  },
  {
    id: 'demo-like',
    cat: 'social',
    name: '示例读者',
    title: '端侧模型如何改变手机应用',
    time: '25 分钟前',
    day: '今天',
  },
];
const ALERT_DEMO = [
  {
    id: 'alert-demo-1',
    cat: 'other',
    source: '示例频道 A',
    title: '本次内容生产失败',
    time: '5 分钟前',
    day: '今天',
    alert: true,
  },
  {
    id: 'alert-demo-2',
    cat: 'other',
    source: '示例频道 B',
    title: '连续几期存在数据缺口',
    time: '20 分钟前',
    day: '今天',
    alert: true,
  },
  {
    id: 'alert-demo-3',
    cat: 'other',
    source: '示例频道 C',
    title: '外发失败，请检查关联渠道',
    time: '1 小时前',
    day: '今天',
    alert: true,
  },
  {
    id: 'alert-demo-4',
    cat: 'other',
    source: '示例频道 D',
    title: '本次内容生产失败',
    time: '昨天',
    day: '昨天',
    alert: true,
  },
  {
    id: 'alert-demo-5',
    cat: 'other',
    source: '示例频道 E',
    title: '连续几期存在数据缺口',
    time: '昨天',
    day: '昨天',
    alert: true,
  },
];
const names = { all: '全部', content: '新内容', social: '互动', other: '其他' };
let mode = 'real',
  category = 'all',
  webCategory = 'all',
  webOpen = true,
  alertsExpanded = false;
const read = new Set(),
  viewed = new Set(),
  expanded = new Set(),
  scrolls = new Map(),
  webScrolls = new Map();
const prefs = {
  push: true,
  email: true,
  pushDefault: false,
  emailDefault: true,
  channels: new Set(),
  emailChannels: new Set(
    DATA.filter((r) => r.cat === 'content').map((r) => r.id),
  ),
  likes: false,
  follows: true,
  replies: true,
  alerts: true,
  conversations: true,
  receipts: false,
  membership: true,
  tasks: true,
};
let linkedDraft = null;
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ],
  );
const icon = (name) => `<img src="${ICONS[name]}" alt="">`;
const activeData = () =>
  mode === 'real' ? DATA : mode === 'grouped' ? GROUP_DEMO : ALERT_DEMO;
const articles = (r) => r.articles || [{ id: r.id, title: r.title }];
const channelKey = (r) => r.channel || r.id;
function counts() {
  const n =
    mode === 'real'
      ? { content: 78, social: 15, other: 2 }
      : { content: 0, social: 0, other: 0 };
  for (const r of activeData()) {
    if (mode !== 'real') n[r.cat]++;
    if (read.has(r.id)) n[r.cat]--;
  }
  return { ...n, all: n.content + n.social + n.other };
}
function avatar(r) {
  if (r.cat === 'content' && r.avatar)
    return `<span class="avatar photo" style="background-position-y:-${(r.avatar * 32) / 104}px;--avatar-fill:${r.avatarFill}"></span>`;
  if (r.cat === 'social')
    return `<span class="avatar user">${esc(r.name.slice(0, 1))}</span>`;
  return `<span class="avatar">${r.alert ? icon('TriangleAlert') : esc(r.source.slice(0, 1))}</span>`;
}
function dot(unread) {
  return unread
    ? '<span class="dot" aria-label="通知未读"></span>'
    : '<span></span>';
}
function row(r, old = false) {
  const title =
    old && r.cat === 'content'
      ? `频道「${r.source}」发布了${r.batch || 1}篇新内容`
      : r.title;
  const meta = `<div class="row-meta">${r.source ? `${r.cat === 'content' && !old ? `<button class="text-action" data-channel-page="${channelKey(r)}">${esc(r.source)}</button>` : `<span>${esc(r.source)}</span>`}<span aria-hidden="true">·</span>` : ''}<span class="time">${esc(r.time)}</span></div>`;
  const html =
    r.cat === 'social'
      ? `<h3>${esc(r.name)} 赞了你的内容</h3><p class="title-preview" title="${esc(r.title)}">《${esc(r.title)}》</p>`
      : r.cat === 'content' && !old
        ? `<button class="content-title ${viewed.has(r.id) ? 'seen' : ''}" title="${esc(title)}" data-content="${r.id}:${r.id}">${esc(title)}</button>`
        : `<h3>${esc(title)}</h3>${old && r.cat === 'content' ? `<p>${esc(r.title)}</p>` : ''}`;
  return `<article class="row ${r.alert && !old ? 'alert' : ''}" data-id="${r.id}" ${r.cat !== 'content' && !old ? `data-detail="${r.id}" role="button" tabindex="0"` : ''}>${avatar(r)}<div>${html}${meta}</div>${dot(old || !read.has(r.id))}</article>`;
}
function groupRow(records) {
  const first = records[0],
    key = channelKey(first),
    open = expanded.has(key),
    unread = records.filter((r) => !read.has(r.id)).length;
  const all = records.flatMap((r) => articles(r).map((a) => ({ r, a }))),
    total = records.reduce((n, r) => n + (r.batch || articles(r).length), 0);
  const visible = open ? all : all.slice(0, 2),
    shown = new Set();
  const entries = visible
    .map(({ r, a }) => {
      const firstInNotice = !shown.has(r.id);
      shown.add(r.id);
      return `${firstInNotice ? `<div class="notice-meta" data-notice="${r.id}">${dot(!read.has(r.id))}<span>${r.batch ? `本条含 ${r.batch} 篇 · ` : ''}${esc(r.time)}</span></div>` : ''}<div class="article-item" data-article="${a.id}"><span></span><button class="content-title ${viewed.has(a.id) ? 'seen' : ''}" title="${esc(a.title)}" data-content="${r.id}:${a.id}">${esc(a.title)}</button></div>`;
    })
    .join('');
  return `<section class="channel-group" data-group="${key}"><div class="channel-head"><button class="channel-identity" data-channel-page="${key}">${avatar(first)}<span><strong>${esc(first.source)}</strong><span class="channel-status">${unread ? `${unread} 条未读通知` : '通知已读'} · ${total} 篇内容</span></span></button><button class="icon channel-read" data-read-channel="${key}" title="标记该频道通知已读" aria-label="标记该频道通知已读">${icon('CheckCheck')}</button>${all.length > 2 ? `<button class="icon channel-toggle" data-expand="${key}" aria-expanded="${open}" aria-label="${open ? '收起' : '展开'}频道内容" title="${open ? '收起' : '展开'}频道内容"><span style="display:flex;transform:rotate(${open ? -90 : 90}deg)">${icon('ChevronRight')}</span></button>` : ''}</div><div class="channel-items">${entries}</div>${all.length > 2 ? `<div class="group-actions"><button class="text-action" data-expand="${key}" aria-expanded="${open}">${open ? '收起较早内容' : `展开其余 ${all.length - 2} 篇`}</button></div>` : ''}</section>`;
}
function rowsMarkup(cat) {
  const selected = activeData().filter((r) => cat === 'all' || r.cat === cat),
    pinned = selected.filter(
      (r) => r.alert && (cat === 'other' || !read.has(r.id)),
    ),
    done = new Set();
  let day = '';
  let html = pinned.length
    ? `<section class="alert-group"><div class="group">运行提醒${cat === 'all' ? ' · 未读' : ''}<span>${pinned.length} 条</span></div>${(alertsExpanded ? pinned : pinned.slice(0, 2)).map((r) => row(r)).join('')}${pinned.length > 2 ? `<button class="text-action alert-more" data-expand-alerts aria-expanded="${alertsExpanded}">${icon('ChevronRight')}${alertsExpanded ? '收起运行提醒' : `展开其余 ${pinned.length - 2} 条运行提醒`}</button>` : ''}</section>`
    : '';
  for (const r of selected.filter((r) => !pinned.includes(r))) {
    if (done.has(r.id)) continue;
    if (r.day !== day) {
      html += `<div class="group">${r.day}</div>`;
      day = r.day;
    }
    if (r.cat === 'content') {
      const group = selected.filter(
        (x) => x.cat === 'content' && channelKey(x) === channelKey(r),
      );
      group.forEach((x) => done.add(x.id));
      html += group.length > 1 || r.batch ? groupRow(group) : row(r);
    } else html += row(r);
  }
  return html || '<div class="empty">暂无通知</div>';
}
function chips(n, web = false) {
  return `<div class="chips" role="tablist" aria-label="${web ? 'Web ' : ''}通知分类">${Object.entries(
    names,
  )
    .map(
      ([key, label]) =>
        `<button class="chip" role="tab" aria-selected="${(web ? webCategory : category) === key}" ${web ? 'data-web-cat' : 'data-cat'}="${key}">${label}${n[key] ? `<span class="badge">${n[key]}</span>` : ''}</button>`,
    )
    .join('')}</div>`;
}
function shell() {
  return `<div class="status"><span>10:21</span><span>${icon('Wifi')}${icon('BatteryFull')}</span></div><div class="topbar"><span class="icon">${icon('Menu')}</span><b>通知</b><div class="actions"><button class="icon" data-settings aria-label="通知渠道" title="通知渠道">${icon('Settings')}</button><button class="icon" data-mark aria-label="标记当前样本已读" title="标记当前样本已读">${icon('CheckCheck')}</button></div></div>${chips(counts())}<div class="list" data-category="${category}"></div><div class="dock" aria-hidden="true"><div class="dock-main"><span>${icon('House')}</span><span>${icon('Compass')}</span><span class="selected">${icon('Bell')}</span><span><i class="dock-avatar">我</i></span></div><span class="agent">${icon('MessageCircle')}</span></div>`;
}
function renderWeb() {
  const host = document.querySelector('#web-notices'),
    prev = host.querySelector('.list');
  if (prev && !host.hidden)
    webScrolls.set(prev.dataset.category, prev.scrollTop);
  host.hidden = !webOpen;
  host.innerHTML = `<div class="web-head"><h3>通知</h3><button class="icon" data-settings aria-label="通知渠道" title="通知渠道">${icon('Settings')}</button><button class="icon" data-web-toggle aria-label="关闭通知" title="关闭通知">${icon('X')}</button></div><div class="list" data-category="${webCategory}">${rowsMarkup(webCategory)}</div><div class="web-footer">${chips(counts(), true)}<button class="icon" data-mark="web" aria-label="标记当前样本已读" title="标记当前样本已读">${icon('CheckCheck')}</button></div>`;
  host.querySelector('.list').scrollTop = webScrolls.get(webCategory) || 0;
}
function render() {
  const host = document.querySelector('#after'),
    prev = host.querySelector('.list');
  if (prev) scrolls.set(prev.dataset.category, prev.scrollTop);
  host.innerHTML = shell();
  host.querySelector('.list').innerHTML = rowsMarkup(category);
  host.querySelector('.list').scrollTop = scrolls.get(category) || 0;
  renderWeb();
  document.querySelector('#before').innerHTML =
    mode === 'real'
      ? '<img class="original" src="simulator-before.png" alt="模拟器原始通知截图，未读95条">'
      : `<div class="screen"><div class="status">10:21</div><div class="topbar"><span></span><b>通知</b></div><div class="group">独立示例 · ${mode === 'grouped' ? '2 条内容通知，3 篇文章' : '5 条运行提醒，不折叠'}</div><div class="list">${activeData()
          .map((r) => row(r, true))
          .join('')}</div></div>`;
  document.querySelector('#before-caption').textContent =
    mode === 'real'
      ? '模拟器原始截图，布局与计数保持原样'
      : '构造的完整示例，与真实账户快照分开';
  document.querySelector('#baseline-counts').innerHTML =
    mode === 'real'
      ? '<small>采集快照 · 左侧固定</small><strong>95 条未读</strong> <span>＝ 78 ＋ 15 ＋ 2</span>'
      : `<small>示例初始状态 · 非真实账户</small><strong>${mode === 'grouped' ? 3 : 5} 条未读</strong> <span>＝ ${mode === 'grouped' ? '2 ＋ 1 ＋ 0' : '0 ＋ 0 ＋ 5'}</span>`;
  const n = counts();
  document.querySelector('#current-counts').innerHTML =
    `<small>当前${mode === 'real' ? '真实采样' : '独立示例'} · 右侧实时</small><strong>${n.all} 条未读</strong> <span>＝ ${n.content} ＋ ${n.social} ＋ ${n.other}</span>`;
  document.querySelector('#sample-note').textContent =
    mode === 'real'
      ? '13 条通知保留早间 95 条未读快照。硅谷 2 篇、Roast 6 篇的真实标题已从模拟器频道页补采；旧通知仅存数量与最新标题，历史分组按频道发布顺序重建，并非已核验的原始逐篇关联。补标题不增加通知数。'
      : mode === 'grouped'
        ? '完整示例：同频道两条通知包含三篇文章。打开前两篇中的任一篇只扣同一条通知一次；第三篇属于另一条通知。展开、收起及进入频道页不扣数；标题只在该篇被打开后变灰。'
        : '独立构造的 5 条运行提醒：默认显示 2 条，展开显示全部。折叠不改变未读计数，不代表只推送 2 条；真实采样只有 2 条运行提醒，不制造额外真实告警。';
  document
    .querySelectorAll('[data-mode]')
    .forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.mode === mode)),
    );
}
const dialog = document.querySelector('#detail');
dialog.querySelector('.close').innerHTML = icon('X');
dialog.querySelector('.close').onclick = () => dialog.close();
dialog.addEventListener('close', () => {
  linkedDraft = null;
});
function show(title, body, actions = '') {
  dialog.querySelector('h2').textContent = title;
  dialog.querySelector('.dialog-body').innerHTML = body;
  dialog.querySelector('.dialog-actions').innerHTML = actions;
  if (!dialog.open) dialog.showModal();
}
function findRecord(id) {
  return activeData().find((r) => r.id === id);
}
function openContent(recordId, articleId) {
  const r = findRecord(recordId),
    a = articles(r).find((x) => x.id === articleId);
  read.add(r.id);
  viewed.add(a.id);
  render();
  show(
    r.source,
    `<h3>${esc(a.title)}</h3><p>${mode === 'grouped' ? '这是独立构造的内容详情示例。' : '正文未采集，此处仅演示内容详情落点。'}仅该篇标为已看，其所属通知计一次已读，同组其他通知不变。</p>`,
    '<button class="command" data-cancel>返回通知</button>',
  );
}
function openChannel(key) {
  const records = activeData().filter(
      (r) => r.cat === 'content' && channelKey(r) === key,
    ),
    r = records[0];
  show(
    '频道',
    `<div class="channel-landing">${avatar(r)}<strong>${esc(r.source)}</strong></div><div class="channel-landing-list">${records.flatMap((x) => articles(x).map((a) => `<button class="content-title ${viewed.has(a.id) ? 'seen' : ''}" data-content="${x.id}:${a.id}">${esc(a.title)}</button>`)).join('')}</div><p>频道页落点演示。进入频道不自动清除通知；打开具体内容才更新对应状态。</p>`,
    '<button class="command" data-cancel>返回通知</button>',
  );
}
const channelOptions = DATA.filter((r) => r.cat === 'content');
function prefRow(key, label) {
  return `<div class="preference"><label for="pref-${key}">${label}</label><input id="pref-${key}" type="checkbox" data-pref="${key}" ${prefs[key] ? 'checked' : ''}></div>`;
}
function showSettings() {
  linkedDraft = null;
  show(
    '通知渠道',
    `<div class="delivery-channel"><span class="channel-label">App 推送</span>${prefRow('push', '启用')}${prefRow('pushDefault', '新订阅频道默认关联')}<div class="preference"><span>已关联 ${prefs.channels.size} 个频道</span><button class="text-action" data-manage="push">关联频道</button></div></div><div class="delivery-channel"><span class="channel-label">邮件</span>${prefRow('email', '启用')}${prefRow('emailDefault', '新订阅频道默认关联')}<div class="preference"><span>已关联 ${prefs.emailChannels.size} 个频道</span><button class="text-action" data-manage="email">关联频道</button></div></div><h3>其他 App 推送</h3>${prefRow('likes', '点赞')}${prefRow('follows', '关注与订阅')}${prefRow('replies', '评论与回复')}${prefRow('alerts', '运行与账户异常')}${prefRow('conversations', '对话与异步任务完成')}${prefRow('tasks', '频道创建成功')}${prefRow('receipts', '积分与会员到账回执')}${prefRow('membership', '会员临期与到期')}<p>账户偏好在 App 与 Web 同步；手机系统授权请到对应设备修改。关联频道仅控制新内容，不影响互动、运行提醒或站内记录。会员临期等新增事件随链路上线开放，本原型仅演示目标设置。</p>`,
    '<button class="command" data-cancel>完成</button>',
  );
}
function showLinked(type) {
  if (!linkedDraft || linkedDraft.type !== type)
    linkedDraft = {
      type,
      ids: new Set(type === 'push' ? prefs.channels : prefs.emailChannels),
    };
  show(
    '管理关联频道',
    `<p>${type === 'push' ? 'App 推送' : '邮件'} · 已订阅频道</p><div class="linked-toolbar"><span>已选 ${linkedDraft.ids.size} / ${channelOptions.length}</span><div><button class="text-action" data-select-all>全选</button><button class="text-action" data-select-none>全不选</button></div></div>${channelOptions.map((r) => `<div class="preference"><label for="linked-${r.id}">${esc(r.source)}</label><input type="checkbox" id="linked-${r.id}" data-linked="${r.id}" ${linkedDraft.ids.has(r.id) ? 'checked' : ''}></div>`).join('')}`,
    '<button class="command" data-linked-cancel>取消</button><button class="command primary" data-linked-save>完成</button>',
  );
}
function resetList() {
  read.clear();
  viewed.clear();
  expanded.clear();
  alertsExpanded = false;
  category = 'all';
  webCategory = 'all';
  webOpen = true;
  scrolls.clear();
  webScrolls.clear();
  document
    .querySelectorAll('#after .list,#web-notices .list')
    .forEach((el) => (el.scrollTop = 0));
  render();
}
document.querySelector('#reset-demo').innerHTML = icon('RotateCcw');
document.querySelector('#reset-demo').onclick = resetList;
document.querySelector('#reset-walkthrough').innerHTML = icon('RotateCcw');
document.querySelector('#reset-walkthrough').onclick = () => {
  mode = 'real';
  Object.assign(prefs, {
    push: true,
    email: true,
    pushDefault: false,
    emailDefault: true,
    likes: false,
    follows: true,
    replies: true,
    alerts: true,
    conversations: true,
    receipts: false,
    membership: true,
    tasks: true,
    channels: new Set(),
    emailChannels: new Set(channelOptions.map((r) => r.id)),
  });
  resetList();
  document.querySelector('#push-reset').click();
  document.querySelector('#push-demo .push-advanced').open = false;
  document.querySelector('#app-prototype').scrollIntoView();
  history.replaceState(null, '', '#app-prototype');
};
document.querySelector('[data-web-toggle]').innerHTML = icon('Bell');
document.addEventListener('keydown', (e) => {
  if (
    e.target.matches('.row[data-detail]') &&
    (e.key === 'Enter' || e.key === ' ')
  ) {
    e.preventDefault();
    e.target.click();
  }
});
document.addEventListener('change', (e) => {
  const el = e.target;
  if (el.dataset.pref) prefs[el.dataset.pref] = el.checked;
  if (el.dataset.linked) {
    if (el.checked) linkedDraft.ids.add(el.dataset.linked);
    else linkedDraft.ids.delete(el.dataset.linked);
    dialog.querySelector('.linked-toolbar>span').textContent =
      `已选 ${linkedDraft.ids.size} / ${channelOptions.length}`;
  }
});
document.addEventListener('click', (e) => {
  const b = e.target.closest('button,[data-detail]');
  if (!b) return;
  if (b.dataset.mode) {
    mode = b.dataset.mode;
    resetList();
  } else if (b.dataset.cat) {
    category = b.dataset.cat;
    render();
  } else if (b.dataset.webCat) {
    webCategory = b.dataset.webCat;
    renderWeb();
  } else if (b.hasAttribute('data-web-toggle')) {
    webOpen = !webOpen;
    renderWeb();
  } else if (b.hasAttribute('data-expand-alerts')) {
    alertsExpanded = !alertsExpanded;
    render();
  } else if (b.dataset.expand) {
    const key = b.dataset.expand;
    expanded.has(key) ? expanded.delete(key) : expanded.add(key);
    render();
  } else if (b.dataset.content) {
    if (b.closest('#web-notices')) webOpen = false;
    openContent(...b.dataset.content.split(':'));
  } else if (b.dataset.channelPage) {
    if (b.closest('#web-notices')) {
      webOpen = false;
      renderWeb();
    }
    openChannel(b.dataset.channelPage);
  } else if (b.dataset.detail) {
    const r = findRecord(b.dataset.detail);
    read.add(r.id);
    if (b.closest('#web-notices')) webOpen = false;
    render();
    show(
      r.alert ? r.source : '互动详情',
      `<p>${esc(r.title)}</p><p>${r.alert ? '历史提醒的当前解决状态未核验。读取不代表问题已解决。' : '此处演示对应作品的互动落点。'}</p>`,
      '<button class="command" data-cancel>返回通知</button>',
    );
  } else if (b.dataset.readChannel) {
    activeData()
      .filter(
        (r) => r.cat === 'content' && channelKey(r) === b.dataset.readChannel,
      )
      .forEach((r) => read.add(r.id));
    render();
  } else if (b.hasAttribute('data-settings')) showSettings();
  else if (b.dataset.manage) showLinked(b.dataset.manage);
  else if (b.hasAttribute('data-select-all')) {
    linkedDraft.ids = new Set(channelOptions.map((r) => r.id));
    showLinked(linkedDraft.type);
  } else if (b.hasAttribute('data-select-none')) {
    linkedDraft.ids.clear();
    showLinked(linkedDraft.type);
  } else if (b.hasAttribute('data-linked-cancel')) showSettings();
  else if (b.hasAttribute('data-linked-save')) {
    prefs[linkedDraft.type === 'push' ? 'channels' : 'emailChannels'] = new Set(
      linkedDraft.ids,
    );
    showSettings();
  } else if (b.hasAttribute('data-mark'))
    show(
      '标记当前样本已读',
      '<p>仅标记当前分类中已采集或示例通知。不改变内容已看状态，不修改真实账户或未采集的通知。</p>',
      `<button class="command" data-cancel>取消</button><button class="command primary" data-read-sample="${b.dataset.mark === 'web' ? webCategory : category}">标记样本已读</button>`,
    );
  else if (b.hasAttribute('data-read-sample')) {
    activeData()
      .filter(
        (r) => b.dataset.readSample === 'all' || r.cat === b.dataset.readSample,
      )
      .forEach((r) => read.add(r.id));
    dialog.close();
    render();
  } else if (b.hasAttribute('data-cancel')) dialog.close();
});
render();
