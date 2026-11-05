/* ИИ-штат · сайт Алёны Литвиновой */

// Приёмник заявок: вебхук CRM с серверами в России (152-ФЗ). Пусто — форма предложит записаться через Telegram.
const FORM_ENDPOINT = '';
// Ссылка на бота. Пока бота нет — ведём в канал.
const BOT_URL = 'https://t.me/m360_iishtat_bot';
const BOT_HAS_START = true; // true, когда BOT_URL — бот и понимает ?start=
const METRIKA_ID = null; // [ID счётчика]

// Практикум «ИИ-штат за 3 вечера», время московское
const PRACTICUM = [
  { start: '2026-12-01T19:00:00+03:00', end: '2026-12-01T21:00:00+03:00' },
  { start: '2026-12-02T19:00:00+03:00', end: '2026-12-02T21:00:00+03:00' },
  { start: '2026-12-03T19:00:00+03:00', end: '2026-12-03T21:00:00+03:00' }
];

const STAFF = [
  ['Ассистент руководителя', 'Знает ваш бизнес: база знаний о компании, правила безопасной работы, библиотека запросов'],
  ['Маркетолог-аналитик', 'Портрет клиента, разбор отзывов, таблица конкурентов'],
  ['Копирайтер', 'Оффер, продающие тексты, объявления для Авито'],
  ['Контент-менеджер', 'Контент-план на месяц, посты, сценарии Reels'],
  ['Дизайнер и видеограф', 'Картинки, короткие видео, ИИ-аватар'],
  ['Менеджер по заявкам', 'Ответы клиентам и простой бот в Telegram: пост → диалог → клиент'],
  ['Продвиженец в нейросетях', 'Чтобы Алиса и ChatGPT знали и рекомендовали ваш бизнес'],
  ['Руководитель ИИ-штата', 'Все сотрудники собраны в систему: регламент на неделю и план внедрения на 30 дней']
];

const motion = document.documentElement.classList.contains('motion');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function goal(name) {
  if (METRIKA_ID && typeof window.ym === 'function') window.ym(METRIKA_ID, 'reachGoal', name);
}
document.addEventListener('click', e => {
  const g = e.target.closest('[data-goal]');
  if (g) goal(g.dataset.goal);
});

function botLink(start) {
  const label = { practicum: 'praktikum_site', praktikum: 'praktikum_site' }[start] || start;
  return BOT_HAS_START ? `${BOT_URL}?start=${label}` : BOT_URL;
}

