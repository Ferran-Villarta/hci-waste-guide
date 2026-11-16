// Run with: node tests/data.test.js
// Checks that data/items.js is complete, so a typo in a new item is caught before the demo.
var assert = require('assert');
var fs = require('fs');
var path = require('path');
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
  if (it.category === 'hazardous') assert.ok(it.warning, where + 'hazardous items need a warning');
  assert.ok(/^https:\/\/www\.calgary\.ca\//.test(it.source || ''), where + 'source must be a calgary.ca page');
  assert.ok(it.img && fs.existsSync(path.join(__dirname, '..', 'assets', 'img', it.img)), where + 'picture missing: ' + it.img);
});

D.CATEGORIES.forEach(function (c) {
  assert.ok(D.ITEMS.some(function (it) { return it.category === c.id; }), 'category "' + c.id + '" has no items');
});

// every category, sub-category and bin has a picture that exists
function picOk(file) { return file && fs.existsSync(path.join(__dirname, '..', 'assets', 'img', file)); }
D.CATEGORIES.forEach(function (c) {
  assert.ok(picOk(c.img), 'category "' + c.id + '": picture missing');
  (c.subs || []).forEach(function (s) { assert.ok(picOk(s.img), 'sub-category "' + s.id + '": picture missing'); });
});
Object.keys(D.BINS).forEach(function (b) { assert.ok(picOk(D.BIN_INFO[b].img), 'bin "' + b + '": picture missing'); });

// sub-categories: every item in a category with subs has a known sub, and every sub has items
D.CATEGORIES.forEach(function (c) {
  var items = D.ITEMS.filter(function (it) { return it.category === c.id; });
  if (!c.subs) {
    items.forEach(function (it) { assert.ok(!it.sub, 'item "' + it.id + '": category ' + c.id + ' has no sub-categories'); });
    return;
  }
  var subIds = c.subs.map(function (s) { return s.id; });
  items.forEach(function (it) { assert.ok(subIds.indexOf(it.sub) >= 0, 'item "' + it.id + '": unknown sub ' + it.sub); });
  subIds.forEach(function (s) {
    assert.ok(items.some(function (it) { return it.sub === s; }), 'sub-category ' + c.id + '/' + s + ' has no items');
  });
});

// the demo "no answer" searches must stay unanswered
['bike tube', 'car parts'].forEach(function (name) {
  assert.ok(!D.ITEMS.some(function (it) {
    return it.name.toLowerCase() === name || (it.aliases || []).indexOf(name) >= 0;
  }), name + ' must not be in the data (used to show the no-result screen)');
});

// every bin has crash course text
Object.keys(D.BINS).forEach(function (b) {
  var info = D.BIN_INFO && D.BIN_INFO[b];
  assert.ok(info && info.goes && info.never && info.tip, 'bin "' + b + '" needs crash course text (goes, never, tip)');
});

// demo data (data/demo.js): building items must exist and have one bin; map sites need a known filter
var DEMO = require('../data/demo.js');
var byId = {};
D.ITEMS.forEach(function (it) { byId[it.id] = it; });
DEMO.ADDRESSES.forEach(function (a) {
  if (!a.known) return;
  a.items.forEach(function (b) {
    assert.ok(byId[b.id], 'building ' + a.id + ': unknown item ' + b.id);
    assert.ok(byId[b.id].bin && !byId[b.id].options, 'building ' + a.id + ': item ' + b.id + ' must have one bin');
  });
});
var types = DEMO.FILTERS.map(function (f) { return f.type; });
DEMO.SITES.forEach(function (s) {
  assert.ok(types.indexOf(s.type) >= 0, 'site ' + s.id + ': unknown type ' + s.type);
});

console.log('data.test.js: all passed (' + D.ITEMS.length + ' items)');
