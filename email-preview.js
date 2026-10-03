/* 纯本地交互原型，不调用真实账户、验证或发信接口。 */
const CHANNELS = [
  { id: 'silicon', name: '硅谷101 访谈精华', y: 412, fill: '#ff6600' },
  { id: 'hn', name: 'Hacker News 每日 Top 20', y: 681, fill: '#ff6600' },
  {
    id: 'podcast',
    name: '我的播客精华 | 12 档节目速读',
    y: 992,
    fill: '#f3ebd3',
  },
  { id: 'roast', name: 'Daily AI Product Roast', y: 1302, fill: '#101010' },
  { id: 'funding', name: 'AI应用融资快讯', y: 1614, fill: '#001031' },
];
const BATCHES = [
  {
    id: 'single',
    channel: 'funding',
    time: '09:42',
    title: '单篇更新',
    articles: [
      {
        id: 'hiring',
        title: 'HiringCafe 融 680 万美元，去拆 Indeed',
        excerpt:
          '招聘搜索正在重新划分入口。HiringCafe 希望让求职者直接找到企业发布的岗位，把信息检索与职位匹配放在同一个体验里。',
      },
    ],
  },
  {
    id: 'multi',
    channel: 'silicon',
    time: '09:18',
    title: '同批多篇',
    articles: [
      {
        id: 'e253',
        title:
          'E253｜谁在给大模型出题、卖题、判卷：数据公司卖什么、榜单能不能信、专家数据怎么验：完整逐字稿和精华摘要',
        excerpt:
          '模型能力怎样被衡量？从数据生产到基准评测，本期把出题、标注与验证背后的工作拆开来看，也讨论排行榜之外更难量化的能力。',
      },
      {
        id: 'e252',
        title:
          'E252｜硅谷睡眠外挂：对话 Eight Sleep 创始人，两万元的床套是富人的玩具还是预防医疗的入口：完整逐字稿和精华摘要',
        excerpt:
          '一张床如何成为健康设备？从睡眠监测、温度调节到长期健康数据，对话 Eight Sleep 创始人，讨论产品背后的技术与商业选择。',
      },
    ],
  },
];
const VIEW_LABELS = {
  web: ['Monitor', 'Web 渠道'],
  app: ['Smartphone', 'App 渠道'],
  email: ['Mail', '内容邮件'],
  notices: ['Bell', '通知联动'],
};
const root = document.querySelector('#preview-root');
const modal = document.querySelector('#modal');
const modalContent = document.querySelector('#modal-content');
let state;
let view = Object.hasOwn(VIEW_LABELS, location.hash.slice(1))
  ? location.hash.slice(1)
  : 'web';
let inbox = 'work:1';
let mailId = 'single';
let modalState = null;
let toastTimer;

