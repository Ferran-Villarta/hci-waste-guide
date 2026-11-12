/*
 * Search: scoring and "Did you mean...?" suggestions.
 * Works in the browser (window.WGW_SEARCH) and in Node (for tests/search.test.js).
 */
(function (root) {
  // Lowercase, remove accents and punctuation, collapse spaces.
  function normalize(s) {
    return String(s == null ? '' : s)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function words(s) {
    var n = normalize(s);
    return n ? n.split(' ') : [];
  }

  // Edit distance. A swap of two neighbouring letters counts as one change ("pizaz" -> "pizza").
  function distance(a, b) {
    var i, j;
    var d = [];
    for (i = 0; i <= a.length; i++) {
      d[i] = [i];
    }
    for (j = 1; j <= b.length; j++) {
      d[0][j] = j;
    }
    for (i = 1; i <= a.length; i++) {
      for (j = 1; j <= b.length; j++) {
        var cost = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
        }
      }
    }
    return d[a.length][b.length];
  }

  function commonPrefix(a, b) {
    var n = 0;
    while (n < a.length && n < b.length && a[n] === b[n]) n++;
    return n;
  }

  // How well does one piece of text match the query? 0 = not at all.
  function scoreText(text, q) {
    if (!text) return 0;
    if (text === q) return 100; // exact
    if (text.indexOf(q) === 0) return 80; // starts with
    if ((' ' + text).indexOf(' ' + q) >= 0) return 60; // a word starts with
    if (text.indexOf(q) >= 0) return 40; // contains
    return 0;
  }

  function scoreItem(item, q, tokens) {
    var name = normalize(item.name);
    var aliases = (item.aliases || []).map(normalize);
    var best = scoreText(name, q);
    aliases.forEach(function (a) {
      var s = scoreText(a, q);
      if (s > 0) best = Math.max(best, s - 10); // a nickname ranks just under the real name
    });
    if (best === 0 && tokens.length > 1) {
      // "plastic bag": every word has to appear somewhere in the name or nicknames
      var hay = name + ' ' + aliases.join(' ');
      var all = tokens.every(function (t) {
        return hay.indexOf(t) >= 0;
      });
      if (all) best = 20;
    }
    return best;
  }

  // Returns the matching items, best first.
  function search(query, items) {
    var q = normalize(query);
    if (!q) return [];
    var tokens = q.split(' ');
    return items
      .map(function (it) {
        return { item: it, score: scoreItem(it, q, tokens) };
      })
      .filter(function (r) {
        return r.score > 0;
      })
      .sort(function (a, b) {
        return b.score - a.score || a.item.name.localeCompare(b.item.name);
      })
      .map(function (r) {
        return r.item;
      });
  }

  function vocabulary(items) {
    var seen = {};
    var list = [];
    items.forEach(function (it) {
      var ws = words(it.name);
      (it.aliases || []).forEach(function (a) {
        ws = ws.concat(words(a));
      });
      ws.forEach(function (w) {
        if (w.length >= 3 && !seen[w]) {
          seen[w] = true;
          list.push(w);
        }
      });
    });
    return list;
  }

  // "cardbord" -> "cardboard". Only returns a suggestion when the corrected text finds results.
  function suggest(query, items) {
    var tokens = words(query);
    if (!tokens.length) return null;
    var vocab = vocabulary(items);
    var changed = false;

    var fixed = tokens.map(function (t) {
      if (t.length < 3) return t;
      var known = vocab.some(function (w) {
        return w.indexOf(t) >= 0; // the word (or part of one) exists: leave it alone
      });
      if (known) return t;
      var maxDist = t.length <= 4 ? 1 : 2;
      var best = null;
      var bestKey = null;
      vocab.forEach(function (w) {
        var dist = distance(t, w);
        if (dist > maxDist) return;
        // closest first, then the longest shared start, then the closest length
        var key = [dist, -commonPrefix(t, w), Math.abs(t.length - w.length)];
        if (
          !bestKey ||
          key[0] < bestKey[0] ||
          (key[0] === bestKey[0] && (key[1] < bestKey[1] || (key[1] === bestKey[1] && key[2] < bestKey[2])))
        ) {
          best = w;
          bestKey = key;
        }
      });
      if (best) {
        changed = true;
        return best;
      }
      return t;
    });

    if (!changed) return null;
    var corrected = fixed.join(' ');
    return search(corrected, items).length ? corrected : null;
  }

  var api = { normalize: normalize, search: search, suggest: suggest, distance: distance };
  root.WGW_SEARCH = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