/* ---------- штатное расписание ---------- */
const rows = $('#rows');
if (rows) {
  rows.innerHTML = STAFF.map(([pos, does], i) => `
    <div class="row" role="row">
      <div class="row__n num" role="cell">${i + 1}</div>
      <div class="row__pos" role="cell"><b>${pos}</b><small>неделя ${i + 1}</small></div>
      <div class="row__does" role="cell">${does}</div>
      <div class="row__st" role="cell"><span class="row__vac">вакансия</span><span class="stamp" aria-label="Принят">ПРИНЯТ<small>неделя ${i + 1}</small></span></div>
    </div>`).join('');

  const list = $$('.row', rows);
  if (!motion || !('IntersectionObserver' in window)) {
    list.forEach(r => r.classList.add('is-hired'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('is-hired'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -38% 0px' });
    list.forEach(r => io.observe(r));
  }
}

/* ---------- счётчики ---------- */
function fmt(n, dec) {
  return n.toLocaleString('ru-RU', { minimumFractionDigits: dec, maximumFractionDigits: dec }).replace(/ /g, ' ');
}
const counters = $$('[data-count]');
if (motion && counters.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const el = en.target, to = parseFloat(el.dataset.count);
      const dec = (el.dataset.count.split('.')[1] || '').length;
      const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
      const t0 = performance.now(), dur = 1400;
      const step = t => {
        const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + fmt(to * e, dec) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: .6 });
  counters.forEach(c => io.observe(c));
}

/* ---------- формы ---------- */
const UTM = (() => {
  const q = new URLSearchParams(location.search), o = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(k => { o[k] = q.get(k) || ''; });
  return o;
})();

const COPY = {
  practicum: { title: 'Запись на практикум', sub: '1–3 декабря, 19:00 мск. Бесплатно.', btn: 'Зарегистрироваться бесплатно' },
  audit: { title: 'ИИ-аудит с Алёной', sub: '60 минут лично. 3 000 ₽ засчитываются при покупке курса.', btn: 'Отправить заявку' },
  tariff70: { title: 'ИИ-штат · 70 000 ₽', sub: 'Старт потока 7 декабря. Сначала 30 минут созвона с Алёной: разберёте ваш бизнес, решите, подходит ли формат, и обсудите рассрочку.', btn: 'Записаться на созвон' },
  tariff120: { title: 'ИИ-штат + наставник · 120 000 ₽', sub: 'Старт потока 7 декабря. Сначала 30 минут созвона с Алёной: разберёте ваш бизнес, решите, подходит ли формат, и обсудите рассрочку.', btn: 'Записаться на созвон' }
};

function maskPhone(input) {
  input.addEventListener('input', () => {
    let d = input.value.replace(/\D/g, '');
    if (d.startsWith('8')) d = '7' + d.slice(1);
    if (d && !d.startsWith('7')) d = '7' + d;
    d = d.slice(0, 11);
    const p = d.slice(1);
    let out = d ? '+7' : '';
    if (p.length) out += ' (' + p.slice(0, 3);
    if (p.length >= 3) out += ')';
    if (p.length > 3) out += ' ' + p.slice(3, 6);
    if (p.length > 6) out += '-' + p.slice(6, 8);
    if (p.length > 8) out += '-' + p.slice(8, 10);
    input.value = out;
  });
}

function successHTML(source) {
  if (source === 'practicum') {
    return `<h3>Вы зарегистрированы</h3>
      <p>Ссылку на эфир пришлём за час до начала — на телефон или в Telegram. Три вечера: 1, 2 и 3 декабря в 19:00 по Москве.</p>
      <div class="btns">
        <a class="btn" href="assets/practicum.ics" download>Добавить в календарь</a>
        <a class="btn btn--line" href="${botLink('praktikum')}" target="_blank" rel="noopener">Получать напоминания в Telegram</a>
      </div>`;
  }
  return `<h3>Спасибо!</h3>
    <p>Алёна или менеджер свяжется с вами в течение дня.</p>
    <div class="btns"><a class="btn btn--line" href="${botLink(source)}" target="_blank" rel="noopener">Написать в Telegram</a></div>`;
}

// Пока нет приёмника заявок (и документов по 152-ФЗ), телефоны не собираем: ведём в Telegram
function mountTelegram(slot, source) {
  const call = source.startsWith('tariff') || source === 'audit';
  const text = BOT_HAS_START
    ? (call ? 'Запись на созвон идёт в Telegram-боте М360: откройте его, выберите удобное время, и Алёна подтвердит.' : 'Запись идёт в Telegram-боте М360: откройте его и нажмите «Записаться». Напоминания придут туда же.')
    : (call ? 'Запись на созвон откроется 11 ноября в Telegram. Подпишитесь на канал Алёны: ссылку опубликуем там первой.' : 'Запись откроется 11 ноября в Telegram. Подпишитесь на канал Алёны: ссылку опубликуем там первой.');
  const box = document.createElement('div');
  box.className = 'form';
  box.innerHTML = `<p style="margin:0">${text}</p>
    <a class="btn" href="${botLink(source)}" target="_blank" rel="noopener" data-goal="click_tg_${source}">${BOT_HAS_START ? (call ? 'Выбрать время в Telegram' : 'Записаться в Telegram') : 'Открыть канал Алёны'}</a>`;
  slot.replaceChildren(box);
  return box;
}

function mountForm(slot, source) {
  if (!FORM_ENDPOINT) return mountTelegram(slot, source);
  const form = $('#form-tpl').content.firstElementChild.cloneNode(true);
  const c = COPY[source] || COPY.audit;
  $('button[type="submit"]', form).textContent = c.btn;
  $('[data-bot]', form).href = botLink(source);
  maskPhone($('[name="phone"]', form));
  slot.replaceChildren(form);

  const setErr = (name, msg) => {
    const el = $(`[data-err="${name}"]`, form), inp = $(`[name="${name}"]`, form);
    el.textContent = msg || '';
    if (inp) inp.setAttribute('aria-invalid', msg ? 'true' : 'false');
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get('name') || '').trim();
    const digits = (fd.get('phone') || '').replace(/\D/g, '');
    let ok = true;
    setErr('name', name ? '' : 'Напишите, как к вам обращаться'); if (!name) ok = false;
    const phoneOk = digits.length === 11;
    setErr('phone', phoneOk ? '' : 'Нужен номер из 11 цифр, например +7 912 345-67-89'); if (!phoneOk) ok = false;
    const consent = !!fd.get('consent');
    setErr('consent', consent ? '' : 'Без согласия на обработку данных мы не можем принять заявку'); if (!consent) ok = false;
    if (!ok) { $('[aria-invalid="true"]', form)?.focus(); return; }

    const fail = $('.form__fail', form), btn = $('button[type="submit"]', form);
    fail.classList.remove('on');
    const payload = {
      source, name, phone: '+' + digits, telegram: (fd.get('tg') || '').trim(),
      consent_pd: true, consent_news: !!fd.get('news'),
      ...UTM, page: location.href, sent_at: new Date().toISOString()
    };
    btn.disabled = true;
    try {
      if (!FORM_ENDPOINT) throw new Error('no endpoint');
      const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      $('.form__msg', form).innerHTML = successHTML(source);
      form.classList.add('is-sent');
      goal('lead_' + source);
    } catch (err) {
      fail.innerHTML = `Не получилось отправить. Запишитесь через Telegram или попробуйте ещё раз. <a href="${botLink(source)}" target="_blank" rel="noopener">Открыть Telegram</a>`;
      fail.classList.add('on');
    } finally {
      btn.disabled = false;
    }
  });
  return form;
}

