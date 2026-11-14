/*
 * Screens. Every function here takes data and returns an HTML string. No clicking logic lives here
 * (that is in app.js). Buttons and links carry data-action / data-change attributes instead.
 *
 * The look follows the team's Figma file, page "Redesign (final version)".
 * Icons are the Figma icons, exported to assets/ (do not redraw them; export again from Figma).
 *
 * Always pass text through esc() before putting it in HTML.
 */
(function (root) {
  var A = 'assets/';

  // Small inline icons that the Figma file does not have as separate assets.
  var ICONS = {
    bookmark: '<path d="M6 3.5h12v17l-6-4.2-6 4.2z" fill="currentColor"/>',
  };

  var BIN_CART = { blue: 'bin-blue.svg', green: 'bin-green.svg', black: 'bin-black.svg' };

  var STUBS = {
    language: {
      title: 'Language',
      text: 'The prototype is in English only. In the final service, people could choose another language here.',
    },
    calendar: {
      title: 'Calendar Schedule',
      text: 'People would type their address and see which cart is collected on which day. This part is not built in the prototype.',
    },
    locations: {
      title: 'Special Disposal Centres',
      text: 'A map of places that accept hazardous waste, electronics and other special items. This part is not built in the prototype.',
    },
    building: {
      title: 'Building waste guide',
      text: 'For people in shared buildings: waste rules for their building. This part is not built in the prototype.',
    },
    help: {
      title: 'Need Help',
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
      'stroke-width="2" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONS[name] || '') + '</svg>'
    );
  }

  // A Figma icon from assets/. Decorative: the button or link around it carries the text.
  function img(file, w, h, cls) {
    return '<img class="' + (cls || 'icon') + '" src="' + A + file + '" width="' + w + '" height="' + (h || w) + '" alt="">';
  }

  function placeholder(cls) {
    return '<span class="ph ' + (cls || '') + '" aria-hidden="true">' + img('placeholder-x.svg', 120, 120, 'ph-x') + '</span>';
  }

  function binTag(ctx, bin, big) {
    var b = ctx.data.BINS[bin];
    var text = bin === 'dropoff' ? 'DROP-OFF' : b.label;
    return '<span class="tag tag-' + bin + (big ? ' tag-lg' : '') + '">' + esc(text) + '</span>';
  }

  // The coloured tag for a saved item. "Depends" items show the tag only once an option is chosen.
  function itemTag(ctx, item, choice) {
    if (item.options) {
      if (choice != null && item.options[choice]) return binTag(ctx, item.options[choice].bin);
      return '<span class="tag tag-depends">IT DEPENDS</span>';
    }
    return binTag(ctx, item.bin);
  }

  function listName(item) {
    return item.options ? item.name + ' (it depends)' : item.name;
  }

  // Figma "List row": picture, name, bin tag, line under it.
  function itemRow(ctx, item) {
    return (
      '<li><a class="row" href="#/item/' + esc(item.id) + '">' + placeholder('ph-56') +
      '<span class="row-text"><span class="row-title">' + esc(listName(item)) + '</span>' +
      (item.options ? '' : binTag(ctx, item.bin)) + '</span></a></li>'
    );
  }

  function rows(ctx, list) {
    return '<ul class="rows">' + list.map(function (it) { return itemRow(ctx, it); }).join('') + '</ul>';
  }

  function label(text) {
    return '<p class="label-caps">' + esc(text) + '</p>';
  }

  // ---------- page frame ----------

  function savedButton(ctx) {
    var n = ctx.savedCount;
    return (
      '<a id="saved-link" class="icon-btn" href="#/saved" aria-label="Saved items, ' + n + ' saved">' + img('bookmark.svg', 24) +
      '<span id="saved-count" class="badge"' + (n ? '' : ' hidden') + ' aria-hidden="true">' + n + '</span></a>'
    );
  }

  // Figma "Nav bar": "← back" on the left, Saved and Menu on the right.
  // Change from Figma (team to confirm): a Home button was added here, and removed from the home screen,
  // where it only linked to the page you were already on.
  function navBar(ctx, fallback) {
    return (
      '<nav class="navbar" aria-label="Page">' +
      '<a class="back" href="' + esc(fallback || '#/') + '" data-action="back" data-fallback="' + esc(fallback || '#/') + '">← back</a>' +
      '<div class="navbar-right">' +
      '<a class="icon-btn" href="#/" aria-label="Home">' + img('house.svg', 24) + '</a>' + savedButton(ctx) +
      '<button type="button" class="icon-btn" data-action="menu" aria-label="More">' + img('menu.svg', 24) + '</button>' +
      '</div></nav>'
    );
  }

  function frame(inner) {
    return (
      '<a class="skip" href="#/" data-action="skip">Skip to content</a>' +
      '<main id="main" class="page" tabindex="-1">' + inner + '</main>' +
      '<footer class="foot"><p>Student prototype for CPSC 481. Not an official City of Calgary service. ' +
      'Answers are placeholders and may be wrong. Check the City of Calgary guide for real decisions.</p></footer>'
    );
  }

  // ---------- search field (Figma "Search field / camera + search") ----------

  function searchForm(query, placeholderText) {
    return (
      '<form class="search" data-form="search" role="search" autocomplete="off">' +
      '<label class="sr-only" for="q">Search for an item</label>' +
      '<div class="field">' +
      '<input id="q" name="q" type="search" placeholder="' + esc(placeholderText || 'Search (i.e. "Plastic")') + '" value="' + esc(query || '') + '" ' +
      'autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" aria-controls="suggest" aria-expanded="false">' +
      '<button type="button" class="field-btn" data-action="photo" aria-label="Search with a photo">' + img('camera.svg', 24) + '</button>' +
      '<button type="submit" class="field-btn" aria-label="Search">' + img('search.svg', 24) + '</button>' +
      '</div>' +
      '<ul id="suggest" class="suggest" role="listbox" aria-label="Suggestions" hidden></ul>' +
      '</form>'
    );
  }

  function searchHref(q) {
    return '#/search?q=' + encodeURIComponent(q);
  }

  // ---------- screens ----------

  function home(ctx) {
    var menu = [
      { stub: 'calendar', file: 'calendar-32.svg', label: 'Calendar' },
      { stub: 'locations', file: 'pin-32.svg', label: 'Locations' },
      { stub: 'help', file: 'help-32.svg', label: 'Help' },
      { stub: 'language', file: 'globe-32.svg', label: 'Language' },
      { stub: 'building', file: 'building-32.svg', label: 'Building' },
    ].map(function (t) {
      return '<li><button type="button" class="menu-tile" data-action="stub" data-stub="' + t.stub + '">' +
        '<span class="menu-tile-box">' + img(t.file, 32) + '</span><span class="menu-tile-label">' + esc(t.label) + '</span></button></li>';
    }).join('');

    var bins = ['black', 'blue', 'green'].map(function (b) {
      return '<li><a class="bin-btn" href="#/bin/' + b + '">' + img(BIN_CART[b], 48, 56, 'bin-cart') +
        '<span>' + esc(b.charAt(0).toUpperCase() + b.slice(1)) + '</span></a></li>';
    }).join('');

    var tiles = ctx.data.CATEGORIES.map(function (c) { return categoryTile(c); }).join('');

    return frame(
      '<header class="topbar">' +
      '<a class="logo" href="#/" aria-label="Home">' +
      '<span class="logo-crop"><img src="' + A + 'calgary.png" width="600" height="300" alt=""></span></a>' +
      savedButton(ctx) +
      '</header>' +
      '<h1 class="h1 h1-lg">What Goes Where?</h1>' +
      '<ul class="menu-tiles">' + menu + '</ul>' +
      searchForm('') +
      '<section class="crash" aria-labelledby="crash-title"><h2 id="crash-title" class="crash-title">CRASH COURSE ON BINS!</h2>' +
      '<ul class="bins">' + bins + '</ul></section>' +
      '<h2 class="h2">Popular Categories</h2>' +
      '<ul class="tiles">' + tiles + '</ul>' +
      '<a class="btn btn-outline" href="#/az">See all items listed A–Z</a>'
    );
  }

  function categoryTile(c) {
    return '<li><a class="tile" href="#/category/' + esc(c.id) + '">' +
      '<span class="tile-img" aria-hidden="true">' + img('tile-placeholder.svg', 162, 110, 'ph-x') + '</span>' +
      '<span class="tile-caption">' + esc(c.name) + '</span></a></li>';
  }

  function noResult(ctx, q) {
    return (
      '<h1 class="h1 h1-md">We couldn\'t find &ldquo;' + esc(q) + '&rdquo;</h1>' +
      '<p class="body">It isn\'t in our list yet. Here\'s what you can do:</p>' +
      '<a class="btn btn-outline" href="#/az">See all items A–Z</a>' +
      '<button type="button" class="btn btn-outline" data-action="photo">Take a photo instead</button>' +
      '<button type="button" class="btn btn-outline" data-action="report" data-q="' + esc(q) + '">Report missing item</button>' +
      '<a class="btn btn-outline" href="tel:311">Call 311</a>' +
      '<p class="small muted">Tip: check the spelling, or try a simpler word (e.g. &ldquo;tube&rdquo; or &ldquo;rubber&rdquo;).</p>'
    );
  }

  // opts: { results, suggestion, closeMatches, notFound, recentItems }
  function searchPage(ctx, q, opts) {
    var body;
    if (!q) {
      // Figma "14 Next item – empty search"
      var recent = opts.recentItems || [];
      body =
        '<h1 class="h1 h1-lg">Next item</h1>' + searchForm('', 'Type the next item…') +
        '<p class="small muted">' + (ctx.savedCount
          ? 'Your last item is already in Saved. Type, or tap the camera, for the next one.'
          : 'Type an item, or tap the camera to take a photo of it.') + '</p>' +
        (recent.length ? label('RECENT') + rows(ctx, recent) : '');
      return frame(navBar(ctx, '#/') + body);
    }

    if (opts.results.length && !opts.notFound) {
      body = '<h1 class="h1 h1-md">Results for &ldquo;' + esc(q) + '&rdquo;</h1>' +
        '<p class="sr-only" role="status">' + opts.results.length + (opts.results.length === 1 ? ' result' : ' results') + '</p>' +
        rows(ctx, opts.results);
    } else if (opts.suggestion && !opts.notFound) {
      // Figma "16 Search – Did you mean (typo help)"
      body =
        '<h1 class="h1 h1-md">Results for &ldquo;' + esc(q) + '&rdquo;</h1>' +
        '<a class="did-you-mean" href="' + esc(searchHref(opts.suggestion)) + '">' +
        '<span class="did-you-mean-q">Did you mean…</span><span class="did-you-mean-a">' + esc(opts.suggestion) + '?</span></a>' +
        (opts.closeMatches.length ? label('CLOSE MATCHES') + rows(ctx, opts.closeMatches) : '') +
        '<p class="still">Still not it?</p>' +
        '<a class="link" href="' + esc(searchHref(q)) + '&amp;nf=1">Show &ldquo;We couldn\'t find it&rdquo; options</a>';
    } else {
      body = noResult(ctx, q);
    }
    return frame(navBar(ctx, '#/') + searchForm(q) + body);
  }

  function answerBox(ctx, bin) {
    var b = ctx.data.BINS[bin];
    var text = bin === 'dropoff' ? b.label : b.label + '!';
    return '<section class="answer" tabindex="-1" data-focus="answer" aria-label="Answer: ' + esc(b.label) + ', ' + esc(b.name) + '">' +
      '<p class="answer-text">' + esc(text) + '</p></section>';
  }

  // Figma "Save item button v2 (auto-save)": black "Saved ✓" pill, or white "+ Save" pill.
  function savePill(item, entry) {
    var id = esc(item.id);
    if (entry) {
      return '<button type="button" class="save-pill is-saved" id="save-chip" data-action="unsave" data-id="' + id + '" aria-label="Saved. Tap to remove from Saved.">' +
        img('bookmark-filled-white.svg', 18) + '<span>Saved ✓</span></button>';
    }
    return '<button type="button" class="save-pill" id="save-chip" data-action="save" data-id="' + id + '">' +
      img('plus.svg', 18) + '<span>Save</span></button>';
  }

  function itemPage(ctx, item, entry, pendingChoice) {
    var hasOptions = !!item.options;
    var choice = entry && entry.choice != null ? entry.choice : pendingChoice;
    if (choice == null || !item.options || !item.options[choice]) choice = null;
    var id = esc(item.id);

    var h = navBar(ctx, '#/') +
      '<div class="item-img">' + placeholder('ph-hero') + savePill(item, entry) + '</div>' +
      '<h1 class="h1">' + esc(item.name) + '</h1>';

    if (item.warning) {
      // Figma "05d Item page – Hazardous (warning first)"
      h += '<div class="hazard" role="note">' + img('warning.svg', 24) +
        '<div class="hazard-text"><p class="hazard-title">Hazardous — not for any cart</p><p>' + esc(item.warning) + '</p>' +
        '<button type="button" class="link link-pin" data-action="stub" data-stub="locations">' + img('pin.svg', 20) + 'Find a drop-off near me</button>' +
        '</div></div>';
    }

    if (hasOptions) {
      // Figma "05b / 05c Item page – It depends"
      h += '<div class="options" role="group" aria-labelledby="opt-q"><p id="opt-q" class="options-q">' + esc(item.how) + '</p>';
      item.options.forEach(function (o, i) {
        var on = choice === i;
        h += '<button type="button" class="option' + (on ? ' is-selected' : '') + '" data-action="choose" data-id="' + id + '" data-choice="' + i + '" aria-pressed="' + on + '"' +
          (on ? ' data-focus="answer"' : '') + '>' +
          '<span class="option-text"><span class="option-label">' + esc(o.label) + '</span><span class="option-note">' + esc(o.note) + '</span></span>' +
          binTag(ctx, o.bin, true) + '</button>';
      });
      h += '</div>';
    } else {
      h += answerBox(ctx, item.bin) + '<p class="body">' + esc(item.how) + '</p>';
    }

    h += '<div class="next-row"><a class="btn-next" href="#/search">NEXT ITEM →</a></div>';
    return frame(h);
  }

  function savedRow(ctx, r) {
    var it = r.item;
    var choiceLabel = it.options && r.entry.choice != null && it.options[r.entry.choice] ? it.options[r.entry.choice].label : '';
    return (
      '<li class="saved-row' + (r.entry.sorted ? ' is-sorted' : '') + '">' + placeholder('ph-52') +
      '<a class="saved-main" href="#/item/' + esc(it.id) + '"><span class="row-title">' + esc(it.name) + '</span>' +
      (choiceLabel ? '<span class="row-sub">' + esc(choiceLabel) + '</span>' : '') + itemTag(ctx, it, r.entry.choice) + '</a>' +
      '<label class="check"><input type="checkbox" data-change="sorted" data-id="' + esc(it.id) + '"' + (r.entry.sorted ? ' checked' : '') + '>' +
      '<span class="check-box" aria-hidden="true">' + img('checkbox-checked.svg', 24) + '</span><span class="sr-only">Sorted: ' + esc(it.name) + '</span></label>' +
      '<button type="button" class="remove-btn" data-action="unsave" data-id="' + esc(it.id) + '" aria-label="Remove ' + esc(it.name) + ' from Saved">' + img('remove.svg', 16) + '</button>' +
      '</li>'
    );
  }

  function savedGroup(ctx, title, list) {
    if (!list.length) return '';
    return '<div class="group-head"><span>' + esc(title) + '</span><span>SORTED</span></div>' +
      '<ul class="saved-list">' + list.map(function (r) { return savedRow(ctx, r); }).join('') + '</ul>';
  }

  // rows: [{ item, entry }] newest first. Figma "07 Saved items panel".
  function savedPage(ctx, list) {
    var startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    var today = list.filter(function (r) { return (r.entry.ts || 0) >= startOfToday.getTime(); });
    var older = list.filter(function (r) { return (r.entry.ts || 0) < startOfToday.getTime(); });

    var h = '<div class="panel-head">' +
      '<a class="icon-btn" href="#/" data-action="back" data-fallback="#/" aria-label="Close Saved">' + img('close.svg', 24) + '</a>' +
      '<h1 class="panel-title">Saved</h1></div>' +
      '<div class="autosave-box">' +
      '<div class="autosave-line"><p>' + (ctx.autosave
        ? 'Every item you look up is saved here automatically.'
        : 'Auto-save is off. Tap &ldquo;+ Save&rdquo; on an item to keep it here.') + '</p>' + img('bookmark-filled.svg', 22) + '</div>' +
      '<label class="switch"><span class="switch-text">AUTO-SAVE SEARCH</span>' +
      '<input type="checkbox" data-change="autosave"' + (ctx.autosave ? ' checked' : '') + '>' +
      '<span class="switch-track" aria-hidden="true"></span></label>' +
      '<button type="button" class="how-link" data-action="how-saving">' + img('info.svg', 16) + '<span>How saving works</span></button>' +
      '</div>';

    if (!ctx.storageOk) {
      h += '<p class="notice" role="status">Your browser is not keeping saved items. They will be lost when you close this page.</p>';
    }

    if (!list.length) {
      h += '<div class="empty"><p class="h3">Nothing saved yet</p><p class="small muted">Items you look up appear here, so you can sort them one by one.</p>' +
        '<a class="btn btn-outline" href="#/search">Find an item</a></div>';
      return frame('<div class="panel">' + h + '</div>');
    }

    var sortedCount = list.filter(function (r) { return r.entry.sorted; }).length;
    var todaySorted = today.length && today.every(function (r) { return r.entry.sorted; });
    var allSorted = sortedCount === list.length;
    h += '<p class="sr-only" role="status">' + sortedCount + ' of ' + list.length + ' sorted</p>';
    if (todaySorted || allSorted) {
      h += '<div class="done" role="status">' + img('check.svg', 20) +
        '<div><p class="done-title">All sorted ✓</p><p>' + (todaySorted
          ? 'Everything you looked up today is in its bin.'
          : 'Everything you saved is in its bin.') + '</p></div></div>';
    }

    h += savedGroup(ctx, 'TODAY', today) + savedGroup(ctx, 'RECENT', older);

    h += '<div class="panel-actions">';
    if (sortedCount) h += '<button type="button" class="btn btn-outline" data-action="remove-sorted">Remove sorted items (' + sortedCount + ')</button>';
    h += '<button type="button" class="link center" data-action="clear-all">Remove everything</button></div>';
    return frame('<div class="panel">' + h + '</div>');
  }

  // Figma "17 A–Z list"
  function azPage(ctx) {
    var list = ctx.data.ITEMS.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    var groups = {};
    list.forEach(function (it) {
      var l = it.name.charAt(0).toUpperCase();
      (groups[l] = groups[l] || []).push(it);
    });
    var all = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    var first = all.filter(function (l) { return groups[l]; })[0];
    var nav = all.map(function (l) {
      return groups[l]
        ? '<button type="button" class="letter' + (l === first ? ' is-on' : '') + '" data-action="jump" data-letter="' + l + '" aria-label="Jump to ' + l + '">' + l + '</button>'
        : '<span class="letter is-empty" aria-hidden="true">' + l + '</span>';
    }).join('');
    var body = all.filter(function (l) { return groups[l]; }).map(function (l) {
      return '<section id="az-' + l + '" class="az-group" data-letter="' + l + '"><h2 class="az-letter">' + l + '</h2>' +
        '<ul class="rows">' + groups[l].map(function (it) {
          return itemRow(ctx, it).replace('<li>', '<li data-name="' + esc(it.name.toLowerCase()) + '">');
        }).join('') + '</ul></section>';
    }).join('');
    return frame(
      navBar(ctx, '#/') + '<h1 class="h1 h1-lg">All items A–Z</h1>' +
      '<div class="field" role="search">' +
      '<label class="sr-only" for="az-filter">Filter the list</label>' +
      '<input id="az-filter" type="search" placeholder="Filter the list…" autocomplete="off" spellcheck="false">' +
      '<button type="button" class="field-btn" data-action="photo" aria-label="Search with a photo">' + img('camera.svg', 24) + '</button>' +
      '<span class="field-btn" aria-hidden="true">' + img('search.svg', 24) + '</span></div>' +
      '<div class="letters" role="group" aria-label="Jump to letter">' + nav + '</div>' +
      '<p id="az-none" class="small muted" hidden>No items match. Try the search instead.</p>' +
      '<div class="az-body">' + body + '</div>'
    );
  }

  function categoriesPage(ctx) {
    return frame(navBar(ctx, '#/') + '<h1 class="h1">Categories</h1><ul class="tiles">' +
      ctx.data.CATEGORIES.map(categoryTile).join('') + '</ul>');
  }

  // Figma "04 Sub-category page": title and a list of items.
  function categoryPage(ctx, cat, list) {
    list = list.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    return frame(navBar(ctx, '#/') + '<h1 class="h1 h1-lg">' + esc(cat.name) + '</h1>' + rows(ctx, list));
  }

  // Figma "02 Crash Course page": big cart, title, then the items that go in it.
  function binPage(ctx, bin, list) {
    var b = ctx.data.BINS[bin];
    list = list.slice().sort(function (a, b2) { return a.name.localeCompare(b2.name); });
    var art = BIN_CART[bin]
      ? img(bin === 'blue' ? 'bin-blue-large.svg' : BIN_CART[bin], 96, 112, 'bin-cart-lg')
      : img('warning.svg', 64, 64, 'bin-cart-lg');
    var title = bin === 'dropoff' ? 'DROP-OFF ONLY — SPECIAL ITEMS' : 'THE ' + b.label + ' — ' + b.name.toUpperCase();
    return frame(
      navBar(ctx, '#/') +
      '<div class="bin-head">' + art + '<h1 class="bin-title">' + esc(title) + '</h1></div>' +
      placeholder('ph-banner') +
      label('WHAT GOES IN IT') + rows(ctx, list)
    );
  }

  function notFoundPage(ctx, what) {
    return frame(navBar(ctx, '#/') + '<h1 class="h1">' + esc(what || 'Page not found') + '</h1>' +
      '<p class="body">We could not find this page. Try searching instead.</p>' + searchForm(''));
  }

  // ---------- dialogs (Figma pop-up panels) ----------

  function dialog(title, body, footer, opts) {
    opts = opts || {};
    return (
      '<div class="backdrop" data-action="close-modal"></div>' +
      '<div class="dialog' + (opts.center ? ' dialog-center' : '') + '" role="dialog" aria-modal="true" aria-labelledby="dlg-title">' +
      '<div class="panel-head">' +
      '<button type="button" class="icon-btn" data-action="close-modal" aria-label="Close">' + img('close.svg', 24) + '</button>' +
      '<h2 id="dlg-title" class="panel-title' + (opts.hideTitle ? ' sr-only' : '') + '">' + esc(title) + '</h2></div>' +
      body + (footer ? '<div class="dialog-actions">' + footer + '</div>' : '') + '</div>'
    );
  }

  function stubDialog(key) {
    var s = STUBS[key] || { title: 'Under development', text: 'This part is not built in the prototype.' };
    return dialog(s.title, '<p class="label-caps">UNDER DEVELOPMENT</p><p class="body">' + esc(s.text) + '</p>',
      '<button type="button" class="btn btn-outline" data-action="close-modal">OK</button>');
  }

  // Figma "08 More menu panel"
  function menuDialog() {
    var list = [
      ['calendar', 'Calendar Schedule', 'calendar.svg'],
      ['locations', 'Special Disposal Centres', 'pin-24.svg'],
      ['building', 'Building waste guide', 'building.svg'],
      ['help', 'Need Help', 'help.svg'],
      ['language', 'Language (ENG)', 'globe.svg'],
    ];
    return dialog('More', '<div class="menu-rows">' + list.map(function (m) {
      return '<button type="button" class="menu-row" data-action="stub" data-stub="' + m[0] + '"><span>' + esc(m[1]) + '</span>' + img(m[2], 24) + '</button>';
    }).join('') + '</div>', '');
  }

  // Figma "07b How saving works"
  function howSavingDialog() {
    var parts = [
      ['Saved automatically', 'Every item you look up is added to Saved. You don\'t need to tap anything.'],
      ['TODAY and RECENT', 'TODAY shows what you looked up today. Older items move to RECENT.'],
      ['Sorted', 'Tick SORTED once the item is in its bin. When every item today is ticked you\'ll see "All sorted ✓".'],
      ['Unsave', 'Tap "Saved ✓" on the item page, or ⊗ next to the item here.'],
      ['Prefer saving by hand?', 'Turn Auto-save off. Each item then shows a "+ Save" button.'],
    ];
    return dialog('How saving works', parts.map(function (p) {
      return '<div class="how-part"><p class="how-title">' + esc(p[0]) + '</p><p>' + esc(p[1]) + '</p></div>';
    }).join(''), '<button type="button" class="btn btn-outline" data-action="close-modal">Got it</button>');
  }

  // Figma "09 Camera pop-up" (demo: nothing reads the photo)
  function photoDialog() {
    return dialog('Photo search',
      '<div class="viewfinder" aria-hidden="true">' + placeholder('ph-200') + img('corner-brackets.svg', 260, 260, 'brackets') + '</div>' +
      '<p class="camera-dots" aria-hidden="true">•••</p>' +
      '<p class="camera-text">Demo only: photo search is not built yet.</p>' +
      '<button type="button" class="capture" data-action="photo-demo" aria-label="Take a photo">' + img('capture.svg', 76) + '</button>',
      '<button type="button" class="btn btn-outline" data-action="photo-demo">BROWSE DEVICE</button>',
      { center: true, hideTitle: true });
  }

  function reportDialog(prefill, error, note) {
    return dialog('Report missing item',
      '<form id="report-form" class="form" data-form="report" novalidate>' +
      '<label class="form-label" for="report-item">What were you looking for?</label>' +
      '<input class="input' + (error ? ' has-error' : '') + '" id="report-item" name="what" type="text" value="' + esc(prefill) + '" required' +
      (error ? ' aria-invalid="true" aria-describedby="report-error"' : '') + '>' +
      (error ? '<p class="error" id="report-error" role="alert">' + esc(error) + '</p>' : '') +
      '<label class="form-label" for="report-note">Other details (optional)</label>' +
      '<textarea class="input" id="report-note" name="note" rows="4">' + esc(note || '') + '</textarea></form>',
      '<button type="submit" class="btn btn-small" form="report-form">Submit</button>' +
      '<button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button>');
  }

  function reportDoneDialog() {
    return dialog('Thank you',
      '<div class="done">' + img('check.svg', 20) + '<div><p class="done-title">Report sent ✓</p>' +
      '<p>This is a prototype, so your message was not sent anywhere. In the final service it would go to the team that updates the guide.</p></div></div>',
      '<button type="button" class="btn btn-outline" data-action="close-modal">OK</button>');
  }

  function confirmDialog(title, text, confirmAction, confirmLabel) {
    return dialog(title, '<p class="body">' + esc(text) + '</p>',
      '<button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button>' +
      '<button type="button" class="btn btn-danger" data-action="' + esc(confirmAction) + '">' + esc(confirmLabel) + '</button>');
  }

  function suggestList(list) {
    return list.map(function (it) {
      return '<li role="option"><a href="#/item/' + esc(it.id) + '">' + esc(it.name) + '</a></li>';
    }).join('');
  }

  root.WGW_UI = {
    esc: esc, icon: icon, img: img, home: home, searchPage: searchPage, itemPage: itemPage, savedPage: savedPage,
    azPage: azPage, categoriesPage: categoriesPage, categoryPage: categoryPage, binPage: binPage,
    notFoundPage: notFoundPage, stubDialog: stubDialog, menuDialog: menuDialog, howSavingDialog: howSavingDialog,
    photoDialog: photoDialog, reportDialog: reportDialog, reportDoneDialog: reportDoneDialog,
    confirmDialog: confirmDialog, suggestList: suggestList,
  };
})(typeof window !== 'undefined' ? window : globalThis);
