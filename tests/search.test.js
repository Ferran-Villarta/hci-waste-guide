// Run with: node tests/search.test.js
var assert = require('assert');
var D = require('../data/items.js');
var S = require('../js/search.js');

function ids(q) {
  return S.search(q, D.ITEMS).map(function (i) { return i.id; });
}

// finds things
assert.ok(ids('pizza').indexOf('pizza-box') >= 0, 'pizza -> pizza box');
assert.strictEqual(ids('pop can')[0], 'pop-can', 'exact start ranks first');
assert.ok(ids('ZIPLOC').indexOf('food-soiled-bag') >= 0, 'nickname + upper case');
assert.ok(ids('  coffee   cup ').indexOf('cup') >= 0, 'extra spaces');
assert.ok(ids('plastic bag').indexOf('food-soiled-bag') >= 0, 'every word has to match, any order');

// nothing found (these two are the demo "no result" searches)
assert.strictEqual(ids('bike tube').length, 0, 'bike tube has no answer');
assert.strictEqual(ids('car parts').length, 0, 'car parts has no answer');
assert.strictEqual(ids('').length, 0, 'empty query');
assert.strictEqual(ids('   ').length, 0, 'blank query');

// did you mean
assert.strictEqual(S.suggest('cardbord', D.ITEMS), 'cardboard');
assert.strictEqual(S.suggest('pizzza box', D.ITEMS), 'pizza box');
assert.strictEqual(S.suggest('batery', D.ITEMS), 'battery', 'battery beats bakery');
assert.strictEqual(S.suggest('pizaz', D.ITEMS), 'pizza', 'swapped letters');
assert.strictEqual(S.suggest('pizza', D.ITEMS), null, 'correct words get no suggestion');
assert.strictEqual(S.suggest('piz', D.ITEMS), null, 'part of a word (still typing) gets no suggestion');
assert.strictEqual(S.suggest('bike tube', D.ITEMS), null, 'no suggestion that leads nowhere');
assert.strictEqual(S.suggest('car parts', D.ITEMS), null);
assert.strictEqual(S.suggest('', D.ITEMS), null);

// helpers
assert.strictEqual(S.normalize('  Café -  Cup! '), 'cafe cup');
assert.strictEqual(S.distance('kitten', 'sitting'), 3);

console.log('search.test.js: all passed');
