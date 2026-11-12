/*
 * Saved items and settings, kept in the browser (localStorage).
 * There is no server. If localStorage is blocked (private window, strict settings),
 * everything still works until the page is closed: the data just stays in memory.
 *
 * Works in the browser (window.WGW_STORE) and in Node (createStore, for tests/store.test.js).
 */
(function (root) {
  var KEY = 'wgw.v1';
  var MAX_RECENT = 5;

  function createStore(storage, options) {
    var defaultAutosave = !(options && options.defaultAutosave === false);
    var listeners = [];
    var persistent = true; // false once a write has failed
    var state = read();

    function blank() {
      return { saved: [], autosave: defaultAutosave, recent: [] };
    }

    function read() {
      try {
        var raw = storage && storage.getItem(KEY);
        if (raw) {
          var d = JSON.parse(raw);
          if (d && Array.isArray(d.saved)) {
            return {
              saved: d.saved.filter(function (e) {
                return e && typeof e.id === 'string';
              }),
              autosave: typeof d.autosave === 'boolean' ? d.autosave : defaultAutosave,
              recent: Array.isArray(d.recent) ? d.recent.filter(function (q) { return typeof q === 'string'; }) : [],
            };
          }
        }
      } catch (e) {
        /* unreadable data: start fresh */
      }
      return blank();
    }

    function write() {
      try {
        if (storage) storage.setItem(KEY, JSON.stringify(state));
        persistent = true;
      } catch (e) {
        persistent = false;
      }
    }

    function changed() {
      write();
      listeners.forEach(function (fn) {
        try {
          fn();
        } catch (e) {
          /* a broken listener must not stop the others */
        }
      });
    }

    function indexOf(id) {
      for (var i = 0; i < state.saved.length; i++) if (state.saved[i].id === id) return i;
      return -1;
    }

    return {
      // newest first
      getSaved: function () {
        return state.saved
          .slice()
          .sort(function (a, b) {
            return b.ts - a.ts;
          })
          .map(function (e) {
            return { id: e.id, ts: e.ts, sorted: !!e.sorted, choice: e.choice == null ? null : e.choice };
          });
      },
      isSaved: function (id) {
        return indexOf(id) >= 0;
      },
      getEntry: function (id) {
        var i = indexOf(id);
        if (i < 0) return null;
        var e = state.saved[i];
        return { id: e.id, ts: e.ts, sorted: !!e.sorted, choice: e.choice == null ? null : e.choice };
      },
      // choice = index of the chosen option for "it depends" items, otherwise null
      save: function (id, choice) {
        var i = indexOf(id);
        var c = choice == null ? null : choice;
        if (i >= 0) {
          if (state.saved[i].choice === c) return; // nothing changed
          state.saved[i].choice = c;
          state.saved[i].sorted = false; // a different answer has to be sorted again
        } else {
          state.saved.push({ id: id, ts: Date.now(), sorted: false, choice: c });
        }
        changed();
      },
      unsave: function (id) {
        var i = indexOf(id);
        if (i < 0) return null;
        var removed = state.saved.splice(i, 1)[0];
        changed();
        return removed; // so the caller can offer "Undo"
      },
      restore: function (entry) {
        if (!entry || indexOf(entry.id) >= 0) return;
        state.saved.push(entry);
        changed();
      },
      setSorted: function (id, value) {
        var i = indexOf(id);
        if (i < 0) return;
        state.saved[i].sorted = !!value;
        changed();
      },
      removeSorted: function () {
        var before = state.saved.length;
        state.saved = state.saved.filter(function (e) {
          return !e.sorted;
        });
        if (state.saved.length !== before) changed();
        return before - state.saved.length;
      },
      clearAll: function () {
        if (!state.saved.length) return;
        state.saved = [];
        changed();
      },
      getAutosave: function () {
        return state.autosave;
      },
      setAutosave: function (value) {
        state.autosave = !!value;
        changed();
      },
      getRecent: function () {
        return state.recent.slice();
      },
      addRecent: function (q) {
        var t = String(q || '').trim();
        if (!t) return;
        state.recent = [t].concat(
          state.recent.filter(function (x) {
            return x.toLowerCase() !== t.toLowerCase();
          })
        ).slice(0, MAX_RECENT);
        changed();
      },
      clearRecent: function () {
        state.recent = [];
        changed();
      },
      isPersistent: function () {
        return persistent;
      },
      onChange: function (fn) {
        listeners.push(fn);
      },
    };
  }

  root.WGW_CREATE_STORE = createStore;
  if (typeof module !== 'undefined' && module.exports) module.exports = { createStore: createStore, KEY: KEY };

  if (typeof window !== 'undefined') {
    var storage = null;
    try {
      storage = window.localStorage;
      storage.getItem(KEY); // some browsers only throw on use
    } catch (e) {
      storage = null;
    }
    var cfg = window.WGW_CONFIG || {};
    root.WGW_STORE = createStore(storage, { defaultAutosave: cfg.DEFAULT_AUTOSAVE !== false });
  }
})(typeof window !== 'undefined' ? window : globalThis);
