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

  // A picture from assets/img/ on a soft background. "tone" tints the background with a bin colour
  // (blue, green, black, dropoff); without one it is light grey. No picture: the grey placeholder.
  function pic(file, cls, tone) {
    if (!file) return placeholder(cls);
    return '<span class="pic ' + (cls || '') + (tone ? ' tone-' + tone : '') + '" aria-hidden="true">' +
      '<img src="' + A + 'img/' + esc(file) + '" alt="" decoding="async"></span>';
  }

  // Banner with a row of pictures (category page, crash course page).
  function picBanner(files, tone) {
    if (!files.length) return placeholder('ph-banner');
    return '<span class="pic pic-banner ph-banner' + (tone ? ' tone-' + tone : '') + '" aria-hidden="true">' +
      files.map(function (f) { return '<img src="' + A + 'img/' + esc(f) + '" alt="" decoding="async">'; }).join('') + '</span>';
  }

  // The bin colour of an item (for the picture background): its bin, or the chosen option's bin.
  function itemTone(item, choice) {
    if (item.bin) return item.bin;
    if (choice != null && item.options && item.options[choice]) return item.options[choice].bin;
    return '';
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
      '<li><a class="row" href="#/item/' + esc(item.id) + '">' + pic(item.img, 'ph-56', itemTone(item)) +
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

  // Every screen: "Skip to content" link (hidden until focused with Tab; the jump is in app.js,
  // action "skip"), the screen itself in <main>, and the prototype footer.
  function frame(inner) {
    return (
      '<a class="skip" href="#/" data-action="skip">Skip to content</a>' +
      '<main id="main" class="page" tabindex="-1">' + inner + '</main>' +
      '<footer class="foot"><p>Student prototype for CPSC 481. Not an official City of Calgary service. ' +
      'Answers are shortened from the City of Calgary guide. Check the City guide for real decisions.</p></footer>'
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
      { panel: 'calendar', file: 'calendar-32.svg', label: 'Calendar' },
      { panel: 'map', file: 'pin-32.svg', label: 'Locations' },
      { panel: 'help', file: 'help-32.svg', label: 'Help' },
      { panel: 'language', file: 'globe-32.svg', label: 'Language' },
      { panel: 'building', file: 'building-32.svg', label: 'Building' },
    ].map(function (t) {
      return '<li><button type="button" class="menu-tile" data-action="panel" data-panel="' + t.panel + '">' +
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

  function tile(href, name, file) {
    return '<li><a class="tile" href="' + esc(href) + '">' +
      '<span class="tile-img" aria-hidden="true">' +
      (file ? '<img class="tile-pic" src="' + A + 'img/' + esc(file) + '" alt="" decoding="async">' : img('tile-placeholder.svg', 162, 110, 'ph-x')) + '</span>' +
      '<span class="tile-caption">' + esc(name) + '</span></a></li>';
  }

  function categoryTile(c) {
    return tile('#/category/' + c.id, c.name, c.img);
  }

  function noResult(ctx, q) {
    return (
      '<h1 class="h1 h1-md">We couldn\'t find &ldquo;' + esc(q) + '&rdquo;</h1>' +
      '<p class="body">It isn\'t in our list yet. Here\'s what you can do:</p>' +
      '<a class="btn btn-outline" href="#/az">See all items A–Z</a>' +
      '<button type="button" class="btn btn-outline" data-action="photo">Take a photo instead</button>' +
      '<button type="button" class="btn btn-outline" data-action="report" data-q="' + esc(q) + '">Report missing item</button>' +
      '<button type="button" class="btn btn-outline" data-action="call">Call 311</button>' +
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
    // The box takes the bin's colour (ans-blue, ans-green…), so the answer is clear at a glance.
    return '<section class="answer ans-' + esc(bin) + '" tabindex="-1" data-focus="answer" aria-label="Answer: ' + esc(b.label) + ', ' + esc(b.name) + '">' +
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

  // extra (optional):
  //   { scan: true }                    Figma "06 Search - Image result page" (after a photo search)
  //   { address: a, building: b }       Figma "18c/18d/18e Building guide" item pages
  function itemPage(ctx, item, entry, pendingChoice, extra) {
    extra = extra || {};
    var hasOptions = !!item.options;
    var choice = entry && entry.choice != null ? entry.choice : pendingChoice;
    if (choice == null || !item.options || !item.options[choice]) choice = null;
    var id = esc(item.id);

    var h = navBar(ctx, extra.address ? '#/building/' + extra.address.id : '#/');
    if (extra.scan) {
      h += '<p class="h1 h1-sm">Results for &ldquo;' + esc(item.name.replace(/\s*\(.*\)\s*/, '').toLowerCase()) + '&rdquo;</p>' +
        '<div class="item-img">' + pic(item.img, 'ph-hero ph-220', itemTone(item, choice)) + savePill(item, entry) + '</div>' +
        '<h1 class="h1 h1-md">' + esc(item.name) + '</h1>';
    } else {
      h += '<div class="item-img">' + pic(item.img, 'ph-hero', itemTone(item, choice)) + savePill(item, entry) + '</div>' +
        '<h1 class="h1">' + esc(item.name) + '</h1>';
    }

    if (item.warning) {
      // Figma "05d Item page – Hazardous (warning first)"
      h += '<div class="hazard" role="note">' + img('warning.svg', 24) +
        '<div class="hazard-text"><p class="hazard-title">Hazardous — not for any cart</p><p>' + esc(item.warning) + '</p>' +
        '<button type="button" class="link link-pin" data-action="panel" data-panel="map" data-filter="hazard">' + img('pin.svg', 20) + 'Find a drop-off near me</button>' +
        '</div></div>';
    }

    if (extra.building) {
      // Building guide item: answer, "How to prepare it", "In your building"
      h += answerBox(ctx, item.bin) +
        '<div class="prep"><p class="prep-title">How to prepare it</p><p>' + esc(item.how) + '</p></div>' +
        '<div class="grey-box">' + img('building-22.svg', 22) +
        '<div><p class="grey-box-title">In your building</p><p class="muted">' + esc(extra.building.building) + ' Placeholder data.</p></div></div>' +
        sourceLine(item) + '<div class="next-row"><a class="btn-next" href="#/search">NEXT ITEM →</a></div>';
      return frame(h);
    }

    if (item.alsoDepot && !hasOptions) {
      // Figma "06": two answers, then the link to the map
      h += answerBox(ctx, item.bin) +
        '<section class="answer" aria-label="Or: bottle depot"><p class="answer-text">BOTTLE DEPOT</p></section>' +
        '<button type="button" class="link link-pin" data-action="panel" data-panel="map" data-filter="depot">' + img('pin.svg', 20) + 'Find location near me!</button>' +
        '<p class="body">' + esc(item.how) + ' Drink containers can also go to a bottle depot for the deposit refund.</p>' +
        sourceLine(item) + '<div class="next-row"><a class="btn-next" href="#/search">NEXT ITEM →</a></div>';
      return frame(h);
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

    h += sourceLine(item) + '<div class="next-row"><a class="btn-next" href="#/search">NEXT ITEM →</a></div>';
    return frame(h);
  }

  function savedRow(ctx, r) {
    var it = r.item;
    var choiceLabel = it.options && r.entry.choice != null && it.options[r.entry.choice] ? it.options[r.entry.choice].label : '';
    return (
      '<li class="saved-row' + (r.entry.sorted ? ' is-sorted' : '') + '">' + pic(it.img, 'ph-64', itemTone(it, r.entry.choice)) +
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

  // Figma "03 Category page": title, banner picture, and a grid of sub-categories.
  // A category without sub-categories goes straight to its item list (Figma "04").
  function categoryPage(ctx, cat, list) {
    if (!cat.subs) return itemListPage(ctx, cat.name, list, '#/categories');
    return frame(navBar(ctx, '#/categories') + '<h1 class="h1 h1-lg">' + esc(cat.name) + '</h1>' +
      picBanner(cat.subs.map(function (s) { return s.img; }).filter(Boolean).slice(0, 4)) +
      '<ul class="tiles">' + cat.subs.map(function (s) {
        return tile('#/category/' + cat.id + '/' + s.id, s.name, s.img);
      }).join('') + '</ul>');
  }

  // Figma "04 Sub-category page": title and a list of items.
  function subCategoryPage(ctx, cat, sub, list) {
    return itemListPage(ctx, sub.name, list, '#/category/' + cat.id);
  }

  function itemListPage(ctx, title, list, fallback) {
    list = list.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    return frame(navBar(ctx, fallback) + '<h1 class="h1 h1-lg">' + esc(title) + '</h1>' + rows(ctx, list));
  }

  // Figma "02 Crash Course page": big cart, title, then the items that go in it.
  function binPage(ctx, bin, list) {
    var b = ctx.data.BINS[bin];
    list = list.slice().sort(function (a, b2) { return a.name.localeCompare(b2.name); });
    var art = BIN_CART[bin]
      ? img(bin === 'blue' ? 'bin-blue-large.svg' : BIN_CART[bin], 96, 112, 'bin-cart-lg')
      : img('warning.svg', 64, 64, 'bin-cart-lg');
    var title = bin === 'dropoff' ? 'DROP-OFF ONLY — SPECIAL ITEMS' : 'THE ' + b.label + ' — ' + b.name.toUpperCase();
    var info = (ctx.data.BIN_INFO || {})[bin];
    var text = info
      ? '<div class="crash-text">' +
        '<div class="prep"><p class="prep-title">What goes in</p><p>' + esc(info.goes) + '</p></div>' +
        '<div class="prep"><p class="prep-title">What never goes in</p><p>' + esc(info.never) + '</p></div>' +
        '<div class="prep"><p class="prep-title">Tip</p><p>' + esc(info.tip) + '</p></div></div>'
      : '';
    return frame(
      navBar(ctx, '#/') +
      '<div class="bin-head">' + art + '<h1 class="bin-title">' + esc(title) + '</h1></div>' +
      binBanner(ctx, bin, list) + text +
      label('ITEMS IN OUR GUIDE') + rows(ctx, list)
    );
  }

  // Where the answer comes from (the City page), under every item answer.
  function sourceLine(item) {
    if (!item.source) return '';
    return '<p class="source">Source: <a href="' + esc(item.source) + '" target="_blank" rel="noopener">City of Calgary, What Goes Where</a></p>';
  }

  // Crash course banner: the bin's own picture, then up to three items that go in it.
  function binBanner(ctx, bin, list) {
    var info = (ctx.data.BIN_INFO || {})[bin] || {};
    var files = [];
    if (info.img) files.push(info.img);
    list.forEach(function (it) {
      if (it.bin === bin && it.img && files.indexOf(it.img) < 0 && files.length < 4) files.push(it.img);
    });
    return picBanner(files, bin);
  }

  function notFoundPage(ctx, what) {
    return frame(navBar(ctx, '#/') + '<h1 class="h1">' + esc(what || 'Page not found') + '</h1>' +
      '<p class="body">We could not find this page. Try searching instead.</p>' + searchForm(''));
  }

  // ---------- building guide (Figma "18 Building guide") ----------

  // Figma "18b Building guide – Your building"
  function buildingPage(ctx, address) {
    var cards = address.items.map(function (b) {
      var it = ctx.byId[b.id];
      if (!it) return '';
      return '<a class="option" href="#/building/' + esc(address.id) + '/' + esc(it.id) + '">' +
        '<span class="option-text"><span class="option-label">' + esc(it.name) + '</span><span class="option-note">' + esc(b.note) + '</span></span>' +
        binTag(ctx, it.bin, true) + '</a>';
    }).join('');
    return frame(
      navBar(ctx, '#/') +
      '<h1 class="h1 h1-md">Building waste guide</h1>' +
      '<p class="body">Here is what we know about your building:</p>' +
      '<div class="grey-box">' + img('pin-addr.svg', 22) +
      '<div class="grey-box-main"><p class="grey-box-title grey-box-title-lg">' + esc(address.short) + '</p><p class="muted">' + esc(address.kind) + '</p></div>' +
      '<button type="button" class="link link-small" data-action="panel" data-panel="building">Change</button></div>' +
      '<div class="card"><p class="card-title">Where to take your waste</p><p>' + esc(address.where) + '</p>' +
      '<p class="small muted">Placeholder data. Real details would come from the building.</p></div>' +
      '<p class="options-q">What are you sorting?</p>' +
      '<div class="options">' + cards + '</div>'
    );
  }

  // Figma "18f Building guide – Building details unavailable"
  function buildingUnknownPage(ctx) {
    return frame(
      navBar(ctx, '#/') +
      '<h1 class="h1 h1-md">Building details unavailable</h1>' +
      '<p class="body">We don\'t have waste details for this address yet.</p>' +
      '<div class="grey-box">' + img('info-24.svg', 22) + '<p>Check the signs near your bins, or ask your property manager.</p></div>' +
      '<a class="btn btn-outline" href="#/search">Search an item instead</a>' +
      '<button type="button" class="btn btn-outline" data-action="panel" data-panel="building">Try another address</button>' +
      '<button type="button" class="btn btn-outline" data-action="call">Call 311</button>'
    );
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
      ['map', 'Special Disposal Centres', 'pin-24.svg'],
      ['building', 'Building waste guide', 'building.svg'],
      ['help', 'Need Help', 'help.svg'],
      ['language', 'Language (ENG)', 'globe.svg'],
    ];
    return dialog('More', '<div class="menu-rows">' + list.map(function (m) {
      return '<button type="button" class="menu-row" data-action="panel" data-panel="' + m[0] + '"><span>' + esc(m[1]) + '</span>' + img(m[2], 24) + '</button>';
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

  // Figma "09 Camera pop-up". Demo: the capture button pretends the photo shows a pop can;
  // "Browse device" pretends the chosen picture was not recognised (Figma "09b").
  function photoDialog() {
    return dialog('Photo search',
      '<div class="viewfinder" aria-hidden="true">' + placeholder('ph-200') + img('corner-brackets.svg', 260, 260, 'brackets') + '</div>' +
      '<p class="camera-dots" aria-hidden="true">•••</p>' +
      '<p class="camera-text">Point the camera at the item and tap the button.</p>' +
      '<p class="small muted center">Demo: the photo is not really read. It always finds a pop can.</p>' +
      '<button type="button" class="capture" data-action="photo-capture" aria-label="Take a photo">' + img('capture.svg', 76) + '</button>',
      '<button type="button" class="btn btn-outline" data-action="photo-browse">BROWSE DEVICE</button>',
      { center: true, hideTitle: true });
  }

  // Figma "09b Camera pop-up – Scan failed (next steps)"
  function scanFailedDialog() {
    return dialog('We couldn\'t recognise this item',
      '<div class="viewfinder" aria-hidden="true">' + placeholder('ph-200') + img('corner-brackets.svg', 260, 260, 'brackets') + '</div>' +
      '<p class="scan-title">We couldn\'t recognise this item</p>' +
      '<p class="muted">Try one of these next steps:</p>',
      '<button type="button" class="btn btn-outline" data-action="panel" data-panel="photo">Try again (better light, closer)</button>' +
      '<a class="btn btn-outline" href="#/search">Type the name instead</a>' +
      '<a class="btn btn-outline" href="#/az">Browse the A–Z list</a>' +
      '<button type="button" class="btn btn-outline" data-action="report" data-photo="1">Report missing item (photo attached)</button>',
      { center: true, hideTitle: true });
  }

  function dropdown(id, name, options, selected) {
    return '<div class="dd"><select class="input dd-select" id="' + id + '" name="' + name + '">' +
      options.map(function (o) {
        return '<option' + (o === selected ? ' selected' : '') + '>' + esc(o) + '</option>';
      }).join('') + '</select></div>';
  }

  var ISSUES = ['Issue Form', 'Missing item', 'Wrong answer', 'Problem with the app', 'Other'];

  function callButton() {
    return '<button type="button" class="btn btn-outline" data-action="call">Call Helpline (311)' + img('phone.svg', 20) + '</button>';
  }

  // Figma "12 Help pop-up"
  function helpDialog(error) {
    return dialog('Need Help',
      '<form id="help-form" class="form" data-form="help" novalidate>' +
      '<label class="sr-only" for="help-type">Type of issue</label>' + dropdown('help-type', 'type', ISSUES, 'Issue Form') +
      '<label class="sr-only" for="help-issue">Issue</label>' +
      '<input class="input' + (error ? ' has-error' : '') + '" id="help-issue" name="issue" type="text" data-autofocus placeholder="Issue (i.e. &quot;missing item&quot;)"' +
      (error ? ' aria-invalid="true" aria-describedby="help-error"' : '') + '>' +
      (error ? '<p class="error" id="help-error" role="alert">' + esc(error) + '</p>' : '') +
      '<label class="sr-only" for="help-details">Other details</label>' +
      '<textarea class="input input-tall" id="help-details" name="details" placeholder="Other Details"></textarea>' +
      '<button type="submit" class="btn btn-small">Submit</button></form>' +
      '<div class="spacer" aria-hidden="true"></div>',
      callButton(), { hideTitle: true });
  }

  // Figma "12b Report missing item (from failed scan)"
  function reportDialog(prefill, error, note, withPhoto) {
    return dialog('Report missing item',
      '<form id="report-form" class="form" data-form="report" novalidate>' +
      '<input type="hidden" name="photo" value="' + (withPhoto ? '1' : '') + '">' +
      '<label class="sr-only" for="report-type">Type of issue</label>' + dropdown('report-type', 'type', ISSUES.slice(1), 'Missing item') +
      '<label class="sr-only" for="report-item">Item you were looking for</label>' +
      '<input class="input' + (error ? ' has-error' : '') + '" id="report-item" name="what" type="text" data-autofocus placeholder="Item (i.e. &quot;bike tube&quot;)" value="' + esc(prefill) + '" required' +
      (error ? ' aria-invalid="true" aria-describedby="report-error"' : '') + '>' +
      (error ? '<p class="error" id="report-error" role="alert">' + esc(error) + '</p>' : '') +
      '<label class="sr-only" for="report-note">Other details</label>' +
      '<textarea class="input input-tall" id="report-note" name="note" placeholder="' + (withPhoto ? 'Photo from your scan is attached.' : 'Other Details') + '">' + esc(note || '') + '</textarea>' +
      (withPhoto ? '<div class="attached">' + placeholder('ph-56') + '<span>scan_photo.jpg — attached</span></div>' : '') +
      '<div class="grey-box">' + img('bell-20.svg', 20) + '<p>We usually reply within 2 business days. You\'ll get a notification telling you which bin it goes in.</p></div>' +
      '<button type="submit" class="btn btn-small">Submit</button></form>',
      callButton(), { hideTitle: true });
  }

  // Figma "12c Report sent + notification"
  function reportSentDialog(what) {
    return dialog('Report sent',
      '<div class="confirm-box">' + img('check-22.svg', 22) +
      '<p>Thanks! We got your report about &ldquo;' + esc(what) + '&rdquo;. Expect an answer within 2 business days.</p></div>' +
      '<p class="small muted">Until then, keep it aside. Don\'t put it in a cart if you\'re not sure.</p>' +
      '<p class="small muted">Prototype: nothing was really sent.</p>' +
      label('LATER: NOTIFICATION') +
      '<div class="notif">' + img('bell-22.svg', 22) + '<div class="notif-text">' +
      '<p class="notif-app">What Goes Where · now</p>' +
      '<p class="notif-title">Your ' + esc(what) + ' goes in the Black bin</p>' +
      '<p>Example reply. Tap to open the item and add it to your list.</p></div></div>',
      '<button type="button" class="btn btn-outline" data-action="close-modal">Done</button>');
  }

  // Figma "12d call confirmation"
  function callDialog() {
    return dialog('311 Confirmation',
      '<div class="confirm-box">' + img('check-22.svg', 22) +
      '<p>Please confirm that you would like to call 311, the following confirmation will redirect you to a direct call!</p></div>',
      '<a class="btn btn-outline" href="tel:311">Call 311' + img('phone.svg', 20) + '</a>' +
      '<button type="button" class="btn btn-outline btn-cancel" data-action="close-modal">Cancel</button>');
  }

  // Figma "13 Language pop-up"
  function languageDialog(languages) {
    return dialog('Language', '<div class="menu-rows">' + languages.map(function (l) {
      return '<button type="button" class="btn btn-outline" lang="' + esc(l.code) + '" data-action="language-pick" data-name="' + esc(l.name) + '">' + esc(l.name) + '</button>';
    }).join('') + '</div>', '', { hideTitle: true });
  }

  // Figma "10 Calendar pop-up". Example schedule: green every week, blue and black on alternate weeks.
  function calendarDialog(place) {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var days = new Date(year, month + 1, 0).getDate();
    var monthName = now.toLocaleString('en', { month: 'long' }).toUpperCase();
    var NAMES = { blue: 'Blue bin (recycling)', green: 'Green bin (compost)', black: 'Black bin (garbage)' };
    var cells = '';
    for (var d = 1; d <= days; d++) {
      var bin = d % 7 === 3 ? 'green' : d % 7 === 2 ? (Math.floor(d / 7) % 2 === 0 ? 'blue' : 'black') : '';
      cells += '<div class="cal-day"' + (bin ? ' aria-label="' + monthName + ' ' + d + ': ' + NAMES[bin] + '"' : '') + '>' +
        '<span aria-hidden="' + (bin ? 'true' : 'false') + '">' + d + '</span>' + (bin ? img('dot-' + bin + '.svg', 7) : '') + '</div>';
    }
    for (var e = days; e % 7 !== 0; e++) cells += '<div class="cal-day" aria-hidden="true"></div>';
    return dialog('Calendar Schedule',
      '<form class="search" data-form="place" role="search">' +
      '<label class="sr-only" for="place-q">Your address</label>' +
      '<div class="field"><input id="place-q" name="q" type="search" placeholder="Search (i.e. &quot;Rundle&quot;)" autocomplete="off">' +
      '<button type="submit" class="field-btn" aria-label="Search">' + img('search.svg', 24) + '</button></div></form>' +
      '<button type="button" class="link" data-action="find-me">Find me!</button>' +
      '<p class="cal-month">' + (place ? esc(monthName + ' · ' + place) : monthName) + '</p>' +
      '<div class="cal" role="list" aria-label="Collection days">' + cells + '</div>' +
      '<p class="cal-legend">' + img('dot-blue.svg', 7) + 'Blue ' + img('dot-green.svg', 7) + 'Green ' + img('dot-black.svg', 7) + 'Black</p>' +
      '<p class="small muted">Example schedule. The real one depends on your address.</p>',
      '', { hideTitle: true });
  }

  // Figma "11 Map pop-up" and "11b … Pin info card"
  function mapDialog(demo, hidden) {
    hidden = hidden || {};
    var filters = demo.FILTERS.map(function (f) {
      return '<label class="filter"><span class="check"><input type="checkbox" data-change="map-filter" data-type="' + f.type + '"' + (hidden[f.type] ? '' : ' checked') + '>' +
        '<span class="check-box" aria-hidden="true">' + img('checkbox-checked.svg', 24) + '</span></span>' +
        img('map-pin-' + f.type + '-20.svg', 20) + '<span>' + esc(f.label) + '</span></label>';
    }).join('');
    var pins = demo.SITES.map(function (s) {
      var f = demo.FILTERS.filter(function (x) { return x.type === s.type; })[0];
      return '<button type="button" class="pin pin-' + s.type + '" style="left:' + (s.x / 310 * 100) + '%;top:' + (s.y / 260 * 100) + '%" ' +
        'data-action="map-pin" data-id="' + esc(s.id) + '" aria-label="' + esc(f.label + ': ' + s.name + ', ' + s.distance) + '">' +
        '<img class="pin-ring" src="' + A + 'map-ring.png" width="54" height="54" alt="">' +
        img('map-pin-' + s.type + '.svg', 26) + '</button>';
    }).join('');
    var hide = Object.keys(hidden).filter(function (k) { return hidden[k]; }).join(' ');
    return dialog('Special Disposal Centres',
      '<form class="search" data-form="place" role="search">' +
      '<label class="sr-only" for="place-q">Search a place</label>' +
      '<div class="field"><input id="place-q" name="q" type="search" placeholder="Search (i.e. &quot;Bundle&quot;)" autocomplete="off">' +
      '<button type="submit" class="field-btn" aria-label="Search">' + img('search.svg', 24) + '</button></div></form>' +
      '<button type="button" class="link" data-action="find-me">Find me!</button>' +
      '<fieldset class="filters"><legend class="sr-only">Show on the map</legend>' + filters + '</fieldset>' +
      '<div class="map" data-hide="' + hide + '">' + img('map-roads.svg', 310, 260, 'map-roads') + pins + '</div>' +
      '<div id="pin-card" aria-live="polite"></div>',
      '', { hideTitle: true });
  }

  function pinCard(site) {
    var rowsHtml = [['Accepts', site.accepts], ['Hours', site.hours], ['Fees', site.fees], ['Distance', site.distance]].map(function (r) {
      return '<div class="pin-row"><span class="pin-row-k">' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span></div>';
    }).join('');
    return '<div class="pin-card"><div class="pin-card-top">' + img('map-pin-' + site.type + '-20.svg', 21) +
      '<p class="pin-card-title">' + esc(site.name) + '</p></div>' + rowsHtml +
      '<p class="tiny muted">Placeholder data — real details come from the City\'s site list.</p>' +
      '<div class="pin-card-btns"><button type="button" class="btn btn-small" data-action="demo" data-msg="Demo: directions would open in your maps app.">Directions</button>' +
      '<button type="button" class="btn btn-small" data-action="call">Call site</button></div></div>';
  }

  // Figma "18 Building guide – Where do you live?"
  function buildingDialog(addresses) {
    return dialog('Building waste guide',
      '<form id="building-form" class="form" data-form="building" autocomplete="off">' +
      '<p class="options-q">Where do you live?</p>' +
      '<label class="form-label form-label-sm" for="addr">Street address</label>' +
      '<input class="input" id="addr" name="addr" type="text" data-autofocus placeholder="123 Example St" aria-controls="addr-list" aria-describedby="addr-hint">' +
      '<p id="addr-hint" class="small muted">Example: 123 Example St NW. Placeholder address.</p>' +
      '<ul id="addr-list" class="addr-list" aria-label="Suggested addresses">' + addressList(addresses) + '</ul>' +
      '<div class="next-row"><button type="submit" class="btn-next">GET GUIDANCE →</button></div></form>',
      '');
  }

  function addressList(addresses) {
    return addresses.map(function (a) {
      return '<li><a class="addr" href="#/building/' + esc(a.known ? a.id : 'unknown') + '">' + img('pin-addr.svg', 20) + '<span>' + esc(a.label) + '</span></a></li>';
    }).join('');
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
    azPage: azPage, categoriesPage: categoriesPage, categoryPage: categoryPage, subCategoryPage: subCategoryPage, binPage: binPage,
    buildingPage: buildingPage, buildingUnknownPage: buildingUnknownPage,
    notFoundPage: notFoundPage, stubDialog: stubDialog, menuDialog: menuDialog, howSavingDialog: howSavingDialog,
    photoDialog: photoDialog, scanFailedDialog: scanFailedDialog, helpDialog: helpDialog,
    reportDialog: reportDialog, reportSentDialog: reportSentDialog, callDialog: callDialog,
    languageDialog: languageDialog, calendarDialog: calendarDialog, mapDialog: mapDialog, pinCard: pinCard,
    buildingDialog: buildingDialog, addressList: addressList,
    confirmDialog: confirmDialog, suggestList: suggestList,
  };
})(typeof window !== 'undefined' ? window : globalThis);