// встроенные формы (страница практикума)
$$('[data-inline-form]').forEach(slot => mountForm(slot, slot.dataset.inlineForm));

// всплывающее окно
const modal = $('#modal');
let opener = null;
function openModal(source, btn) {
  const c = COPY[source] || COPY.audit;
  $('#m-title').textContent = c.title;
  $('#m-sub').textContent = c.sub;
  mountForm($('[data-form-slot]', modal), source);
  opener = btn;
  modal.classList.add('on');
  document.body.style.overflow = 'hidden';
  ($('input', modal) || $('[data-form-slot] a', modal))?.focus();
}
function closeModal() {
  modal.classList.remove('on');
  document.body.style.overflow = '';
  opener?.focus();
}
if (modal) {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-open]');
    if (b) openModal(b.dataset.open, b);
  });
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('on')) closeModal(); });
}

/* ---------- обратный отсчёт практикума ---------- */
const cd = $('#countdown');
if (cd) {
  const state = $('#count-state');
  const cells = { d: $('[data-cd="d"]', cd), h: $('[data-cd="h"]', cd), m: $('[data-cd="m"]', cd) };
  const days = ['первый', 'второй', 'третий'];
  const tick = () => {
    const now = Date.now();
    const live = PRACTICUM.findIndex(p => now >= Date.parse(p.start) && now < Date.parse(p.end));
    const next = PRACTICUM.findIndex(p => now < Date.parse(p.start));
    if (live >= 0) {
      cd.hidden = true; state.hidden = false;
      state.textContent = `Идёт ${days[live]} вечер практикума`;
      return;
    }
    if (next < 0) {
      cd.hidden = true; state.hidden = false;
      state.textContent = 'Практикум прошёл. Запишитесь на ИИ-аудит или в поток 7 декабря на главной странице.';
      return;
    }
    const left = Date.parse(PRACTICUM[next].start) - now;
    cells.d.textContent = Math.floor(left / 864e5);
    cells.h.textContent = String(Math.floor(left / 36e5) % 24).padStart(2, '0');
    cells.m.textContent = String(Math.floor(left / 6e4) % 60).padStart(2, '0');
    const lbl = $('#count-label');
    if (lbl) lbl.textContent = next === 0 ? 'До первого вечера' : `До ${['', 'второго', 'третьего'][next]} вечера`;
  };
  tick();
  setInterval(tick, 30000);
}
