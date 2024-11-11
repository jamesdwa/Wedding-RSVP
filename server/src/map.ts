/** 
 * Interface for a mutable map.
 */
export interface MutableMap<V> {
    /**
     * Checks if the map contains a specified key.
     * @param key - The key to check for.
     * @returns True if the key is present, false otherwise.
     */
    contains: (key: string) => boolean;

    /**
     * Retrieves the value associated with a specified key.
     * @param key - The key to search for.
     * @returns The value associated with the key, or undefined if not found.
     * @throws Error if the key is not found.
     */
    get: (key: string) => V | undefined;

    /**
     * Sets or replaces a value associated with a key.
     * @param key - The key to set or replace.
     * @param value - The value to associate with the key.
     * @returns True if the key already existed and the value was replaced, false otherwise.
     */
    set: (key: string, value: V) => boolean;

    /**
     * Removes all key-value pairs from the map.
     */
    clear: () => void;

    /**
     * Retrieves an array containing all keys in the map.
     * @returns An array of keys.
     */
    keys: () => string[];

    /**
     * Retrieves an array containing all values in the map.
     * @returns An array of values.
     */
    values: () => V[];
}

/** 
 * Class implementing a mutable map using TypeScript's built-in Map.
 */
class TSMutableMap<V> implements MutableMap<V> {
    private map: Map<string, V>;

    /**
     * Constructs an empty MutableMap.
     */
    constructor() {
        this.map = new Map<string, V>();
    }
  
    /**
     * Checks if the map contains a specified key.
     * @param key - The key to check for.
     * @returns True if the key is present, false otherwise.
     */
    contains = (key: string): boolean => {
        return this.map.has(key);
    };
  
    /**
     * Retrieves the value associated with a specified key.
     * @param key - The key to search for.
     * @returns The value associated with the key, or undefined if not found.
     */
    get = (key: string): V | undefined => {
        return this.map.get(key);
    };
  
    /**
     * Sets or replaces a value associated with a key.
     * @param key - The key to set or replace.
     * @param value - The value to associate with the key.
     * @returns True if the key already existed and the value was replaced, false otherwise.
     */
    set = (key: string, value: V): boolean => {
        const hasKey = this.map.has(key);
        this.map.set(key, value);
        return hasKey;
    };
  
    /**
     * Removes all key-value pairs from the map.
     */
    clear = (): void => {
        this.map.clear();
    };
  
    /**
     * Retrieves an array containing all keys in the map.
     * @returns An array of keys.
     */
    keys = (): string[] => {
        return Array.from(this.map.keys());
    };

    /**
     * Retrieves an array containing all values in the map.
     * @returns An array of values.
     */
    values = (): V[] => {
        return Array.from(this.map.values());
    };
}

/**
 * Factory function to create a new instance of MutableMap.
 * @returns A new instance of MutableMap.
 */
export const createTSMutableMap = <V>(): TSMutableMap<V> => {
    return new TSMutableMap<V>();
}
