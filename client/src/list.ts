export type List<A> =
    | {readonly kind: "nil"}
    | {readonly kind: "cons", readonly hd: A, readonly tl: List<A>};


/**
 * Represents an empty list.
 */
export const nil: {kind: "nil"} = {kind: "nil"};

/**
 * Creates a list with 'hd' as the first element and 'tl' as the rest of the list.
 */
export const cons = <A,>(hd: A, tl: List<A>): List<A> => {
  return {kind: "cons", hd: hd, tl: tl};
};


/**
 * Calculates the length of the list 'L'.
 * @param L The list whose length is to be calculated
 * @returns 0 if L is empty, otherwise 1 + the length of the rest of the list
 */
export const len = <A,>(L: List<A>): bigint => {
  if (L.kind === "nil") {
    return 0n;
  } else {
    return 1n + len(L.tl);
  }
};

/**
 * Checks if two lists 'L' and 'R' are equal by comparing their corresponding values using ===.
 * @param L The first list to be compared
 * @param R The second list to be compared
 * @returns true if the lists have the same length and the elements at the same indexes are equal.
 */
export const equal = <A>(L: List<A>, R: List<A>): boolean => {
  if (L.kind === "nil") {
    return R.kind === "nil";
  } else if (R.kind === "nil") {
    return false;
  } else if (L.hd !== R.hd) {
    return false;
  } else {
    return equal(L.tl, R.tl);
  }
};

/**
 * Concatenates two lists 'L' and 'R'.
 * @param L The first list
 * @param R The second list
 * @returns A new list with elements of 'L' followed by elements of 'R'
 */
export const concat = <A,>(L: List<A>, R: List<A>): List<A> => {
  if (L.kind === "nil") {
    return R;
  } else {
    return cons(L.hd, concat(L.tl, R));
  }
};

/**
 * Retrieves the element at position 'n' in the list 'L'.
 * @param n The index of the element to retrieve
 * @returns The element at index 'n' if it exists, otherwise throws an error
 */
export const at = <A,>(x: bigint, L: List<A>): A => {
  if (L.kind === "nil") {
    throw new Error('no element at that index');
  } else if (x === 0n) {
    return L.hd;
  } else {
    return at(x - 1n, L.tl);
  }
};

/**
 * Reverses the order of elements in the list 'L'.
 * @param L The list to be reversed
 * @returns A new list with the elements of 'L' in reverse order
 */
export const rev = <A>(L: List<A>): List<A> => {
  if (L.kind === "nil") {
    return nil;
  } else {
    return concat(rev(L.tl), cons(L.hd, nil));
  }
};

/**
 * Returns the first 'n' elements of the list 'L'.
 * @param n The number of elements to return
 * @param L The list to get elements from
 * @requires n must be less than or equal to the length of 'L'
 * @returns A new list with the first 'n' elements of 'L'
 */
export const prefix = <A,>(n: bigint, L: List<A>): List<A> => {
  if (n === 0n) {
      return nil;
  } else if (L.kind === "nil") {
      throw new Error("not enough elements in L");
  } else {
      return cons(L.hd, prefix(n - 1n, L.tl))
  }
};

/**
 * Returns the elements of the list 'L' after the first 'n' elements.
 * @param n The number of elements to skip
 * @param L The list to get elements from
 * @requires n must be less than or equal to the length of 'L'
 * @returns A new list with the elements of 'L' after the first 'n' elements
 */

export const suffix = <A,>(n: bigint, L: List<A>): List<A> => {
  if (n === 0n) {
      return L;
  } else if (L.kind === "nil") {
      throw new Error("not enough elements in L");
  } else {
      return suffix(n - 1n, L.tl);
  }
};

/**
 * Converts the list 'L' into an array.
 * @param L The list to be converted
 * @returns An array with the same elements as 'L' in the same order
 */
export const compact_list = <A,>(L: List<A>): Array<A> => {
  if (L.kind === "nil") {
    return [];
  } else {
    return [L.hd].concat(compact_list(L.tl));  // NOTE: O(n^2)
  }
};

/**
 * Converts the array 'arr' into a list.
 * @param arr The array to be converted
 * @returns A list with the same elements as 'arr' in the same order
 */
export const explode_array = <A,>(arr: ReadonlyArray<A>): List<A> => {
  if (arr.length === 0) {
    return nil;
  } else {
    return cons(arr[0], explode_array(arr.slice(1)));  // NOTE: O(n^2)
  }
};

/**
 * Removes all occurrences of the value 'x' from the list 'L'.
 * @param x The value to be removed
 * @param L The list to remove from
 * @returns A new list with all occurrences of 'x' removed
 */
export const remove = <A>(x: A, L: List<A>): List<A> => {
  if (L.kind === "nil") {
    return nil;
  } else if (L.hd === x) {
    return remove(x, L.tl);
  } else {
    return cons(L.hd, remove(x, L.tl));
  }
};