// Run with: node tests/data.test.js
// Checks that data/items.js is complete, so a typo in a new item is caught before the demo.
var assert = require('assert');
var D = require('../data/items.js');

var catIds = D.CATEGORIES.map(function (c) { return c.id; });
var seen = {};

D.ITEMS.forEach(function (it) {
  var where = 'item "' + it.id + '": ';
  assert.ok(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(it.id), where + 'id must be lowercase-with-dashes');
  assert.ok(!seen[it.id], where + 'duplicate id');
  seen[it.id] = true;
  assert.ok(it.name, where + 'name');
  assert.ok(catIds.indexOf(it.category) >= 0, where + 'unknown category ' + it.category);
  assert.ok(it.how, where + 'how');
  if (it.options) {
    assert.ok(!it.bin, where + 'has options, so it must not also have bin');
    assert.ok(it.options.length >= 2, where + 'options need at least two choices');
    it.options.forEach(function (o) {
      assert.ok(o.label && o.note, where + 'option needs label and note');
      assert.ok(D.BINS[o.bin], where + 'option has unknown bin ' + o.bin);
    });
  } else {
    assert.ok(D.BINS[it.bin], where + 'unknown bin ' + it.bin);
  }
  if (it.bin === 'dropoff') assert.ok(it.warning || it.category === 'electronics', where + 'drop-off items need a warning (or be electronics)');
});

D.CATEGORIES.forEach(function (c) {
  assert.ok(D.ITEMS.some(function (it) { return it.category === c.id; }), 'category "' + c.id + '" has no items');
});

// the demo "no answer" searches must stay unanswered
['bike tube', 'car parts'].forEach(function (name) {
  assert.ok(!D.ITEMS.some(function (it) {
    return it.name.toLowerCase() === name || (it.aliases || []).indexOf(name) >= 0;
  }), name + ' must not be in the data (used to show the no-result screen)');
});

console.log('data.test.js: all passed (' + D.ITEMS.length + ' items)');
