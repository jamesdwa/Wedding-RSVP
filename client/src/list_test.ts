import * as assert from 'assert';
import { nil, cons, len, equal, at, concat, rev, remove, prefix, suffix,
         compact_list, explode_array } from './list';

         
describe('list', function() {

  it('len', function() {
    // 0-1-many: base case, 0 recursive calls
    assert.deepStrictEqual(len(nil), 0n);
    // 0-1-many: 1 recursive call
    assert.deepStrictEqual(len(cons(10n, nil)), 1n);
    assert.deepStrictEqual(len(cons(20n, nil)), 1n);
    // 0-1-many: 2+ recursive calls
    assert.deepStrictEqual(len(cons(10n, cons(20n, nil))), 2n);
    assert.deepStrictEqual(len(cons(30n, cons(20n, cons(10n, cons(0n, nil))))), 4n);
  });

  it('equal', function() {
    // 0-1-many: 0 recursive calls - first branch
    assert.deepStrictEqual(equal(nil, nil), true);
    assert.deepStrictEqual(equal(nil, cons(10n, nil)), false);
    // 0-1-many: 0 recursive calls - second branch
    assert.deepStrictEqual(equal(cons(10n, nil), nil), false);
    assert.deepStrictEqual(equal(cons(10n, cons(20n, nil)), nil), false);
    // 0-1-many: 0 recursive calls - third branch
    assert.deepStrictEqual(equal(cons(10n, nil), cons(20n, nil)), false);
    assert.deepStrictEqual(equal(cons(70n, nil), cons(10n, cons(20n, nil))), false);

    // 0-1-many: 1 recursive call - path ends in first branch
    assert.deepStrictEqual(equal(cons(30n, nil), cons(30n, nil)), true);
    assert.deepStrictEqual(equal(cons(50n, nil), cons(50n, cons(10n, nil))), false);
    // 0-1-many: 1 recursive call - path ends in second branch
    assert.deepStrictEqual(equal(cons(40n, cons(10n, nil)), cons(40n, nil)), false);
    assert.deepStrictEqual(
        equal(cons(60n, cons(10n, cons(20n, nil))), cons(60n, nil)), false);
    // 0-1-many: 1 recursive call - path ends in third branch
    assert.deepStrictEqual(
        equal(cons(50n, cons(10n, nil)), cons(50n, cons(20n, nil))), false);
    assert.deepStrictEqual(
        equal(cons(90n, cons(30n, nil)), cons(90n, cons(40n, cons(20n, nil)))), false);

    // 0-1-many: 2 recursive calls
    assert.deepStrictEqual(
        equal(cons(40n, cons(30n, nil)), cons(40n, cons(30n, nil))), true);
    assert.deepStrictEqual(
        equal(cons(70n, cons(60n, cons(10n, cons(40n, nil)))), cons(70n, cons(60n, cons(10n, cons(40n, nil))))), true);
    assert.deepStrictEqual(
        equal(cons(40n, cons(30n, cons(20n, nil))), cons(40n, cons(30n, cons(10n, cons(20n, nil))))), false);
  });

  it('at', function() {
    const L0 = nil;
    const L1 = cons(50n, nil);
    const L2 = cons(40n, cons(50n, nil));
    const L3 = cons(10n, cons(20n, cons(30n, nil)));
    const L4 = cons(90n, cons(80n, cons(70n, cons(60n, nil))));
  
    // 0-1-many: 0 recursive calls, nil case
    assert.throws(() => at(-1n, L0));
    assert.throws(() => at(0n, L0));
    assert.throws(() => at(-1n, L1));
    assert.throws(() => at(1n, L1));
  
    // 0-1-many: 0 recursive calls, x = 0 case
    assert.deepStrictEqual(at(0n, L1), 50n);
    assert.deepStrictEqual(at(0n, L3), 10n);
  
    // 0-1-many: 1 recursive call - hits nil base case
    assert.throws(() => at(1n, L0));
    assert.throws(() => at(1n, cons(70n, nil)));
  
    // 0-1-many: 1 recursive call - hits x = 0 base case
    assert.deepStrictEqual(at(1n, L2), 50n);
    assert.deepStrictEqual(at(1n, L3), 20n);
  
    // 0-1-many: 2+ recursive calls
    assert.deepStrictEqual(at(2n, L3), 30n);
    assert.deepStrictEqual(at(2n, L4), 70n);
    assert.deepStrictEqual(at(3n, L4), 60n);
    assert.throws(() => at(3n, L3));
    assert.throws(() => at(4n, L4));
  });

  it('concat', function() {
    // 0-1-many: base case, 0 recursive calls
    assert.deepStrictEqual(concat(nil, nil), nil);
    assert.deepStrictEqual(concat(nil, cons(10n, nil)), cons(10n, nil));
    assert.deepStrictEqual(concat(nil, cons(10n, cons(20n, nil))), cons(10n, cons(20n, nil)));
    // 0-1-many: 1 recursive call
    assert.deepStrictEqual(concat(cons(10n, nil), nil), cons(10n, nil));
    assert.deepStrictEqual(concat(cons(10n, nil), cons(20n, nil)), cons(10n, cons(20n, nil)));
    assert.deepStrictEqual(concat(cons(10n, nil), cons(20n, cons(30n, nil))),
        cons(10n, cons(20n, cons(30n, nil))));
    // 0-1-many: 2+ recursive call
    assert.deepStrictEqual(concat(cons(10n, cons(20n, nil)), nil), cons(10n, cons(20n, nil)));
    assert.deepStrictEqual(concat(cons(10n, cons(20n, nil)), cons(30n, nil)),
        cons(10n, cons(20n, cons(30n, nil))));
    assert.deepStrictEqual(concat(cons(10n, cons(20n, nil)), cons(30n, cons(40n, nil))),
        cons(10n, cons(20n, cons(30n, cons(40n, nil)))));
  });

  it('rev', function() {
    // 0-1-many: base case (only 1 possible)
    assert.deepStrictEqual(rev(nil), nil);
    // 0-1-many: 1 recursive call
    assert.deepStrictEqual(rev(cons(10n, nil)), cons(10n, nil));
    assert.deepStrictEqual(rev(cons(20n, nil)), cons(20n, nil));
    // 0-1-many: 2+ recursive calls
    assert.deepStrictEqual(rev(cons(10n, cons(20n, nil))), cons(20n, cons(10n, nil)));
    assert.deepStrictEqual(rev(cons(10n, cons(20n, cons(30n, nil)))),
        cons(30n, cons(20n, cons(10n, nil))));
  });

  it('remove', function() {
    // 0-1-many: base case
    assert.deepStrictEqual(remove(10n, nil), nil);
    assert.deepStrictEqual(remove(20n, nil), nil);
    // 0-1-many: 1 recursive call
    assert.deepStrictEqual(remove(10n, cons(10n, nil)), nil);
    assert.deepStrictEqual(remove(10n, cons(20n, nil)), cons(20n, nil));
    // 0-1-many: 2+ recursive calls
    assert.deepStrictEqual(remove(20n, cons(10n, cons(20n, nil))), cons(10n, nil));
    assert.deepStrictEqual(remove(10n, cons(10n, cons(20n, cons(30n, nil)))),
        cons(20n, cons(30n, nil)));
  });

  it('prefix', function() {
    const l5 = cons(10n, cons(20n, cons(30n, cons(40n, cons(50n, nil)))));

    // 0-1-many: base case
    assert.deepStrictEqual(prefix(0n, nil), nil);
    assert.deepStrictEqual(prefix(0n, cons(30n, nil)), nil);
    // 0-1-many: one recursive call
    assert.deepStrictEqual(prefix(1n, cons(30n, nil)), cons(30n, nil));
    assert.deepStrictEqual(prefix(1n, l5), cons(10n, nil));
    // 0-1-many: many recursive calls
    assert.deepStrictEqual(prefix(2n, l5), cons(10n, cons(20n, nil)));
    assert.deepStrictEqual(prefix(4n, l5), cons(10n, cons(20n, cons(30n, cons(40n, nil)))));
    assert.deepStrictEqual(prefix(5n, l5), l5);

    // Error case branch: not enough elements for prefix
    assert.throws(() => prefix(6n, l5), Error);
    assert.throws(() => prefix(1n, nil), Error);
  });

  it('suffix', function() {
    const l5 = cons(10n, cons(20n, cons(30n, cons(40n, cons(50n, nil)))));

    // 0-1-many: base case
    assert.deepStrictEqual(suffix(0n, nil), nil);
    assert.deepStrictEqual(suffix(0n, cons(30n, nil)), cons(30n, nil));
    // 0-1-many: one recursive call
    assert.deepStrictEqual(suffix(1n, cons(30n, nil)), nil);
    assert.deepStrictEqual(suffix(1n, l5), cons(20n, cons(30n, cons(40n, cons(50n, nil)))));
    // 0-1-many: many recursive calls
    assert.deepStrictEqual(suffix(2n, l5), cons(30n, cons(40n, cons(50n, nil))));
    assert.deepStrictEqual(suffix(3n, l5), cons(40n, cons(50n, nil)));
    assert.deepStrictEqual(suffix(5n, l5), nil);

    // Error case branch: not enough elements for suffix
    assert.throws(() => suffix(6n, l5), Error);
    assert.throws(() => suffix(1n, nil), Error);
  });

  it('compact_list', function() {
    // 0-1-many: base case (only 1 possible)
    assert.deepStrictEqual(compact_list(nil), []);
    // 0-1-many: 1 recursive call
    assert.deepStrictEqual(compact_list(cons(10n, nil)), [10n]);
    assert.deepStrictEqual(compact_list(cons(80n, nil)), [80n]);
    // 0-1-many: 2+ recursive calls
    assert.deepStrictEqual(compact_list(cons(10n, cons(20n, nil))), [10n, 20n]);
    assert.deepStrictEqual(compact_list(cons(30n, cons(20n, cons(10n, nil)))), [30n, 20n, 10n]);
  });

  it('explode_array', function() {
    // 0-1-many: base case (only 1 possible)
    assert.deepStrictEqual(explode_array([]), nil);
    // 0-1-many: 1 recursive call
    assert.deepStrictEqual(explode_array([10n]), cons(10n, nil));
    assert.deepStrictEqual(explode_array([80n]), cons(80n, nil));
    // 0-1-many: 2+ recursive calls
    assert.deepStrictEqual(explode_array([10n, 20n]), cons(10n, cons(20n, nil)));
    assert.deepStrictEqual(explode_array([10n, 20n, 30n]), cons(10n, cons(20n, cons(30n, nil))));
  });

});
