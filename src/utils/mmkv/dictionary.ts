import { storage } from "./mmkv";

/**
 * A persistent dictionary that automatically manages key-value pairs of objects in MMKV storage.
 * The dictionary is automatically initialized as empty if it doesn't exist in storage.
 * @template T - The type of values stored in the dictionary
 * @class
 * @example
 * interface UserProfile {
 *   name: string;
 *   email: string;
 *   age: number;
 * }
 * 
 * const userProfiles = new PersistentDictionary<UserProfile>('user-profiles');
 * userProfiles.set('user123', { name: 'John', email: 'john@example.com', age: 30 });
 */
class PersistentDictionary<T> {
    private key: string;

    /**
     * Creates a new PersistentDictionary instance.
     * Automatically initializes an empty dictionary in storage if it doesn't exist.
     * @param {string} key - The storage key for this dictionary
     * @example
     * const settingsDict = new PersistentDictionary<AppSettings>('app-settings');
     */
    constructor(key: string) {
        this.key = key;
        // Initialize empty dictionary if it doesn't exist
        if (!this.exists()) {
            this.store({});
        }
    }

    /**
     * Stores the entire dictionary, replacing any existing data.
     * @param {Record<string, T>} dict - Dictionary object to store
     * @returns {void}
     * @example
     * userProfiles.store({
     *   'user1': { name: 'John', email: 'john@example.com', age: 30 },
     *   'user2': { name: 'Jane', email: 'jane@example.com', age: 25 }
     * });
     */
    store(dict: Record<string, T>): void {
        storage.set(this.key, JSON.stringify(dict));
    }

