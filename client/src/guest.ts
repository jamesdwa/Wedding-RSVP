export type GuestType = "Molly" | "James";

/**
 * Transforms a string into a GuestType or throws an error if the string is invalid.
 * @param s The string to be converted to a GuestType.
 * @returns The corresponding GuestType.
 * @throws An error if the string is not a valid GuestType.
 */
export const toGuest = (s: string): GuestType => {
  switch (s) {
    case "Molly":
    case "James":
      return s;
    default:
      throw new Error(`unknown guest type "${s}"`);
  }
};

export type Guest = {
  readonly kind: "individual",
  readonly name: string,
  readonly guestOf: GuestType,
  readonly isFamily: boolean,
  readonly dietaryRestric?: string,
  readonly hasGuest?: boolean | undefined;
  readonly additGuestName?: string;
  readonly additGuestDiet?: string;
};

/**
 * Converts a Guest object into its JSON representation.
 * @param guest The guest to be converted to JSON.
 * @returns A JSON object representing the guest.
 * @throws An error if the guest kind is not recognized.
 */
export const toJson = (guest: Guest): unknown => {
  if (guest.kind === "individual") {
    return {
      kind: guest.kind,
      name: guest.name,
      guestOf: guest.guestOf,
      isFamily: guest.isFamily,
      dietaryRestric: guest.dietaryRestric,
      hasGuest: guest.hasGuest,
      additGuestName: guest.additGuestName,
      additGuestDiet: guest.additGuestDiet,
    };
  } else {
    throw new Error(`unexpected guest kind "${guest.kind}"`);
  }
};

/**
 * Parses a JSON object to create a Guest.
 * @param json A JSON object representing a guest.
 * @returns A Guest object created from the JSON data.
 * @throws An error if the JSON is not a valid representation of a Guest.
 */
export const fromJson = (json: unknown): Guest => {
  if (!isRecord(json)) {
    throw new Error('guest json is not an object');
  }
  
  const kind = json.kind;
  if (kind !== "individual") {
    throw new Error(`unexpected kind "${kind}"`);  
  }

  const name = json.name;
  if (typeof name !== 'string') {
    throw new Error('name is not a string');
  }

  const guestOf = json.guestOf;
  if (typeof guestOf !== 'string') {
    throw new Error('guestOf is not a string');
  }
  
  const parsedGuestOf = toGuest(guestOf);
  if (parsedGuestOf !== "Molly" && parsedGuestOf !== "James") {
    throw new Error('guestOf is not a valid GuestType');
  }

  const isFamily = json.isFamily;
  if (typeof isFamily !== 'boolean') {
    throw new Error('isFamily is not a boolean');
  }

  const dietaryRestric = json.dietaryRestric;
  if (dietaryRestric !== undefined && typeof dietaryRestric !== 'string') {
    throw new Error('invalid dietaryRestric');
  }

  const hasGuest = json.hasGuest;
  if (hasGuest !== undefined && typeof hasGuest !== 'boolean') {
    throw new Error('invalid hasGuest');
  }

  const additGuestName = json.additGuestName;
  if (additGuestName !== undefined && typeof additGuestName !== 'string') {
    throw new Error('invalid additGuestName');
  }

  const additGuestDiet = json.additGuestDiet;
  if (additGuestDiet !== undefined && typeof additGuestDiet !== 'string') {
    throw new Error('invalid additGuestDiet');
  }

  return {
    kind: "individual",
    name,
    guestOf: parsedGuestOf,
    isFamily,
    dietaryRestric,
    hasGuest,
    additGuestName,
    additGuestDiet,
  };
};

const isRecord = (obj: unknown): obj is Record<string, unknown> => {
    return typeof obj === 'object' && obj !== null;
};

/**
 * Updates the properties of a guest with the specified values.
 * @param guest The guest to be updated.
 * @param kind The type of the guest.
 * @param name The name of the guest.
 * @param guestOf The person who invited the guest.
 * @param isFamily Indicates if the guest is a family member.
 * @param dietaryRestric The dietary restrictions of the guest.
 * @param hasGuest Indicates if the guest is bringing a plus-one.
 * @param additGuestName The name of the additional guest.
 * @param additGuestDiet The dietary restrictions of the additional guest.
 * @returns The updated guest object.
 */
export const replace = (kind: 'individual', name: string, guestOf: GuestType, isFamily: boolean, dietaryRestric: string, hasGuest: boolean | undefined, additGuestName: string, additGuestDiet: string): Guest => {
  const newGuest = { kind, name, guestOf, isFamily, dietaryRestric, hasGuest, additGuestName, additGuestDiet };
  return newGuest;
}

/**
 * Provides a summary of guests invited by James.
 * @param guests The list of guests.
 * @returns A summary of guests invited by James.
 */
export const getGuestSumJames = (guests: Guest[]): string => {
  const jamesSummary = getGuestSum(guests, "James");
  return jamesSummary;
}

/**
 * Provides a summary of guests invited by Molly.
 * @param guests The list of guests.
 * @returns A summary of guests invited by Molly.
 */
export const getGuestSumMolly = (guests: Guest[]): string => {
  const mollySummary = getGuestSum(guests, "Molly");
  return mollySummary;
};

/**
 * Generates a summary of guests invited by a specified person.
 * @param guests The list of guests.
 * @param guestOf The person who invited the guests.
 * @returns A summary of guests invited by the specified person.
 */
const getGuestSum = (guests: Guest[], guestOf: GuestType): string => {
  const guestOfGuests = guests.filter((guest) => guest.guestOf === guestOf);
  const familyCount = guestOfGuests.filter((guest) => guest.isFamily).length;

  const confirmGuestCount = numConfirmGuests(guestOfGuests);
  const potentialGuestCount = numPotentialGuests(guestOfGuests);

  const guestCount = rangeString(confirmGuestCount, potentialGuestCount);

  return `${guestCount} guest(s) of ${guestOf} (${familyCount} family)`;
};

/**
 * Counts the number of confirmed guests.
 * @param guests The list of guests.
 * @returns The number of confirmed guests.
 */
const numConfirmGuests = (guests: Guest[]): number => {
  return guests.reduce(countConfirmGuests, 0);
};

/**
 * Reducer function to count confirmed guests.
 * @param count The current count of confirmed guests.
 * @param guest The guest to be checked.
 * @returns The updated count of confirmed guests.
 */
const countConfirmGuests = (count: number, guest: Guest): number => {
  if (guest.hasGuest === undefined || guest.hasGuest === false) {
    return count + 1;
  } else {
    return count + 2;
  }
}

/**
 * Counts the number of potential guests.
 * @param guests The list of guests.
 * @returns The number of potential guests.
 */
const numPotentialGuests = (guests: Guest[]): number => {
  return guests.reduce(countPotentialGuests, 0);
};

/**
 * Reducer function to count potential guests.
 * @param count The current count of potential guests.
 * @param guest The guest to be checked.
 * @returns The updated count of potential guests.
 */
const countPotentialGuests = (count: number, guest: Guest): number => {
  if (guest.hasGuest === undefined) {
    return count + 1;
  } else {
    return count;
  }
}

/**
 * Generates a string representation of the range of guest counts.
 * @param confirmedCount The number of confirmed guests.
 * @param potentialCount The number of potential guests.
 * @returns A string representing the range of guest counts.
 */
const rangeString = (confirmedCount: number, potentialCount: number): string => {
  if (potentialCount === 0) {
    return String(confirmedCount);
  } else {
    const sum = confirmedCount + potentialCount;
    return `${confirmedCount}-${sum}`;
  }
};
