export interface iTrieWordWithInsertions {
    word: string;
    charInsertions: string[];
}

export interface iTrie {

    addWord(word: string): void;

    containsWord(word: string): boolean;

    removeWord(word: string): void;

    getNumWords(): number;

    getAllWords(): string[];

    getAllWordsWithPrefix(prefix: string): string[];

    getRandomWords(numWords: number, minLength?: number, maxLength?: number): string[];

    getLongestWordLength(): number;

    getShortestWordLength(): number;

    /**
     * Given an iterable of characters,
     * find all words which contain those characters in any order
     * 
     * Blank chars in input will be treated as wildcards, and word output
     * will include which chars were inserted, if any
     */
    findWordsWithCharacters(characters: string[], mustIncludeAll: boolean): iTrieWordWithInsertions[];

    /**
     * Get all words which start with a prefix and end with a suffix
     */
    getAllWordsWithPrefixSuffix(prefix: string, suffix: string): string[];
}