function initialState() {
  return {
    emails: [
      {
        id: 'work',
        name: '工作邮箱',
        address: 'work@example.com',
        enabled: true,
        linked: ['silicon', 'hn', 'funding'],
        autoLink: false,
        verified: 'verified',
        health: 'delivered',
        revision: 1,
      },
      {
        id: 'personal',
        name: '个人邮箱',
        address: 'reader@example.com',
        enabled: true,
        linked: ['silicon', 'podcast'],
        autoLink: false,
        verified: 'verified',
        health: 'delivered',
        revision: 1,
      },
    ],
    push: {
      id: 'push',
      name: 'App 推送',
      enabled: true,
      linked: ['silicon', 'hn', 'podcast'],
      autoLink: false,
    },
    permission: true,
    read: new Set(),
    seen: new Set(),
    filter: { app: 'all', web: 'all' },
    copies: [
      {
        key: 'work:1',
        endpoint: 'work',
        revision: 1,
        name: '工作邮箱',
        address: 'work@example.com',
        batches: ['single', 'multi'],
      },
      {
        key: 'personal:1',
        endpoint: 'personal',
        revision: 1,
        name: '个人邮箱',
        address: 'reader@example.com',
        batches: ['multi'],
      },
    ],
  };
}
function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        char
      ],
  );
}
function icon(name) {
  if (!Object.hasOwn(MAIL_ICONS, name)) throw new Error(`未知图标 ${name}`);
  return MAIL_ICONS[name];
}
function channel(id) {
  const found = CHANNELS.find((item) => item.id === id);
  if (!found) throw new Error('频道不存在');
  return found;
}
function batch(id) {
  const found = BATCHES.find((item) => item.id === id);
  if (!found) throw new Error('演示批次不存在');
  return found;
}
function endpoint(id) {
  if (id === 'push') return state.push;
  const found = state.emails.find((item) => item.id === id);
  if (!found) throw new Error('邮箱实例不存在');
  return found;
}
function copy() {
  const found = state.copies.find((item) => item.key === inbox);
  if (!found) throw new Error('邮件快照不存在');
  return found;
}
function avatar(id) {
  const c = channel(id);
  return `<span class="channel-avatar" style="background-position-y:-${(c.y * 32) / 104}px;--fill:${c.fill}" aria-hidden="true"></span>`;
}
function action(name, label, id = '', className = 'text-button', glyph = '') {
  return `<button class="${className}" data-action="${name}" data-id="${escapeHtml(id)}">${glyph ? icon(glyph) : ''}${label}</button>`;
}
function iconAction(name, label, id, glyph) {
  return `<button class="icon-button" data-action="${name}" data-id="${escapeHtml(id)}" title="${label}" aria-label="${label}">${icon(glyph)}</button>`;
}
function badge(text, tone = '') {
  return `<span class="badge ${tone}">${text}</span>`;
}
function toast(message) {
  clearTimeout(toastTimer);
  const el = document.querySelector('#toast');
  el.textContent = message;
  el.classList.add('visible');
  toastTimer = setTimeout(() => el.classList.remove('visible'), 3200);
}
function unread(category = 'all') {
  const records = [
    ['single', 'content'],
    ['multi', 'content'],
    ['reply', 'social'],
    ['alert', 'other'],
  ];
  return records.filter(
    ([id, cat]) =>
      !state.read.has(id) && (category === 'all' || category === cat),
  ).length;
}
function statusOf(item) {
  if (item.verified === 'pending') return badge('待验证', 'warn');
  if (item.verified === 'legacy_unknown')
    return badge('验证状态待确认', 'warn');
  return badge('已验证', 'good');
}
function endpointRow(item, mobile = false) {
  const push = item.id === 'push';
  const note = push
    ? `<div class="device-line ${state.permission ? '' : 'warning'}">${icon(state.permission ? 'CircleCheck' : 'CircleAlert')}<span>${state.permission ? (mobile ? '本机通知已授权' : '1 台设备可接收') : mobile ? '本机通知未授权 · 请前往系统设置' : '设备通知未授权 · 需在手机上开启'}</span></div>`
    : item.verified === 'pending'
      ? `<div class="inline-alert">${icon('CircleAlert')}<span>验证完成后接收内容邮件。${action('verify', '查看验证', item.id)}</span></div>`
      : item.verified === 'legacy_unknown'
        ? `<div class="inline-alert">${icon('CircleAlert')}<span>原有发送规则保持不变，等待验证迁移。</span></div>`
        : item.health === 'permanent_failure'
          ? `<div class="inline-alert">${icon('TriangleAlert')}<span>最近一封邮件退信，邮箱仍保持启用。${action('edit', '检查地址', item.id)}</span></div>`
          : '';
  return `<article class="endpoint-row" data-endpoint="${item.id}">
    <span class="endpoint-icon">${icon(push ? 'Smartphone' : 'Mail')}</span>
    <div><div class="tagline"><strong class="endpoint-name">${escapeHtml(item.name)}</strong>${push ? '' : statusOf(item)}${!item.enabled ? badge('已停用') : ''}</div>
    <div class="endpoint-address">${push ? '手机通知' : escapeHtml(item.address)}</div>
    <div class="endpoint-options">${action('links', `关联频道 <span class="muted">${item.linked.length}</span> ${icon('ChevronRight')}`, item.id)}
    ${item.autoLink === null ? '<span class="default-choice">新订阅关联：待迁移</span>' : `<label class="default-choice"><input type="checkbox" data-control="default" data-id="${item.id}" aria-label="${escapeHtml(item.name)}自动关联新订阅" ${item.autoLink ? 'checked' : ''}>自动关联新订阅</label>`}</div>${note}</div>
    <div class="endpoint-actions"><label class="enable-choice"><span>启用</span><input type="checkbox" data-control="enabled" data-id="${item.id}" aria-label="启用${escapeHtml(item.name)}" ${item.enabled ? 'checked' : ''}></label>
    ${push ? '' : `<div class="small-actions">${iconAction('test', `测试${escapeHtml(item.name)}`, item.id, 'Send')}${iconAction('edit', `编辑${escapeHtml(item.name)}`, item.id, 'Pencil')}${iconAction('delete', `移除${escapeHtml(item.name)}`, item.id, 'Trash2')}</div>`}</div>
  </article>`;
}
function settingsBody(mobile) {
  return `<div class="section-label">App 推送</div><div class="endpoint-list">${endpointRow(state.push, mobile)}</div>
    <div class="section-label">邮箱 · ${state.emails.length}</div><div class="endpoint-list">${state.emails.length ? state.emails.map((item) => endpointRow(item, mobile)).join('') : `<div class="empty-block">${icon('Mail')}<p>尚未添加邮箱</p>${action('add', '添加邮箱', '', 'text-button', 'Plus')}</div>`}</div>
    <div class="settings-bottom">${icon('ShieldCheck')}<span>内容邮箱停用不会影响站内通知、App 推送或既有的账户安全、账单与运行提醒邮件。</span></div>`;
}
function renderWeb() {
  const side = [
    ['账号', 'UserRound'],
    ['积分与用量', 'CreditCard'],
    ['偏好', 'SlidersHorizontal'],
    ['技能', 'Puzzle'],
    ['连接器', 'Plug'],
    ['CLI 凭证', 'Terminal'],
    ['通知渠道', 'Bell'],
  ];
  return `<div class="web-shell"><aside class="settings-sidebar"><div class="account"><span class="account-avatar">R</span><div><strong>Reader</strong><small>reader@example.com</small></div></div><div class="side-group"><small>账户与设置</small>${side.map(([label, glyph]) => `<div class="side-link ${label === '通知渠道' ? 'active' : ''}">${icon(glyph)}${label}</div>`).join('')}</div><div class="sidebar-foot"><a href="https://kimiguo1109.github.io/neodrop-notification-prototype/">返回通知页原型 ${icon('ArrowUpRight')}</a></div></aside>
    <section class="settings-content"><div class="heading-row"><div><h1>通知渠道</h1><p>选择在哪里接收已订阅频道的更新。</p></div>${action('add', '添加邮箱', '', 'button primary', 'Plus')}</div>${settingsBody(false)}<div class="scope-caption">${icon('Link')}已订阅 ${CHANNELS.length} 个频道</div></section></div>`;
}
function renderApp() {
  return `<div class="app-stage"><section class="phone" aria-label="App 通知渠道"><div class="statusbar">09:41<span>${icon('Wifi')}${icon('BatteryFull')}</span></div><div class="mobile-head">${iconAction('notices', '返回通知', '', 'ChevronLeft')}<h1>通知渠道</h1>${iconAction('add', '添加邮箱', '', 'Plus')}</div><div class="phone-body">${settingsBody(true)}</div><div class="home-indicator"></div></section>
  <aside class="sync-summary"><h2>当前账户配置</h2><p>Web 侧对应状态</p><div class="sync-line"><div>App 推送<small>${state.push.linked.length} 个关联频道</small></div>${badge(state.push.enabled ? '已启用' : '已停用', state.push.enabled ? 'good' : '')}</div>${state.emails.map((item) => `<div class="sync-line"><div>${escapeHtml(item.name)}<small>${escapeHtml(item.address)} · ${item.linked.length} 个频道</small></div>${badge(item.enabled ? '已启用' : '已停用', item.enabled ? 'good' : '')}</div>`).join('')}${action('web', '查看 Web 渠道', '', 'text-button', 'ArrowUpRight')}</aside></div>`;
}
function subject(b) {
  return `${b.articles[0].title}${b.articles.length > 1 ? ` + 其余 ${b.articles.length - 1} 篇` : ''} | ${channel(b.channel).name}`;
}
function renderEmail() {
  const currentCopy = copy();
  if (!currentCopy.batches.includes(mailId)) mailId = currentCopy.batches[0];
  const b = batch(mailId),
    c = channel(b.channel);
  const currentEndpoint = state.emails.find(
    (item) => item.id === currentCopy.endpoint,
  );
  const disabled =
    currentEndpoint &&
    currentEndpoint.revision === currentCopy.revision &&
    (!currentEndpoint.enabled || !currentEndpoint.linked.includes(c.id));
  return `<div class="mail-shell"><div class="mail-toolbar"><strong>${icon('Inbox')}收件箱</strong><label><span>收件邮箱</span><select id="mail-recipient">${state.copies.map((item) => `<option value="${item.key}" ${inbox === item.key ? 'selected' : ''}>${escapeHtml(item.address)}</option>`).join('')}</select></label></div>
    <div class="mail-layout"><aside class="inbox-list"><div class="inbox-heading"><span>今天</span><span>${currentCopy.batches.length} 封</span></div>${currentCopy.batches
      .map((id) => {
        const message = batch(id);
        return `<button class="inbox-message" data-action="mail" data-id="${id}" aria-current="${id === mailId}"><div class="inbox-from">Neodrop<time>${message.time}</time></div><h3>${message.title} · ${channel(message.channel).name}</h3><p>${escapeHtml(message.articles[0].title)}</p></button>`;
      })
      .join('')}</aside>
    <section class="email-detail"><div class="mail-envelope"><h1>${escapeHtml(subject(b))}</h1><div class="from-row"><img class="app-logo" src="neodrop-logo.png" alt="Neodrop"><div><strong>Neodrop</strong> <span class="muted">&lt;updates@neodrop.ai&gt;</span><small>发给 ${escapeHtml(currentCopy.address)} · 今天 ${b.time}</small></div></div></div>
    <div class="mail-paper-wrap"><article class="mail-paper"><div class="email-brand"><img src="neodrop-logo.png" alt="">Neodrop</div><div class="email-kicker">频道更新 · ${b.articles.length} 篇新内容</div><button class="channel-link" data-action="channel" data-id="${c.id}">${avatar(c.id)}${c.name}${icon('ChevronRight')}</button>
    ${b.articles.map((article, index) => `<section class="email-story">${b.articles.length > 1 ? `<div class="story-index">${String(index + 1).padStart(2, '0')}</div>` : ''}<h2>${escapeHtml(article.title)}</h2><p>${article.excerpt}</p>${action('article', '阅读内容', `${b.id}:${article.id}`, 'button primary', 'ArrowUpRight')}</section>`).join('')}
    <footer class="email-footer"><p>此邮件发送至 ${escapeHtml(currentCopy.address)}，因为你选择了接收「${c.name}」的更新。</p><div class="email-footer-actions">${action('manage-mail', '管理此邮箱', currentCopy.key, '')}${action('unsubscribe', '停止此频道邮件', `${currentCopy.key}:${c.id}`, '')}</div>${disabled ? '<p class="delivery-note">后续内容邮件已关闭，此封已收到的邮件仍然保留。</p>' : ''}</footer></article></div>
    <div class="mail-read-strip"><span>演示账户 · 站内未读 ${unread()} · 内容已看 ${state.seen.size} / 3</span>${action('notices', '查看两端通知', '', 'text-button', 'ArrowUpRight')}</div></section></div></div>`;
}
function renderNoticePanel(platform) {
  const active = state.filter[platform];
  const tabs = [
    ['all', '全部'],
    ['content', '新内容'],
    ['social', '互动'],
    ['other', '其他'],
  ];
  const show = (category) => active === 'all' || active === category;
  return `<section><h2>${icon(platform === 'app' ? 'Smartphone' : 'Monitor')}${platform === 'app' ? 'App' : 'Web'}</h2><div class="notice-panel" data-platform="${platform}"><div class="notice-head"><strong>通知</strong><div>${iconAction(platform, '通知渠道', '', 'Settings')}${iconAction('mark-all', '全部标为已读', '', 'CheckCheck')}</div></div><div class="notice-tabs">${tabs.map(([id, label]) => `<button data-action="filter" data-id="${platform}:${id}" aria-pressed="${active === id}">${label}<b>${unread(id)}</b></button>`).join('')}</div><div class="notice-day">今天</div>
    ${show('content') ? BATCHES.map((b) => `<article class="notice-record" data-record="${b.id}"><div class="notice-record-head">${avatar(b.channel)}<div><button class="channel-link" data-action="channel" data-id="${b.channel}"><strong>${channel(b.channel).name}</strong></button><small>${state.read.has(b.id) ? '通知已读' : '1 条未读通知'} · ${b.articles.length} 篇内容</small></div>${state.read.has(b.id) ? '' : '<span class="unread-dot" aria-label="未读"></span>'}</div>${b.articles.map((article) => `<div class="notice-story ${state.seen.has(article.id) ? 'seen' : ''}"><button data-action="article" data-id="${b.id}:${article.id}">${escapeHtml(article.title)}</button>${state.seen.has(article.id) ? badge('已看') : ''}</div>`).join('')}</article>`).join('') : ''}
    ${show('social') ? `<article class="notice-record" data-record="reply"><div class="notice-record-head"><span class="account-avatar">林</span><div><strong>林夏 回复了你的评论</strong><small>《上海梧桐区一日》</small></div>${state.read.has('reply') ? '' : '<span class="unread-dot" aria-label="未读"></span>'}</div><p>那家店周一休息，别白跑。</p>${action('notice-detail', '查看回复', 'reply')}</article>` : ''}
    ${show('other') ? `<article class="notice-record" data-record="alert"><div class="notice-record-head"><span class="endpoint-icon">${icon('TriangleAlert')}</span><div><strong>连续几期存在数据缺口</strong><small>硅谷101 访谈精华 · 运行提醒</small></div>${state.read.has('alert') ? '' : '<span class="unread-dot" aria-label="未读"></span>'}</div>${action('notice-detail', '查看运行', 'alert')}</article>` : ''}</div></section>`;
}
function render() {
  document.querySelector('#preview-tabs').innerHTML = Object.entries(
    VIEW_LABELS,
  )
    .map(
      ([id, [glyph, label]]) =>
        `<button data-action="view" data-id="${id}" ${view === id ? 'aria-current="page"' : ''}>${icon(glyph)}${label}</button>`,
    )
    .join('');
  root.innerHTML =
    view === 'web'
      ? renderWeb()
      : view === 'app'
        ? renderApp()
        : view === 'email'
          ? renderEmail()
          : `<div class="notification-stage">${renderNoticePanel('app')}${renderNoticePanel('web')}</div>`;
}
function setView(next) {
  view = next;
  history.replaceState(null, '', `#${next}`);
  render();
}
function showModal(title, content, actions = '') {
  modalContent.innerHTML = `<div class="modal-head"><h2 id="modal-title">${title}</h2>${iconAction('close', '关闭', '', 'X')}</div><div class="modal-body">${content}</div><div class="modal-actions">${actions || action('close', '完成', '', 'button primary')}</div>`;
  if (!modal.open) modal.showModal();
}
function editEmail(id) {
  const item = id ? endpoint(id) : null;
  modalState = { kind: 'editor', id };
  showModal(
    item ? '编辑邮箱' : '添加邮箱',
    `<form id="email-form"><label class="form-field">名称<input name="name" maxlength="40" required autocomplete="off" placeholder="例如：工作邮箱" value="${item ? escapeHtml(item.name) : ''}"></label><label class="form-field">邮箱地址<input type="email" name="address" maxlength="254" required autocomplete="off" placeholder="name@example.com" value="${item ? escapeHtml(item.address) : ''}"></label><p class="modal-copy">${item ? '修改地址后需重新验证。已有频道关联保留，不补发历史内容。' : '验证后可接收内容邮件。添加邮箱不会替换已有邮箱。'}</p><p id="form-error" class="form-error" role="alert"></p></form>`,
    `${action('close', '取消', '', 'button')}<button type="submit" form="email-form" class="button primary">${item ? '保存' : '添加并验证'}</button>`,
  );
}
function channelOptions(query = '') {
  const normalized = query.trim().toLowerCase();
  const filtered = CHANNELS.filter((item) =>
    item.name.toLowerCase().includes(normalized),
  );
  return filtered.length
    ? filtered
        .map(
          (item) =>
            `<label class="channel-option">${avatar(item.id)}<span class="name">${item.name}</span><input type="checkbox" data-draft-channel="${item.id}" aria-label="${item.name}" ${modalState.linked.has(item.id) ? 'checked' : ''}></label>`,
        )
        .join('')
    : '<div class="empty-block">没有匹配的已订阅频道</div>';
}
function openLinks(id) {
  const item = endpoint(id);
  modalState = { kind: 'links', id, linked: new Set(item.linked) };
  showModal(
    '关联频道',
    `<p class="modal-copy" style="margin-bottom:17px">${escapeHtml(item.name)}${id === 'push' ? '' : ` · ${escapeHtml(item.address)}`}</p><label class="search-field">${icon('Search')}<input type="search" id="channel-search" placeholder="搜索已订阅频道" aria-label="搜索已订阅频道"></label><div class="selection-meta"><span id="selected-count">已选 ${item.linked.length} / ${CHANNELS.length}</span><span>${action('select-all', '全选')}${action('select-none', '全不选')}</span></div><div id="channel-options">${channelOptions()}</div>`,
    `${action('close', '取消', '', 'button')}${action('save-links', '完成', '', 'button primary')}`,
  );
}
function updateLinkList() {
  document.querySelector('#channel-options').innerHTML = channelOptions(
    document.querySelector('#channel-search').value,
  );
  document.querySelector('#selected-count').textContent =
    `已选 ${modalState.linked.size} / ${CHANNELS.length}`;
}
function verifyEmail(id) {
  const item = endpoint(id);
  showModal(
    '验证邮箱',
    `<p class="modal-copy">验证邮件已提交至 <strong>${escapeHtml(item.address)}</strong>。完成地址验证后，此邮箱才能开始接收内容更新。</p><div class="demo-verification"><span>演示操作 · 不发送真实邮件</span>${action('simulate-verify', '模拟验证成功', id, 'button')}</div>`,
    `${action('resend', '重新发送', id, 'button')}${action('close', '关闭', '', 'button primary')}`,
  );
}
function openArticle(value) {
  const [batchId, articleId] = value.split(':');
  const b = batch(batchId),
    article = b.articles.find((item) => item.id === articleId);
  if (!article) throw new Error('内容不属于该批次');
  state.read.add(batchId);
  state.seen.add(articleId);
  render();
  showModal(
    '内容',
    `<article class="article-landing"><button class="channel-link" data-action="channel" data-id="${b.channel}">${avatar(b.channel)}${channel(b.channel).name}</button><h3>${escapeHtml(article.title)}</h3><p>${article.excerpt}</p><div class="demo-verification"><span>内容落点示意 · 摘要为演示文案</span>${badge('本篇已看', 'good')}</div></article>`,
    `${action('close', '返回', '', 'button')}${action('go-notices', '查看通知状态', '', 'button primary')}`,
  );
}
function openChannel(id) {
  const c = channel(id),
    contents = BATCHES.filter((b) => b.channel === id);
  showModal(
    c.name,
    `<div class="tagline">${avatar(id)}${badge('已订阅', 'good')}</div><div class="modal-link-list">${contents.flatMap((b) => b.articles.map((article) => action('article', escapeHtml(article.title), `${b.id}:${article.id}`, ''))).join('')}</div>`,
  );
}
function openUnsubscribe(value) {
  const [endpointId, revision, channelId] = value.split(':');
  const snapshot = state.copies.find(
    (item) =>
      item.endpoint === endpointId && item.revision === Number(revision),
  );
  const item = state.emails.find((entry) => entry.id === endpointId);
  if (!snapshot) throw new Error('邮件来源快照缺失');
  if (!item || item.revision !== snapshot.revision) {
    showModal(
      '此邮件的管理链接已失效',
      '<p class="modal-copy">邮箱已移除或地址已修改。旧邮件不会改变新地址的通知设置。</p>',
    );
    return;
  }
  modalState = {
    kind: 'unsubscribe',
    id: item.id,
    revision: snapshot.revision,
    channelId,
  };
  showModal(
    '邮件接收偏好',
    `<p class="modal-copy">${escapeHtml(snapshot.address)}</p><label class="radio-option"><input type="radio" name="unsubscribe-scope" value="channel" checked><span>停止「${channel(channelId).name}」的邮件<small>仅取消当前邮箱与此频道的关联。</small></span></label><label class="radio-option"><input type="radio" name="unsubscribe-scope" value="endpoint"><span>停止此邮箱的全部内容邮件<small>保留频道关联，之后可重新启用。</small></span></label><p class="modal-copy" style="margin-top:16px">频道订阅、其他邮箱、App 推送及账户安全和交易邮件不受影响。</p>`,
    `${action('close', '取消', '', 'button')}${action('confirm-unsubscribe', '确认停止', '', 'button primary')}`,
  );
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const { action: name, id } = button.dataset;
  if (name === 'close') {
    modal.close();
    return;
  }
  if (name === 'view') {
    setView(id);
    return;
  }
  if (['web', 'app', 'notices', 'email'].includes(name)) {
    setView(name);
    return;
  }
  if (name === 'add' || name === 'edit') {
    editEmail(name === 'add' ? '' : id);
    return;
  }
  if (name === 'links') {
    openLinks(id);
    return;
  }
  if (name === 'save-links') {
    endpoint(modalState.id).linked = [...modalState.linked];
    modal.close();
    render();
    toast('频道关联已保存');
    return;
  }
  if (name === 'select-all' || name === 'select-none') {
    modalState.linked = new Set(
      name === 'select-all' ? CHANNELS.map((item) => item.id) : [],
    );
    updateLinkList();
    return;
  }
  if (name === 'delete') {
    const item = endpoint(id);
    showModal(
      '移除邮箱？',
      `<p class="modal-copy">移除 <strong>${escapeHtml(item.address)}</strong> 后，该邮箱不再接收内容更新。已收到的邮件和产品内的频道订阅仍然保留。</p>`,
      `${action('close', '取消', '', 'button')}${action('confirm-delete', '移除邮箱', id, 'button danger')}`,
    );
    return;
  }
  if (name === 'confirm-delete') {
    state.emails = state.emails.filter((item) => item.id !== id);
    modal.close();
    render();
    toast('邮箱已移除，其他渠道不受影响');
    return;
  }
  if (name === 'verify') {
    verifyEmail(id);
    return;
  }
  if (name === 'resend') {
    toast('验证邮件已重新提交（模拟）');
    return;
  }
  if (name === 'simulate-verify') {
    endpoint(id).verified = 'verified';
    modal.close();
    render();
    toast('模拟验证完成，不补发历史邮件');
    return;
  }
  if (name === 'test') {
    const item = endpoint(id);
    if (item.verified !== 'verified') {
      verifyEmail(id);
      return;
    }
    showModal(
      '测试邮件',
      `<p class="modal-copy">发送至 <strong>${escapeHtml(item.address)}</strong>，不会增加站内通知或修改内容已看。</p><div class="demo-verification">本次操作仅模拟提供商接受，不发送真实邮件。</div>`,
      `${action('close', '取消', '', 'button')}${action('simulate-test', '提交测试', id, 'button primary')}`,
    );
    return;
  }
  if (name === 'simulate-test') {
    showModal(
      '测试已提交',
      `<div class="success-mark">${icon('Check')}</div><p class="modal-copy">提供商已接受测试请求（模拟），尚未收到送达回执。请检查收件箱。</p>`,
    );
    return;
  }
  if (name === 'mail') {
    mailId = id;
    render();
    return;
  }
  if (name === 'article') {
    openArticle(id);
    return;
  }
  if (name === 'channel') {
    openChannel(id);
    return;
  }
  if (name === 'go-notices') {
    modal.close();
    setView('notices');
    return;
  }
  if (name === 'filter') {
    const [platform, filter] = id.split(':');
    state.filter[platform] = filter;
    render();
    return;
  }
  if (name === 'mark-all') {
    for (const recordId of ['single', 'multi', 'reply', 'alert'])
      state.read.add(recordId);
    render();
    toast('通知已全部标读，内容已看状态保持不变');
    return;
  }
  if (name === 'notice-detail') {
    state.read.add(id);
    render();
    showModal(
      id === 'reply' ? '评论回复' : '运行详情',
      `<p class="modal-copy">${id === 'reply' ? '林夏：那家店周一休息，别白跑。' : '硅谷101 访谈精华：连续几期存在数据缺口，运行提醒尚未处理。'}</p>`,
    );
    return;
  }
  if (name === 'manage-mail') {
    const snapshot = state.copies.find((item) => item.key === id);
    const item = state.emails.find((entry) => entry.id === snapshot.endpoint);
    if (!item || item.revision !== snapshot.revision) {
      showModal(
        '此邮件的管理链接已失效',
        '<p class="modal-copy">邮箱已移除或地址已修改，请从当前账户的通知渠道管理。</p>',
      );
      return;
    }
    setView('web');
    openLinks(item.id);
    return;
  }
  if (name === 'unsubscribe') {
    openUnsubscribe(id);
    return;
  }
  if (name === 'confirm-unsubscribe') {
    const item = endpoint(modalState.id);
    if (item.revision !== modalState.revision)
      throw new Error('演示邮箱地址版本冲突');
    const all =
      document.querySelector('input[name=unsubscribe-scope]:checked').value ===
      'endpoint';
    if (all) item.enabled = false;
    else
      item.linked = item.linked.filter(
        (channelId) => channelId !== modalState.channelId,
      );
    render();
    showModal(
      '接收偏好已更新',
      `<div class="success-mark">${icon('Check')}</div><p class="modal-copy">${all ? '此邮箱的全部后续内容邮件已停止。' : '此邮箱不再接收该频道的后续内容邮件。'}其他邮箱、App 推送和站内通知保持不变。</p>`,
    );
    return;
  }
});
document.addEventListener('change', (event) => {
  const el = event.target;
  if (el.matches('[data-control]')) {
    const item = endpoint(el.dataset.id);
    if (el.dataset.control === 'enabled') {
      item.enabled = el.checked;
      toast(
        item.enabled ? '已启用，不补发历史内容' : '已停用，频道关联保持不变',
      );
    } else {
      item.autoLink = el.checked;
      toast('新订阅偏好已保存，已有频道关联不变');
    }
    render();
  }
  if (el.matches('[data-draft-channel]')) {
    if (el.checked) modalState.linked.add(el.dataset.draftChannel);
    else modalState.linked.delete(el.dataset.draftChannel);
    document.querySelector('#selected-count').textContent =
      `已选 ${modalState.linked.size} / ${CHANNELS.length}`;
  }
  if (el.id === 'mail-recipient') {
    inbox = el.value;
    render();
  }
});
document.addEventListener('input', (event) => {
  if (event.target.id === 'channel-search')
    document.querySelector('#channel-options').innerHTML = channelOptions(
      event.target.value,
    );
});
document.addEventListener('submit', (event) => {
  if (event.target.id !== 'email-form') return;
  event.preventDefault();
  const data = new FormData(event.target),
    name = String(data.get('name')).trim(),
    address = String(data.get('address')).trim();
  if (!name || !address) {
    document.querySelector('#form-error').textContent =
      '请填写名称和邮箱地址。';
    return;
  }
  if (
    state.emails.some(
      (item) =>
        item.id !== modalState.id &&
        item.address.toLowerCase() === address.toLowerCase(),
    )
  ) {
    document.querySelector('#form-error').textContent =
      '该邮箱已添加，请编辑已有邮箱。';
    return;
  }
  let needsVerification = false,
    id = modalState.id;
  if (id) {
    const item = endpoint(id);
    item.name = name;
    if (item.address.toLowerCase() !== address.toLowerCase()) {
      item.address = address;
      item.revision += 1;
      item.verified = 'pending';
      item.health = 'unknown';
      needsVerification = true;
    }
  } else {
    id = crypto.randomUUID();
    state.emails.push({
      id,
      name,
      address,
      enabled: true,
      linked: [],
      autoLink: false,
      verified: 'pending',
      health: 'unknown',
      revision: 1,
    });
    needsVerification = true;
  }
  render();
  if (needsVerification) verifyEmail(id);
  else {
    modal.close();
    toast('邮箱已保存');
  }
});
document.querySelector('#scenario').addEventListener('change', (event) => {
  state = initialState();
  inbox = 'work:1';
  mailId = 'single';
  const scenario = event.target.value;
  if (scenario === 'pending') state.emails[0].verified = 'pending';
  if (scenario === 'failure') state.emails[0].health = 'permanent_failure';
  if (scenario === 'permission') state.permission = false;
  if (scenario === 'legacy') {
    state.emails[0].verified = 'legacy_unknown';
    state.emails[0].autoLink = null;
  }
  if (!['web', 'app'].includes(view)) setView('web');
  else render();
});
document.querySelector('#reset').innerHTML = icon('RotateCcw');
document.querySelector('#reset').addEventListener('click', () => {
  state = initialState();
  inbox = 'work:1';
  mailId = 'single';
  document.querySelector('#scenario').value = 'normal';
  if (modal.open) modal.close();
  render();
  toast('已重置演示账户');
});
window.addEventListener('hashchange', () => {
  const next = location.hash.slice(1);
  if (Object.hasOwn(VIEW_LABELS, next)) {
    view = next;
    render();
  }
});
state = initialState();
render();
