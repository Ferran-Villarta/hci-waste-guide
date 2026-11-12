/*
 * Screens. Every function here takes data and returns an HTML string. No clicking logic lives here
 * (that is in app.js). Buttons and links carry data-action / data-change attributes instead.
 *
 * Always pass text through esc() before putting it in HTML.
 */
(function (root) {
  var ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    bookmark: '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    chevron: '<path d="M9 5l7 7-7 7"/>',
    building: '<path d="M5 21V4.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1V21"/><path d="M15 10h3a1 1 0 0 1 1 1v10"/><path d="M3 21h18"/><path d="M8.5 7.5h2M8.5 11.5h2M8.5 15.5h2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7"/><path d="M12 17h.01"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    warning: '<path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18h.01"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    recycle: '<path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>',
    leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c3-5 6-8 10-10"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/>',
  };

  var BIN_ICON = { blue: 'recycle', green: 'leaf', black: 'trash', dropoff: 'warning' };

  var STUBS = {
    language: {
      title: 'Language',
      text: 'The prototype is in English only. In the final service, people could choose another language here.',
    },
    calendar: {
      title: 'Collection calendar',
      text: 'People would type their address and see which cart is collected on which day. This part is not built in the prototype.',
    },
    locations: {
      title: 'Drop-off locations',
      text: 'A list of places that accept hazardous waste, electronics and other special items. This part is not built in the prototype.',
    },
    building: {
      title: 'Building waste guide',
      text: 'For people in shared buildings: waste rules for their building. This part is not built in the prototype.',
    },
    help: {
      title: 'Help',
      text: 'Help pages are not built in the prototype. For real questions, call 311.',
    },
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function icon(name, size) {
    var s = size || 24;
    return (
      '<svg class="icon" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      (ICONS[name] || '') + '</svg>'
    );
  }

  function binTag(ctx, bin) {
    var b = ctx.data.BINS[bin];
    return '<span class="tag tag-' + bin + '">' + icon(BIN_ICON[bin], 16) + esc(b.label) + '</span>';
  }

  // The coloured tag for an item. "Depends" items show the tag only once an option is chosen.
  function itemTag(ctx, item, choice) {
    if (item.options) {
      if (choice != null && item.options[choice]) return binTag(ctx, item.options[choice].bin);
      return '<span class="tag tag-depends">It depends</span>';
    }
    return binTag(ctx, item.bin);
  }

  function itemRow(ctx, item, choice, extra) {
    return (
      '<li><a class="row" href="#/item/' + esc(item.id) + '">' +
      '<span class="row-main"><span class="row-title">' + esc(item.name) + '</span>' +
      (extra ? '<span class="row-sub">' + esc(extra) + '</span>' : '') + '</span>' +
      itemTag(ctx, item, choice) + icon('chevron', 18) + '</a></li>'
    );
  }

  function backLink(fallback, label) {
    return (
      '<a class="back" href="' + esc(fallback) + '" data-action="back" data-fallback="' + esc(fallback) + '">' +
      icon('back', 20) + '<span>' + esc(label || 'Back') + '</span></a>'
    );
  }

  // ---------- page frame ----------

  function topbar(ctx) {
    var n = ctx.savedCount;
    return (
      '<a class="skip" href="#/" data-action="skip">Skip to content</a>' +
      '<header class="topbar"><div class="topbar-in">' +
      '<a class="brand" href="#/"><span class="brand-mark">' + icon('recycle', 20) + '</span><span>What Goes Where</span></a>' +
      '<div class="topbar-actions">' +
      '<button type="button" class="chip-btn" data-action="stub" data-stub="language" aria-label="Language: English">' + icon('globe', 18) + '<span>EN</span></button>' +
      '<a id="saved-link" class="chip-btn" href="#/saved" aria-label="Saved items, ' + n + ' saved">' + icon('bookmark', 18) +
      '<span>Saved</span><span id="saved-count" class="badge"' + (n ? '' : ' hidden') + '>' + n + '</span></a>' +
      '</div></div></header>'
    );
  }

  function frame(ctx, inner) {
    return (
      topbar(ctx) + '<main id="main" class="page" tabindex="-1">' + inner + '</main>' +
      '<footer class="foot"><p>Student prototype for CPSC 481. Not an official City of Calgary service. ' +
      'Answers are placeholders and may be wrong. Check the City of Calgary guide for real decisions.</p></footer>'
    );
  }

  // ---------- search form ----------

  function searchForm(query) {
    return (
      '<form class="search" data-form="search" role="search" autocomplete="off">' +
      '<label class="sr-only" for="q">Search for an item</label>' +
      '<div class="field">' + icon('search', 20) +
      '<input id="q" name="q" type="search" placeholder="Try &ldquo;pizza box&rdquo;" value="' + esc(query || '') + '" ' +
      'autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" aria-controls="suggest" aria-expanded="false"></div>' +
      '<button class="btn btn-primary" type="submit">Search</button>' +
      '<ul id="suggest" class="suggest" role="listbox" aria-label="Suggestions" hidden></ul>' +
      '</form>'
    );
  }

  function chips(list, hrefFor) {
    return (
      '<ul class="chips">' +
      list.map(function (q) {
        return '<li><a class="chip" href="' + esc(hrefFor(q)) + '">' + esc(q) + '</a></li>';
      }).join('') + '</ul>'
    );
  }

  function searchHref(q) {
    return '#/search?q=' + encodeURIComponent(q);
  }

  // ---------- screens ----------

  function home(ctx) {
    var tiles = [
      { href: '#/az', icon: 'list', label: 'A–Z list', sub: 'Every item' },
      { href: '#/categories', icon: 'grid', label: 'Categories', sub: 'Browse by type' },
      { stub: 'calendar', icon: 'calendar', label: 'Calendar', sub: 'Collection days', soon: true },
      { stub: 'locations', icon: 'pin', label: 'Locations', sub: 'Drop-off sites', soon: true },
      { stub: 'building', icon: 'building', label: 'Building guide', sub: 'Shared buildings', soon: true },
      { stub: 'help', icon: 'help', label: 'Help', sub: 'Get support', soon: true },
    ];
    var tileHtml = tiles.map(function (t) {
      var inner = '<span class="tile-icon">' + icon(t.icon, 26) + '</span><span class="tile-label">' + esc(t.label) + '</span>' +
        '<span class="tile-sub">' + esc(t.sub) + (t.soon ? ' &middot; soon' : '') + '</span>';
      return t.href
        ? '<li><a class="tile" href="' + t.href + '">' + inner + '</a></li>'
        : '<li><button type="button" class="tile" data-action="stub" data-stub="' + t.stub + '">' + inner + '</button></li>';
    }).join('');

    var recent = ctx.recent.length
      ? '<section class="block"><h2 class="h2">Recent searches</h2>' + chips(ctx.recent, searchHref) + '</section>'
      : '';

    return frame(ctx,
      '<h1 class="h1">What goes where?</h1>' +
      '<p class="lead">Type an item to see which cart it goes in.</p>' +
      searchForm('') + recent +
      '<section class="block"><h2 class="h2">Browse</h2><ul class="tiles">' + tileHtml + '</ul></section>'
    );
  }

  function noResult(ctx, q, suggestion) {
    var did = suggestion
      ? '<p class="did-you-mean">Did you mean <a class="link" href="' + esc(searchHref(suggestion)) + '"><strong>' + esc(suggestion) + '</strong></a>?</p>'
      : '';
    return (
      '<div class="empty">' +
      '<h2 class="h2">No answer for &ldquo;' + esc(q) + '&rdquo;</h2>' + did +
      '<p class="muted">Check the spelling, or try another way:</p></div>' +
      '<ul class="actions-list">' +
      '<li><a class="row" href="#/az"><span class="row-icon">' + icon('list', 22) + '</span><span class="row-main"><span class="row-title">Browse the A–Z list</span><span class="row-sub">Look through every item</span></span>' + icon('chevron', 18) + '</a></li>' +
      '<li><button type="button" class="row" data-action="photo"><span class="row-icon">' + icon('camera', 22) + '</span><span class="row-main"><span class="row-title">Take a photo of the item</span><span class="row-sub">Demo only</span></span>' + icon('chevron', 18) + '</button></li>' +
      '<li><button type="button" class="row" data-action="report" data-q="' + esc(q) + '"><span class="row-icon">' + icon('flag', 22) + '</span><span class="row-main"><span class="row-title">Tell us what is missing</span><span class="row-sub">We add items people ask for</span></span>' + icon('chevron', 18) + '</button></li>' +
      '<li><a class="row" href="tel:311"><span class="row-icon">' + icon('phone', 22) + '</span><span class="row-main"><span class="row-title">Call 311</span><span class="row-sub">Ask a person</span></span>' + icon('chevron', 18) + '</a></li>' +
      '</ul>'
    );
  }

  // results === null means "no search yet" (empty query)
  function searchPage(ctx, q, results, suggestion) {
    var body;
    if (!q) {
      var tryList = ['pizza box', 'battery', 'pop can', 'coffee cup'];
      body =
        '<section class="block"><h2 class="h2">Try</h2>' + chips(tryList, searchHref) + '</section>' +
        (ctx.recent.length ? '<section class="block"><h2 class="h2">Recent</h2>' + chips(ctx.recent, searchHref) + '</section>' : '');
    } else if (results.length) {
      body =
        '<p class="count" role="status">' + results.length + (results.length === 1 ? ' result' : ' results') + ' for &ldquo;' + esc(q) + '&rdquo;</p>' +
        '<ul class="list">' + results.map(function (it) { return itemRow(ctx, it, null); }).join('') + '</ul>';
    } else {
      body = noResult(ctx, q, suggestion);
    }
    return frame(ctx, backLink('#/', 'Home') + '<h1 class="h1">Search</h1>' + searchForm(q) + body);
  }

  function answerCard(ctx, bin, note) {
    var b = ctx.data.BINS[bin];
    return (
      '<section class="answer answer-' + bin + '" tabindex="-1" data-focus="answer" aria-label="Answer: ' + esc(b.label) + '">' +
      '<div class="answer-head">' + icon(BIN_ICON[bin], 26) + '<span class="answer-label">' + esc(b.label) + '</span></div>' +
      '<p class="answer-name">' + esc(b.name) + '</p>' +
      (note ? '<p class="answer-note">' + esc(note) + '</p>' : '') +
      '</section>'
    );
  }

  function itemPage(ctx, item, entry, pendingChoice) {
    var hasOptions = !!item.options;
    var choice = entry && entry.choice != null ? entry.choice : pendingChoice;
    if (choice == null || !item.options || !item.options[choice]) choice = null;
    var bin = hasOptions ? (choice != null ? item.options[choice].bin : null) : item.bin;
    var note = hasOptions ? (choice != null ? item.options[choice].note : '') : item.how;
    var id = esc(item.id);

    var h = backLink('#/', 'Back') + '<h1 class="h1">' + esc(item.name) + '</h1>';
    if (item.warning) {
      h += '<div class="warning" role="note">' + icon('warning', 24) + '<p><strong>Warning.</strong> ' + esc(item.warning) + '</p></div>';
    }
    if (hasOptions) {
      h += '<p class="lead">' + esc(item.how) + ' Which one do you have?</p><div class="options" role="group" aria-label="Which one do you have?">';
      item.options.forEach(function (o, i) {
        h += '<button type="button" class="option' + (choice === i ? ' is-selected' : '') + '" data-action="choose" data-id="' + id + '" data-choice="' + i + '" aria-pressed="' + (choice === i) + '">' +
          '<span class="option-label">' + esc(o.label) + '</span>' + (choice === i ? icon('check', 20) : '') + '</button>';
      });
      h += '</div>';
    }
    if (bin) h += answerCard(ctx, bin, note);

    if (bin) {
      if (entry) {
        h += '<div class="save-row" id="save-chip">' + icon('check', 18) + '<span class="save-label">Saved</span>' +
          '<button type="button" class="link" data-action="unsave" data-id="' + id + '">Remove</button></div>';
        if (ctx.autosave) h += '<p class="hint">Saved automatically. You can change this in Saved.</p>';
      } else {
        h += '<button type="button" class="btn btn-outline btn-block" id="save-chip" data-action="save" data-id="' + id + '">' +
          icon('bookmark', 18) + 'Save this answer</button>';
      }
    }

    h += '<div class="stack"><a class="btn btn-primary btn-block" href="#/search">Next item</a>';
    if (bin) h += '<a class="link center" href="#/bin/' + bin + '">See all ' + esc(ctx.data.BINS[bin].name.toLowerCase()) + ' items</a>';
    h += '</div>';
    return frame(ctx, h);
  }

  // rows: [{ item, entry }] newest first
  function savedPage(ctx, rows) {
    var h = '<h1 class="h1">Saved</h1>' +
      '<label class="switch"><input type="checkbox" data-change="autosave"' + (ctx.autosave ? ' checked' : '') + '>' +
      '<span class="switch-track" aria-hidden="true"></span><span class="switch-text">Save items when I open them</span></label>';

    if (!ctx.storageOk) {
      h += '<p class="notice" role="status">Your browser is not keeping saved items. They will be lost when you close this page.</p>';
    }

    if (!rows.length) {
      h += '<div class="empty"><h2 class="h2">Nothing saved yet</h2><p class="muted">Items you look up appear here, so you can sort them one by one.</p>' +
        '<a class="btn btn-primary" href="#/search">Find an item</a></div>';
      return frame(ctx, h);
    }

    var sortedCount = rows.filter(function (r) { return r.entry.sorted; }).length;
    var allSorted = sortedCount === rows.length;
    h += '<p class="count" role="status">' + sortedCount + ' of ' + rows.length + ' sorted</p>';
    if (allSorted) h += '<div class="done" role="status">' + icon('check', 22) + '<span>All sorted. Nice work.</span></div>';

    h += '<ul class="saved-list">' + rows.map(function (r) {
      var it = r.item;
      var choiceLabel = it.options && r.entry.choice != null && it.options[r.entry.choice] ? it.options[r.entry.choice].label : '';
      return (
        '<li class="saved-row' + (r.entry.sorted ? ' is-sorted' : '') + '">' +
        '<label class="check"><input type="checkbox" data-change="sorted" data-id="' + esc(it.id) + '"' + (r.entry.sorted ? ' checked' : '') + '>' +
        '<span class="check-box" aria-hidden="true">' + icon('check', 18) + '</span><span class="sr-only">Sorted: ' + esc(it.name) + '</span></label>' +
        '<a class="saved-main" href="#/item/' + esc(it.id) + '"><span class="row-title">' + esc(it.name) + '</span>' +
        (choiceLabel ? '<span class="row-sub">' + esc(choiceLabel) + '</span>' : '') + '</a>' +
        itemTag(ctx, it, r.entry.choice) + '</li>'
      );
    }).join('') + '</ul>';

    h += '<div class="stack">';
    if (sortedCount) h += '<button type="button" class="btn btn-outline btn-block" data-action="remove-sorted">Remove sorted items (' + sortedCount + ')</button>';
    h += '<button type="button" class="link center" data-action="clear-all">Remove everything</button></div>';
    return frame(ctx, h);
  }

  function azPage(ctx) {
    var list = ctx.data.ITEMS.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    var groups = {};
    var letters = [];
    list.forEach(function (it) {
      var l = it.name.charAt(0).toUpperCase();
      if (!groups[l]) { groups[l] = []; letters.push(l); }
      groups[l].push(it);
    });
    var nav = letters.map(function (l) {
      return '<button type="button" class="letter" data-action="jump" data-letter="' + l + '" aria-label="Jump to ' + l + '">' + l + '</button>';
    }).join('');
    var body = letters.map(function (l) {
      return '<section id="az-' + l + '" class="az-group"><h2 class="az-letter">' + l + '</h2><ul class="list">' +
        groups[l].map(function (it) { return itemRow(ctx, it, null); }).join('') + '</ul></section>';
    }).join('');
    return frame(ctx, backLink('#/', 'Home') + '<h1 class="h1">A–Z list</h1><div class="letters" role="group" aria-label="Jump to letter">' + nav + '</div>' + body);
  }

  function categoriesPage(ctx) {
    var tiles = ctx.data.CATEGORIES.map(function (c) {
      var n = ctx.data.ITEMS.filter(function (it) { return it.category === c.id; }).length;
      return '<li><a class="tile tile-wide" href="#/category/' + esc(c.id) + '"><span class="tile-label">' + esc(c.name) + '</span><span class="tile-sub">' + n + (n === 1 ? ' item' : ' items') + '</span></a></li>';
    }).join('');
    return frame(ctx, backLink('#/', 'Home') + '<h1 class="h1">Categories</h1><ul class="tiles tiles-one">' + tiles + '</ul>');
  }

  function categoryPage(ctx, cat, list) {
    list = list.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    return frame(ctx, backLink('#/categories', 'Categories') + '<h1 class="h1">' + esc(cat.name) + '</h1><ul class="list">' +
      list.map(function (it) { return itemRow(ctx, it, null); }).join('') + '</ul>');
  }

  function binPage(ctx, bin, list) {
    var b = ctx.data.BINS[bin];
    list = list.slice().sort(function (a, b2) { return a.name.localeCompare(b2.name); });
    return frame(ctx, backLink('#/', 'Home') + '<h1 class="h1">' + esc(b.label) + '</h1>' +
      '<p class="lead">' + esc(b.name) + '. Items that go here:</p><ul class="list">' +
      list.map(function (it) { return itemRow(ctx, it, null); }).join('') + '</ul>');
  }

  function notFoundPage(ctx, what) {
    return frame(ctx, backLink('#/', 'Home') + '<h1 class="h1">' + esc(what || 'Page not found') + '</h1>' +
      '<p class="lead">We could not find this page. Try searching instead.</p>' + searchForm(''));
  }

  // ---------- dialogs ----------

  function dialog(title, body, footer) {
    return (
      '<div class="backdrop" data-action="close-modal"></div>' +
      '<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-title">' +
      '<h2 id="dlg-title" class="h2">' + esc(title) + '</h2>' + body +
      '<div class="dialog-actions">' + footer + '</div></div>'
    );
  }

  function stubDialog(key) {
    var s = STUBS[key] || { title: 'Under development', text: 'This part is not built in the prototype.' };
    return dialog(s.title, '<p class="tag tag-depends">Under development</p><p>' + esc(s.text) + '</p>',
      '<button type="button" class="btn btn-primary" data-action="close-modal">OK</button>');
  }

  function photoDialog() {
    return dialog('Photo search',
      '<p class="tag tag-depends">Demo only</p><p>In the final service, you would take a photo and get a suggestion. In this prototype the buttons do not read the photo.</p>' +
      '<div class="stack"><button type="button" class="btn btn-outline btn-block" data-action="photo-demo">' + icon('camera', 18) + 'Take a photo</button>' +
      '<button type="button" class="btn btn-outline btn-block" data-action="photo-demo">Choose from gallery</button></div>',
      '<button type="button" class="btn btn-primary" data-action="close-modal">Close</button>');
  }

  function reportDialog(prefill, error, note) {
    return dialog('Tell us what is missing',
      '<form id="report-form" data-form="report" novalidate>' +
      '<label class="label" for="report-item">What were you looking for?</label>' +
      '<input class="input' + (error ? ' has-error' : '') + '" id="report-item" name="what" type="text" value="' + esc(prefill) + '" required' +
      (error ? ' aria-invalid="true" aria-describedby="report-error"' : '') + '>' +
      (error ? '<p class="error" id="report-error" role="alert">' + esc(error) + '</p>' : '') +
      '<label class="label" for="report-note">Anything else? (optional)</label>' +
      '<textarea class="input" id="report-note" name="note" rows="3">' + esc(note || '') + '</textarea></form>',
      '<button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button>' +
      '<button type="submit" class="btn btn-primary" form="report-form">Send</button>');
  }

  function reportDoneDialog() {
    return dialog('Thank you',
      '<p>This is a prototype, so your message was not sent anywhere. In the final service it would go to the team that updates the guide.</p>',
      '<button type="button" class="btn btn-primary" data-action="close-modal">OK</button>');
  }

  function confirmDialog(title, text, confirmAction, confirmLabel) {
    return dialog(title, '<p>' + esc(text) + '</p>',
      '<button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button>' +
      '<button type="button" class="btn btn-danger" data-action="' + esc(confirmAction) + '">' + esc(confirmLabel) + '</button>');
  }

  function suggestList(list) {
    return list.map(function (it) {
      return '<li role="option"><a href="#/item/' + esc(it.id) + '">' + esc(it.name) + '</a></li>';
    }).join('');
  }

  root.WGW_UI = {
    esc: esc, icon: icon, home: home, searchPage: searchPage, itemPage: itemPage, savedPage: savedPage,
    azPage: azPage, categoriesPage: categoriesPage, categoryPage: categoryPage, binPage: binPage,
    notFoundPage: notFoundPage, stubDialog: stubDialog, photoDialog: photoDialog, reportDialog: reportDialog,
    reportDoneDialog: reportDoneDialog, confirmDialog: confirmDialog, suggestList: suggestList,
  };
})(typeof window !== 'undefined' ? window : globalThis);