    /**
     * Retrieves the entire dictionary from storage.
     * @param {Record<string, T>} [defaultValue={}] - Default value to return if retrieval fails
     * @returns {Record<string, T>} Dictionary object from storage
     * @example
     * const profiles = userProfiles.retrieve();
     * const profilesWithDefault = userProfiles.retrieve({ 'default': { name: 'Anonymous', email: '', age: 0 } });
     */
    retrieve(defaultValue: Record<string, T> = {}): Record<string, T> {
        try {
            const stored = storage.getString(this.key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (error) {
            console.error('Error retrieving dictionary:', error);
            return defaultValue;
        }
    }

    /**
     * Sets a value for the specified key.
     * @param {string} key - The key to set
     * @param {T} value - The value to store
     * @returns {void}
     * @example
     * userProfiles.set('user123', { name: 'Alice', email: 'alice@example.com', age: 28 });
     */
    set(key: string, value: T): void {
        const dict = this.retrieve();
        dict[key] = value;
        this.store(dict);
    }

    /**
     * Sets multiple key-value pairs at once.
     * @param {Record<string, T>} entries - Object containing key-value pairs to set
     * @returns {void}
     * @example
     * userProfiles.setMany({
     *   'user456': { name: 'Bob', email: 'bob@example.com', age: 35 },
     *   'user789': { name: 'Carol', email: 'carol@example.com', age: 32 }
     * });
     */
    setMany(entries: Record<string, T>): void {
        const dict = this.retrieve();
        Object.assign(dict, entries);
        this.store(dict);
    }

    /**
     * Gets the value for the specified key.
     * @param {string} key - The key to retrieve
     * @param {T} [defaultValue] - Default value to return if key doesn't exist
     * @returns {T | undefined} The value associated with the key, or defaultValue/undefined if not found
     * @example
     * const profile = userProfiles.get('user123');
     * const profileWithDefault = userProfiles.get('user999', { name: 'Unknown', email: '', age: 0 });
     */
    get(key: string, defaultValue?: T): T | undefined {
        const dict = this.retrieve();
        return dict[key] ?? defaultValue;
    }

    /**
     * Gets multiple values by their keys.
     * @param {string[]} keys - Array of keys to retrieve
     * @param {T} [defaultValue] - Default value for missing keys
     * @returns {Record<string, T | undefined>} Object with requested keys and their values
     * @example
     * const profiles = userProfiles.getMany(['user123', 'user456', 'nonexistent']);
     */
    getMany(keys: string[], defaultValue?: T): Record<string, T | undefined> {
        const dict = this.retrieve();
        const result: Record<string, T | undefined> = {};
        
        for (const key of keys) {
            result[key] = dict[key] ?? defaultValue;
        }
        
        return result;
    }

    /**
     * Checks if a key exists in the dictionary.
     * @param {string} key - The key to check
     * @returns {boolean} True if the key exists, false otherwise
     * @example
     * if (userProfiles.has('user123')) {
     *   console.log('User profile exists');
     * }
     */
    has(key: string): boolean {
        const dict = this.retrieve();
        return key in dict;
    }

    /**
     * Checks if multiple keys exist in the dictionary.
     * @param {string[]} keys - Array of keys to check
     * @returns {Record<string, boolean>} Object mapping each key to whether it exists
     * @example
     * const existence = userProfiles.hasMany(['user123', 'user456', 'user999']);
     * // { 'user123': true, 'user456': true, 'user999': false }
     */
    hasMany(keys: string[]): Record<string, boolean> {
        const dict = this.retrieve();
        const result: Record<string, boolean> = {};
        
        for (const key of keys) {
            result[key] = key in dict;
        }
        
        return result;
    }

    /**
     * Removes a key-value pair from the dictionary.
     * @param {string} key - The key to remove
     * @returns {boolean} True if the key was removed, false if it didn't exist
     * @example
     * const removed = userProfiles.remove('user123');
     */
    remove(key: string): boolean {
        const dict = this.retrieve();
        if (key in dict) {
            delete dict[key];
            this.store(dict);
            return true;
        }
        return false;
    }

    /**
     * Removes multiple keys from the dictionary.
     * @param {string[]} keys - Array of keys to remove
     * @returns {number} Number of keys that were actually removed
     * @example
     * const removedCount = userProfiles.removeMany(['user123', 'user456', 'nonexistent']);
     */
    removeMany(keys: string[]): number {
        const dict = this.retrieve();
        let removedCount = 0;
        
        for (const key of keys) {
            if (key in dict) {
                delete dict[key];
                removedCount++;
            }
        }
        
        if (removedCount > 0) {
            this.store(dict);
        }
        
        return removedCount;
    }

    /**
     * Updates a value if the key exists, otherwise sets it.
     * @param {string} key - The key to update
     * @param {(currentValue: T | undefined) => T} updater - Function that receives current value and returns new value
     * @returns {T} The new value that was set
     * @example
     * const newProfile = userProfiles.update('user123', (current) => 
     *   current ? { ...current, age: current.age + 1 } : { name: 'New User', email: '', age: 0 }
     * );
     */
    update(key: string, updater: (currentValue: T | undefined) => T): T {
        const dict = this.retrieve();
        const currentValue = dict[key];
        const newValue = updater(currentValue);
        dict[key] = newValue;
        this.store(dict);
        return newValue;
    }

    /**
     * Updates a value only if the key exists.
     * @param {string} key - The key to update
     * @param {(currentValue: T) => T} updater - Function that receives current value and returns new value
     * @returns {boolean} True if the key existed and was updated, false otherwise
     * @example
     * const updated = userProfiles.updateIfExists('user123', (profile) => ({
     *   ...profile,
     *   email: profile.email.toLowerCase()
     * }));
     */
    updateIfExists(key: string, updater: (currentValue: T) => T): boolean {
        const dict = this.retrieve();
        if (key in dict) {
            dict[key] = updater(dict[key]);
            this.store(dict);
            return true;
        }
        return false;
    }

    /**
     * Gets all keys in the dictionary.
     * @returns {string[]} Array of all keys
     * @example
     * const allKeys = userProfiles.keys();
     * console.log(`Users: ${allKeys.join(', ')}`);
     */
    keys(): string[] {
        const dict = this.retrieve();
        return Object.keys(dict);
    }

    /**
     * Gets all values in the dictionary.
     * @returns {T[]} Array of all values
     * @example
     * const allProfiles = userProfiles.values();
     */
    values(): T[] {
        const dict = this.retrieve();
        return Object.values(dict);
    }

    /**
     * Gets all key-value pairs as an array of tuples.
     * @returns {[string, T][]} Array of [key, value] tuples
     * @example
     * const entries = userProfiles.entries();
     * for (const [userId, profile] of entries) {
     *   console.log(`${userId}: ${profile.name}`);
     * }
     */
    entries(): [string, T][] {
        const dict = this.retrieve();
        return Object.entries(dict);
    }

    /**
     * Finds the first key-value pair that matches the given predicate.
     * @param {(value: T, key: string) => boolean} predicate - Function to test each key-value pair
     * @returns {[string, T] | undefined} The first matching [key, value] tuple, or undefined if not found
     * @example
     * const adminEntry = userProfiles.find((profile, key) => profile.role === 'admin');
     */
    find(predicate: (value: T, key: string) => boolean): [string, T] | undefined {
        const dict = this.retrieve();
        for (const [key, value] of Object.entries(dict)) {
            if (predicate(value, key)) {
                return [key, value];
            }
        }
        return undefined;
    }

    /**
     * Finds all key-value pairs that match the given predicate.
     * @param {(value: T, key: string) => boolean} predicate - Function to test each key-value pair
     * @returns {Record<string, T>} Dictionary containing only matching key-value pairs
     * @example
     * const adults = userProfiles.findAll((profile, key) => profile.age >= 18);
     */
    findAll(predicate: (value: T, key: string) => boolean): Record<string, T> {
        const dict = this.retrieve();
        const result: Record<string, T> = {};
        
        for (const [key, value] of Object.entries(dict)) {
            if (predicate(value, key)) {
                result[key] = value;
            }
        }
        
        return result;
    }

    /**
     * Finds the key of the first value that matches the given predicate.
     * @param {(value: T, key: string) => boolean} predicate - Function to test each key-value pair
     * @returns {string | undefined} The key of the first matching value, or undefined if not found
     * @example
     * const adminKey = userProfiles.findKey((profile, key) => profile.email === 'admin@example.com');
     */
    findKey(predicate: (value: T, key: string) => boolean): string | undefined {
        const dict = this.retrieve();
        for (const [key, value] of Object.entries(dict)) {
            if (predicate(value, key)) {
                return key;
            }
        }
        return undefined;
    }

    /**
     * Executes a function for each key-value pair in the dictionary.
     * @param {(value: T, key: string) => void} callback - Function to execute for each pair
     * @returns {void}
     * @example
     * userProfiles.forEach((profile, userId) => {
     *   console.log(`User ${userId}: ${profile.name} (${profile.email})`);
     * });
     */
    forEach(callback: (value: T, key: string) => void): void {
        const dict = this.retrieve();
        for (const [key, value] of Object.entries(dict)) {
            callback(value, key);
        }
    }

    /**
     * Creates a new dictionary with the results of calling a function for every key-value pair.
     * @template U - The type of the mapped values
     * @param {(value: T, key: string) => U} mapper - Function that produces new values
     * @returns {Record<string, U>} New dictionary with mapped values
     * @example
     * const userNames = userProfiles.map((profile, key) => profile.name);
     * // Returns { 'user123': 'John', 'user456': 'Jane' }
     */
    map<U>(mapper: (value: T, key: string) => U): Record<string, U> {
        const dict = this.retrieve();
        const result: Record<string, U> = {};
        
        for (const [key, value] of Object.entries(dict)) {
            result[key] = mapper(value, key);
        }
        
        return result;
    }

    /**
     * Gets the number of key-value pairs in the dictionary.
     * @returns {number} The size of the dictionary
     * @example
     * const userCount = userProfiles.size();
     */
    size(): number {
        const dict = this.retrieve();
        return Object.keys(dict).length;
    }

    /**
     * Checks if the dictionary is empty.
     * @returns {boolean} True if the dictionary has no key-value pairs, false otherwise
     * @example
     * if (userProfiles.isEmpty()) {
     *   console.log('No user profiles found');
     * }
     */
    isEmpty(): boolean {
        return this.size() === 0;
    }

    /**
     * Removes all key-value pairs from the dictionary.
     * @returns {void}
     * @example
     * userProfiles.clear();
     */
    clear(): void {
        this.store({});
    }

    /**
     * Gets the entire dictionary. Alias for retrieve().
     * @returns {Record<string, T>} The complete dictionary
     * @example
     * const allProfiles = userProfiles.getAll();
     */
    getAll(): Record<string, T> {
        return this.retrieve();
    }

    /**
     * Merges another dictionary into this one, overwriting existing keys.
     * @param {Record<string, T>} other - Dictionary to merge
     * @returns {void}
     * @example
     * userProfiles.merge({
     *   'user999': { name: 'New User', email: 'new@example.com', age: 25 },
     *   'user123': { name: 'John Updated', email: 'john.new@example.com', age: 31 }
     * });
     */
    merge(other: Record<string, T>): void {
        const dict = this.retrieve();
        Object.assign(dict, other);
        this.store(dict);
    }

    /**
     * Creates a shallow copy of the dictionary.
     * @returns {Record<string, T>} A copy of the dictionary
     * @example
     * const backup = userProfiles.clone();
     */
    clone(): Record<string, T> {
        return { ...this.retrieve() };
    }

    /**
     * Checks if this dictionary exists in storage.
     * @returns {boolean} True if the dictionary exists in storage, false otherwise
     * @example
     * if (userProfiles.exists()) {
     *   console.log('User profiles dictionary is initialized');
     * }
     */
    exists(): boolean {
        return storage.contains(this.key);
    }

    /**
     * Deletes this dictionary from storage completely.
     * @returns {void}
     * @example
     * userProfiles.delete(); // Permanently removes the dictionary
     */
    delete(): void {
        storage.delete(this.key);
    }

    /**
     * Gets the storage key used by this dictionary.
     * @returns {string} The storage key
     * @example
     * console.log(`Dictionary key: ${userProfiles.getKey()}`);
     */
    getKey(): string {
        return this.key;
    }
}

// Export the class
export { PersistentDictionary };

// Example usage:
/*
interface UserProfile {
    name: string;
    email: string;
    age: number;
    role: string;
}

// Create a PersistentDictionary instance for user profiles
const userProfiles = new PersistentDictionary<UserProfile>('user-profiles');

// Set individual profiles
userProfiles.set('user123', { name: 'John', email: 'john@example.com', age: 30, role: 'user' });
userProfiles.set('user456', { name: 'Jane', email: 'jane@example.com', age: 25, role: 'admin' });

// Set multiple profiles at once
userProfiles.setMany({
    'user789': { name: 'Bob', email: 'bob@example.com', age: 35, role: 'user' },
    'user101': { name: 'Alice', email: 'alice@example.com', age: 28, role: 'moderator' }
});

// Get profiles
const johnProfile = userProfiles.get('user123');
const multipleProfiles = userProfiles.getMany(['user123', 'user456']);

// Check existence
const hasJohn = userProfiles.has('user123');

// Update profile
userProfiles.update('user123', (profile) => 
    profile ? { ...profile, age: profile.age + 1 } : { name: 'New User', email: '', age: 0, role: 'user' }
);

// Find profiles
const adminProfile = userProfiles.find((profile, key) => profile.role === 'admin');
const allAdmins = userProfiles.findAll((profile, key) => profile.role === 'admin');

// Iterate over profiles
userProfiles.forEach((profile, userId) => {
    console.log(`${userId}: ${profile.name} (${profile.role})`);
});

// Get dictionary info
const profileCount = userProfiles.size();
const allKeys = userProfiles.keys();
const allProfiles = userProfiles.getAll();

// Remove profiles
userProfiles.remove('user789');
userProfiles.removeMany(['user101', 'nonexistent']);

// Clear all profiles
userProfiles.clear();
*/