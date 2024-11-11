import * as assert from 'assert';
import { Guest, toJson, fromJson, replace, getGuestSumJames, getGuestSumMolly } from './guest';

describe('guest', function() {
  it('toJson', function() {
    const guest1: Guest = {
      kind: "individual",
      name: "John Doe",
      guestOf: "Molly",
      isFamily: true,
      dietaryRestric: "Vegetarian",
      hasGuest: true,
      additGuestName: "Jane Doe",
      additGuestDiet: "Gluten-free"
    };

    assert.deepStrictEqual(toJson(guest1), {
      kind: "individual",
      name: "John Doe",
      guestOf: "Molly",
      isFamily: true,
      dietaryRestric: "Vegetarian",
      hasGuest: true,
      additGuestName: "Jane Doe",
      additGuestDiet: "Gluten-free"
    });

    const guest2: Guest = {
      kind: "individual",
      name: "Bill Gates",
      guestOf: "James",
      isFamily: false
    };

    assert.deepStrictEqual(toJson(guest2), {
      kind: "individual",
      name: "Bill Gates",
      guestOf: "James",
      isFamily: false,
      dietaryRestric: undefined,
      hasGuest: undefined,
      additGuestName: undefined,
      additGuestDiet: undefined
    });
  });

  it('fromJson', function() {
    const json1 = {
      kind: "individual",
      name: "John Doe",
      guestOf: "Molly",
      isFamily: true,
      dietaryRestric: "Vegan",
      hasGuest: true,
      additGuestName: "Jane Doe",
      additGuestDiet: "Nut allergy"
    };

    assert.deepStrictEqual(fromJson(json1), {
      kind: "individual",
      name: "John Doe",
      guestOf: "Molly",
      isFamily: true,
      dietaryRestric: "Vegan",
      hasGuest: true,
      additGuestName: "Jane Doe",
      additGuestDiet: "Nut allergy"
    });

    const json2 = {
      kind: "individual",
      name: "John Smith", 
      guestOf: "James",
      isFamily: false
    };

    assert.deepStrictEqual(fromJson(json2), {
      kind: "individual",
      name: "John Smith",
      guestOf: "James", 
      isFamily: false,
      dietaryRestric: undefined,
      hasGuest: undefined,
      additGuestName: undefined,
      additGuestDiet: undefined
    });
  });

  it('replace', function() {

    const updatedGuest1 = replace(
      "individual",
      "John Doe",
      "James",
      false,
      "Vegetarian",
      true,
      "Jane Doe",
      "Gluten-free"
    );

    assert.deepStrictEqual(updatedGuest1, {
      kind: "individual",
      name: "John Doe",
      guestOf: "James",
      isFamily: false,
      dietaryRestric: "Vegetarian",
      hasGuest: true,
      additGuestName: "Jane Doe",
      additGuestDiet: "Gluten-free"
    });


    const updatedGuest2 = replace(
      "individual",
      "John Smith",
      "James",
      true,
      "",
      false,
      "",
      ""
    );

    assert.deepStrictEqual(updatedGuest2, {
      kind: "individual",
      name: "John Smith",
      guestOf: "James",
      isFamily: true,
      dietaryRestric: "",
      hasGuest: false,
      additGuestName: "",
      additGuestDiet: ""
    });

    const updatedGuest3 = replace(
      "individual",
      "Jane Doe",
      "Molly",
      false,
      "Vegetarian",
      false,
      "",
      ""
    );

    assert.deepStrictEqual(updatedGuest3, {
      kind: "individual",
      name: "Jane Doe",
      guestOf: "Molly",
      isFamily: false,
      dietaryRestric: "Vegetarian",
      hasGuest: false,
      additGuestName: "",
      additGuestDiet: ""
    });
  });

  it('getGuestSumJames', function() {
    const guests1: Guest[] = [
      {
        kind: "individual",
        name: "John Doe",
        guestOf: "Molly",
        isFamily: true
      },
      {
        kind: "individual",
        name: "John Smith",
        guestOf: "James",
        isFamily: false,
        hasGuest: true
      },
      {
        kind: "individual",
        name: "Jane Doe",
        guestOf: "James",
        isFamily: true,
        hasGuest: undefined
      }
    ];

    const summary1 = getGuestSumJames(guests1);
    assert.strictEqual(summary1, "3-4 guest(s) of James (1 family)");
    
    const guests2: Guest[] = [
      {
        kind: "individual",
        name: "John Doe",
        guestOf: "James",
        isFamily: true,
        hasGuest: true
      },
      {
        kind: "individual",
        name: "Jane Doe",
        guestOf: "James",
        isFamily: false,
        hasGuest: true
      }
    ];
    
    const summary2 = getGuestSumJames(guests2);
    assert.strictEqual(summary2, "4 guest(s) of James (1 family)");
  });
  
  it('getGuestSumMolly', function() {
    const guests1: Guest[] = [
      {
        kind: "individual",
        name: "John Doe",
        guestOf: "Molly",
        isFamily: true,
        hasGuest: true,
      },
      {
        kind: "individual",
        name: "Jane Doe",
        guestOf: "Molly", 
        isFamily: false,
        hasGuest: true
      }
    ];
    
    const summary1 = getGuestSumMolly(guests1);
    assert.strictEqual(summary1, "4 guest(s) of Molly (1 family)");
    
    const guests2: Guest[] = [
      {
        kind: "individual",
        name: "John Smith",
        guestOf: "Molly",
        isFamily: true,
        hasGuest: undefined
      },
      {
        kind: "individual",
        name: "Jane Doe",
        guestOf: "Molly",
        isFamily: true,
        hasGuest: undefined
      }  
    ];
    
    const summary2 = getGuestSumMolly(guests2);
    assert.strictEqual(summary2, "2-4 guest(s) of Molly (2 family)");
  });
});