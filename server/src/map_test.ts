import * as assert from 'assert';
import { MutableMap, createTSMutableMap } from "./map";

describe('Map', function() {
  let map: MutableMap<number>;

  beforeEach(function() {
    map = createTSMutableMap<number>();
  });

  it('contains', function() {
    // 0-1-many: base case
    assert.deepStrictEqual(map.contains("x"), false);
    assert.deepStrictEqual(map.contains("y"), false);
    // 0-1-many
    map.set("x", 1);
    assert.deepStrictEqual(map.contains("x"), true);
    assert.deepStrictEqual(map.contains("y"), false);
    // 0-1-many
    map.set("y", 2);
    map.set("z", 3);
    assert.deepStrictEqual(map.contains("x"), true);
    assert.deepStrictEqual(map.contains("y"), true);
    assert.deepStrictEqual(map.contains("z"), true);
    assert.deepStrictEqual(map.contains("w"), false);
  });

  it('get', function() {
    // 0-1-many
    map.set("x", 1);
    assert.deepStrictEqual(map.get("x"), 1);
    // 0-1-many
    map.set("y", 2);
    map.set("z", 3);
    assert.deepStrictEqual(map.get("x"), 1);
    assert.deepStrictEqual(map.get("y"), 2);
    assert.deepStrictEqual(map.get("z"), 3);
  });

  it('set', function() {
    // 0-1-many: base case
    assert.deepStrictEqual(map.set("x", 1), false);
    assert.deepStrictEqual(map.get("x"), 1);
    // 0-1-many
    assert.deepStrictEqual(map.set("x", 2), true);
    assert.deepStrictEqual(map.get("x"), 2);
    // 0-1-many
    map.set("y", 3);
    map.set("z", 4);
    assert.deepStrictEqual(map.set("y", 5), true);
    assert.deepStrictEqual(map.get("x"), 2);
    assert.deepStrictEqual(map.get("y"), 5);
    assert.deepStrictEqual(map.get("z"), 4);
  });

  it('clear', function() {
    // 0-1-many: base case
    map.clear();
    assert.deepStrictEqual(map.contains("x"), false);
    // 0-1-many
    map.set("x", 1);
    map.clear();
    assert.deepStrictEqual(map.contains("x"), false);
    // 0-1-many
    map.set("x", 1);
    map.set("y", 2);
    map.set("z", 3);
    map.clear();
    assert.deepStrictEqual(map.contains("x"), false);
    assert.deepStrictEqual(map.contains("y"), false);
    assert.deepStrictEqual(map.contains("z"), false);
  });

  it('keys', function() {
    // 0-1-many: base case
    assert.deepStrictEqual(map.keys(), []);

    // 0-1-many
    map.set("x", 1);
    assert.deepStrictEqual(map.keys(), ["x"]);

    // 0-1-many
    map.set("y", 2);
    map.set("z", 3);
    assert.deepStrictEqual(map.keys().sort(), ["x", "y", "z"].sort());
  });
});
