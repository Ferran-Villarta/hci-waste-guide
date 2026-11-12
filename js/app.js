/*
 * App: routing (the part of the address after #), clicks, forms, dialogs, the "saved" animation.
 * Screens are drawn by js/ui.js. Saved data is kept by js/store.js. Search is in js/search.js.
 */
(function () {
  'use strict';

  var D = window.WGW_DATA;
  var CFG = window.WGW_CONFIG || {};
  var S = window.WGW_STORE;
  var Search = window.WGW_SEARCH;
  var UI = window.WGW_UI;

  var byId = {};
  D.ITEMS.forEach(function (it) { byId[it.id] = it; });

  var app = document.getElementById('app');
  var toastEl = document.getElementById('toast');
  var modalEl = document.getElementById('modal');

  var navCount = 0; // pages visited inside the app (so "Back" knows if history.back() is safe)
  var pendingFly = false; // run the "saved" animation after the next render
  var pendingChoice = {}; // option picked on an item that is not saved yet
  var toastTimer = null;
  var toastUndo = null;
  var lastFocus = null;
  var suggestTimer = null;

  // ---------- helpers ----------

  function ctx() {
    return {
      data: D,
      byId: byId,
      savedCount: S.getSaved().filter(function (e) { return byId[e.id]; }).length,
      autosave: S.getAutosave(),
      recent: S.getRecent(),
      storageOk: S.isPersistent(),
    };
  }

  function parseHash() {
    var h = location.hash.replace(/^#/, '') || '/';
    var qi = h.indexOf('?');
    var path = qi < 0 ? h : h.slice(0, qi);
    var params = {};
    (qi < 0 ? '' : h.slice(qi + 1)).split('&').forEach(function (pair) {
      if (!pair) return;
      var kv = pair.split('=');
      try {
        params[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
      } catch (e) { /* ignore a broken piece */ }
    });
    return { path: path, params: params, parts: path.split('/').filter(Boolean) };
  }

  function go(hash) {
    if (location.hash === hash) route(); // same address: the browser sends no event
    else location.hash = hash;
  }

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  // ---------- toast ----------

  function toast(message, undoFn) {
    toastUndo = undoFn || null;
    toastEl.innerHTML = '<span>' + UI.esc(message) + '</span>' +
      (undoFn ? '<button type="button" class="toast-btn" data-action="toast-undo">Undo</button>' : '');
    toastEl.hidden = false;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, undoFn ? 6000 : 3000);
  }

  function hideToast() {
    toastEl.classList.remove('is-on');
    toastEl.hidden = true;
    toastUndo = null;
  }

  // ---------- dialogs ----------

  function openModal(html) {
    if (modalEl.hidden) lastFocus = document.activeElement; // remember where to return to
    modalEl.innerHTML = html;
    modalEl.hidden = false;
    document.body.classList.add('has-modal');
    // Text fields first; otherwise the first button (the safe one: Cancel / OK).
    var focusTarget = modalEl.querySelector('.dialog input, .dialog textarea') || modalEl.querySelector('.dialog button');
    if (focusTarget) focusTarget.focus();
  }

  function closeModal() {
    if (modalEl.hidden) return;
    modalEl.hidden = true;
    modalEl.innerHTML = '';
    document.body.classList.remove('has-modal');
    if (lastFocus && document.contains(lastFocus) && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  }

  // ---------- routes ----------

  function savedRows() {
    return S.getSaved()
      .filter(function (e) { return byId[e.id]; })
      .map(function (e) { return { item: byId[e.id], entry: e }; });
  }

  function renderSearch(q) {
    var query = q.trim();
    var results = query ? Search.search(query, D.ITEMS) : [];
    var suggestion = query && !results.length ? Search.suggest(query, D.ITEMS) : null;
    if (results.length) S.addRecent(query);
    return UI.searchPage(ctx(), query, results, suggestion);
  }

  function renderItem(id, fresh) {
    var item = byId[id];
    if (!item) return UI.notFoundPage(ctx(), 'Item not found');
    // Opening a one-answer item saves it (if "save items when I open them" is on).
    if (fresh && !item.options && S.getAutosave() && !S.isSaved(id)) {
      S.save(id, null);
      pendingFly = true;
    }
    return UI.itemPage(ctx(), item, S.getEntry(id), pendingChoice[id]);
  }

  var TITLES = { az: 'A–Z list', categories: 'Categories', saved: 'Saved' };

  function render(opts) {
    opts = opts || {};
    var r = parseHash();
    var p = r.parts;
    var html;
    var title = 'What Goes Where (prototype)';

    switch (p[0]) {
      case undefined:
        html = UI.home(ctx());
        break;
      case 'search':
        html = renderSearch(r.params.q || '');
        title = 'Search – ' + title;
        break;
      case 'item':
        html = renderItem(p[1], !opts.keep);
        if (byId[p[1]]) title = byId[p[1]].name + ' – ' + title;
        break;
      case 'saved':
        html = UI.savedPage(ctx(), savedRows());
        title = 'Saved – ' + title;
        break;
      case 'az':
        html = UI.azPage(ctx());
        title = TITLES.az + ' – ' + title;
        break;
      case 'categories':
        html = UI.categoriesPage(ctx());
        title = TITLES.categories + ' – ' + title;
        break;
      case 'category':
        var cat = D.CATEGORIES.filter(function (c) { return c.id === p[1]; })[0];
        html = cat
          ? UI.categoryPage(ctx(), cat, D.ITEMS.filter(function (it) { return it.category === cat.id; }))
          : UI.notFoundPage(ctx(), 'Category not found');
        if (cat) title = cat.name + ' – ' + title;
        break;
      case 'bin':
        html = D.BINS[p[1]]
          ? UI.binPage(ctx(), p[1], D.ITEMS.filter(function (it) {
              return it.options
                ? it.options.some(function (o) { return o.bin === p[1]; })
                : it.bin === p[1];
            }))
          : UI.notFoundPage(ctx(), 'Cart not found');
        break;
      default:
        html = UI.notFoundPage(ctx());
    }

    app.innerHTML = html;
    document.title = title;
    if (!opts.keep) window.scrollTo(0, 0);
    afterRender(r, opts);
  }

  function route() {
    closeModal();
    render({});
  }

  function afterRender(r, opts) {
    // Search page with nothing typed yet ("Next item"): ready to type.
    if (r.parts[0] === 'search' && !(r.params.q || '').trim()) {
      var q = document.getElementById('q');
      if (q && !opts.keep) q.focus({ preventScroll: true });
    }
    if (opts.focusAnswer) {
      var a = app.querySelector('[data-focus="answer"]');
      if (a) a.focus({ preventScroll: true });
    }
    if (pendingFly) {
      pendingFly = false;
      celebrateSave();
    }
  }

  // ---------- saved animation ----------

  function pulse(el) {
    if (!el) return;
    el.classList.remove('pulse');
    void el.offsetWidth; // restart the CSS animation
    el.classList.add('pulse');
  }

  function celebrateSave() {
    var chip = document.getElementById('save-chip');
    var target = document.getElementById('saved-link');
    if (!chip || !target) return;

    if (!CFG.SAVE_ANIMATION || prefersReducedMotion() || !chip.animate) {
      pulse(target);
      toast('Saved. Find it under Saved.');
      return;
    }
    var a = chip.getBoundingClientRect();
    var b = target.getBoundingClientRect();
    var sx = a.left + 24;
    var sy = a.top + a.height / 2;
    var dx = b.left + b.width / 2 - sx;
    var dy = b.top + b.height / 2 - sy;

    var dot = document.createElement('div');
    dot.className = 'fly';
    dot.innerHTML = UI.icon('bookmark', 18);
    dot.style.left = sx - 16 + 'px';
    dot.style.top = sy - 16 + 'px';
    document.body.appendChild(dot);

    var anim = dot.animate(
      [
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: 'translate(' + dx * 0.45 + 'px, ' + (dy * 0.45 + 40) + 'px) scale(1.25)', opacity: 1, offset: 0.45 },
        { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(0.6)', opacity: 0.9 },
      ],
      { duration: 750, easing: 'cubic-bezier(.4, 0, .2, 1)' }
    );
    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      dot.remove();
      pulse(target);
    }
    anim.onfinish = finish;
    anim.oncancel = finish;
    setTimeout(finish, 1500); // safety net: never leave the dot behind (e.g. a background tab pauses animations)
  }

  function updateBadge() {
    var n = ctx().savedCount;
    var badge = document.getElementById('saved-count');
    var link = document.getElementById('saved-link');
    if (badge) {
      badge.textContent = n;
      badge.hidden = !n;
    }
    if (link) link.setAttribute('aria-label', 'Saved items, ' + n + ' saved');
  }

  S.onChange(updateBadge);

  // ---------- actions ----------

  function onAction(e, el) {
    var action = el.getAttribute('data-action');
    var id = el.getAttribute('data-id');

    switch (action) {
      case 'back':
        e.preventDefault();
        if (navCount > 0) history.back();
        else go(el.getAttribute('data-fallback') || '#/');
        break;

      case 'skip':
        e.preventDefault();
        var main = document.getElementById('main');
        if (main) main.focus();
        break;

      case 'stub':
        openModal(UI.stubDialog(el.getAttribute('data-stub')));
        break;

      case 'photo':
        openModal(UI.photoDialog());
        break;

      case 'photo-demo':
        closeModal();
        toast('Demo only. Photo search is not built yet.');
        break;

      case 'report':
        openModal(UI.reportDialog(el.getAttribute('data-q') || '', ''));
        break;

      case 'close-modal':
        closeModal();
        break;

      case 'choose':
        var choice = parseInt(el.getAttribute('data-choice'), 10);
        pendingChoice[id] = choice;
        if (S.getAutosave() || S.isSaved(id)) {
          var wasSaved = S.isSaved(id);
          S.save(id, choice);
          if (!wasSaved) pendingFly = true;
        }
        render({ keep: true, focusAnswer: true });
        break;

      case 'save':
        var it = byId[id];
        var c = it && it.options ? pendingChoice[id] : null;
        S.save(id, c == null ? null : c);
        pendingFly = true;
        render({ keep: true });
        break;

      case 'unsave':
        var removed = S.unsave(id);
        render({ keep: true });
        toast('Removed from Saved.', removed ? function () {
          S.restore(removed);
          render({ keep: true });
        } : null);
        break;

      case 'toast-undo':
        var fn = toastUndo;
        hideToast();
        if (fn) fn();
        break;

      case 'remove-sorted':
        var n = S.removeSorted();
        render({ keep: true });
        toast(n + (n === 1 ? ' item removed.' : ' items removed.'));
        break;

      case 'clear-all':
        openModal(UI.confirmDialog('Remove everything?', 'This removes all ' + savedRows().length + ' saved items. You cannot undo this.', 'confirm-clear-all', 'Remove all'));
        break;

      case 'confirm-clear-all':
        S.clearAll();
        closeModal();
        render({ keep: true });
        toast('Saved list is empty.');
        break;

      case 'jump':
        var target = document.getElementById('az-' + el.getAttribute('data-letter'));
        if (target) target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
        break;
    }
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-action]') : null;
    if (!el) return;
    onAction(e, el);
  });

  document.addEventListener('change', function (e) {
    var el = e.target;
    var kind = el.getAttribute && el.getAttribute('data-change');
    if (kind === 'autosave') {
      S.setAutosave(el.checked);
      toast(el.checked ? 'Items will be saved when you open them.' : 'Items are saved only when you press Save.');
    } else if (kind === 'sorted') {
      S.setSorted(el.getAttribute('data-id'), el.checked);
      render({ keep: true });
      var again = app.querySelector('input[data-change="sorted"][data-id="' + el.getAttribute('data-id') + '"]');
      if (again) again.focus({ preventScroll: true });
    }
  });

  document.addEventListener('submit', function (e) {
    var form = e.target;
    var kind = form.getAttribute && form.getAttribute('data-form');
    if (!kind) return;
    e.preventDefault();

    if (kind === 'search') {
      var q = form.elements.q.value.trim();
      hideSuggest();
      go('#/search' + (q ? '?q=' + encodeURIComponent(q) : ''));
    } else if (kind === 'report') {
      // (the field is called "what" because form.elements.item is a built-in method, not our field)
      var what = form.elements.what.value.trim();
      if (!what) {
        openModal(UI.reportDialog('', 'Please type what you were looking for.', form.elements.note.value));
        return; // openModal puts the cursor in the field again
      }
      // Prototype: nothing is sent anywhere.
      openModal(UI.reportDoneDialog());
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!modalEl.hidden) { closeModal(); return; }
      hideSuggest();
      return;
    }
    // Keep Tab inside an open dialog.
    if (e.key === 'Tab' && !modalEl.hidden) {
      var nodes = modalEl.querySelectorAll('.dialog button, .dialog input, .dialog textarea, .dialog a[href]');
      if (!nodes.length) return;
      var first = nodes[0];
      var last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    // Arrow keys move through the suggestions.
    var list = document.getElementById('suggest');
    if (list && !list.hidden && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      var links = Array.prototype.slice.call(list.querySelectorAll('a'));
      var i = links.indexOf(document.activeElement);
      e.preventDefault();
      if (e.key === 'ArrowDown') (links[i + 1] || links[0]).focus();
      else if (i <= 0) document.getElementById('q').focus();
      else links[i - 1].focus();
    }
  });

  // ---------- search suggestions (as you type) ----------

  function hideSuggest() {
    var list = document.getElementById('suggest');
    var input = document.getElementById('q');
    if (list) { list.hidden = true; list.innerHTML = ''; }
    if (input) input.setAttribute('aria-expanded', 'false');
  }

  document.addEventListener('input', function (e) {
    if (!e.target || e.target.id !== 'q') return;
    var list = document.getElementById('suggest');
    if (!list) return;
    var value = e.target.value.trim();
    var matches = value.length >= 2 ? Search.search(value, D.ITEMS).slice(0, 5) : [];
    if (!matches.length) { hideSuggest(); return; }
    list.innerHTML = UI.suggestList(matches);
    list.hidden = false;
    e.target.setAttribute('aria-expanded', 'true');
  });

  document.addEventListener('focusout', function (e) {
    var list = document.getElementById('suggest');
    if (!list || list.hidden) return;
    clearTimeout(suggestTimer);
    suggestTimer = setTimeout(function () {
      var form = list.closest('form');
      if (form && !form.contains(document.activeElement)) hideSuggest();
    }, 150);
  });

  // ---------- start ----------

  window.addEventListener('hashchange', function () {
    navCount++;
    route();
  });

  route();
})();
