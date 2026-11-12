// Run with: node tests/store.test.js
var assert = require('assert');
var createStore = require('../js/store.js').createStore;
var KEY = require('../js/store.js').KEY;

function fakeStorage(initial) {
  var data = {};
  if (initial !== undefined) data[KEY] = initial;
  return {
    data: data,
    getItem: function (k) { return k in data ? data[k] : null; },
    setItem: function (k, v) { data[k] = String(v); },
  };
}

// save / unsave / restore
var st = fakeStorage();
var s = createStore(st);
assert.strictEqual(s.getAutosave(), true, 'autosave defaults to on');
s.save('pop-can');
s.save('cup', 2);
assert.strictEqual(s.isSaved('pop-can'), true);
assert.strictEqual(s.getEntry('cup').choice, 2);
assert.strictEqual(s.getSaved().length, 2);
var removed = s.unsave('pop-can');
assert.strictEqual(s.isSaved('pop-can'), false);
s.restore(removed);
assert.strictEqual(s.isSaved('pop-can'), true, 'undo works');
assert.strictEqual(s.unsave('nope'), null);

// sorted + removeSorted
s.setSorted('cup', true);
assert.strictEqual(s.getEntry('cup').sorted, true);
s.save('cup', 0); // a different answer: has to be sorted again
assert.strictEqual(s.getEntry('cup').sorted, false);
s.setSorted('cup', true);
assert.strictEqual(s.removeSorted(), 1);
assert.strictEqual(s.getSaved().length, 1);

// persists
var again = createStore(st);
assert.strictEqual(again.isSaved('pop-can'), true, 'saved data survives a reload');
s.setAutosave(false);
assert.strictEqual(createStore(st).getAutosave(), false, 'setting survives a reload');

// recent searches: newest first, no duplicates, max 5
var r = createStore(fakeStorage());
['a1', 'b2', 'c3', 'd4', 'e5', 'f6', 'B2'].forEach(function (q) { r.addRecent(q); });
assert.deepStrictEqual(r.getRecent(), ['B2', 'f6', 'e5', 'd4', 'c3']);

// events
var calls = 0;
var ev = createStore(fakeStorage());
ev.onChange(function () { calls++; });
ev.save('x');
ev.setSorted('x', true);
assert.strictEqual(calls, 2);

// bad data in storage: start fresh instead of crashing
assert.strictEqual(createStore(fakeStorage('{not json')).getSaved().length, 0);
assert.strictEqual(createStore(fakeStorage('{"saved":"oops"}')).getSaved().length, 0);
assert.strictEqual(createStore(fakeStorage(JSON.stringify({ saved: [{ id: 5 }, { id: 'ok' }] }))).getSaved().length, 1);

// storage that throws (private window): still works in memory
var broken = { getItem: function () { throw new Error('blocked'); }, setItem: function () { throw new Error('blocked'); } };
var b = createStore(broken);
b.save('pop-can');
assert.strictEqual(b.isSaved('pop-can'), true, 'works in memory');
assert.strictEqual(b.isPersistent(), false, 'and says it is not kept');
var none = createStore(null);
none.save('x');
assert.strictEqual(none.isSaved('x'), true, 'works with no storage at all');

// config default
assert.strictEqual(createStore(fakeStorage(), { defaultAutosave: false }).getAutosave(), false);

console.log('store.test.js: all passed');
