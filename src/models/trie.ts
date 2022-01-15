export interface iTrieWordWithInsertions {
    word: string;
    charInsertions: string[];
}

export interface iWordWithData<DataType> {
    word: string;
    data: DataType | void;
}

export interface iTrie<DataType> {

    addWord(word: string, wordData?: DataType | void): void;

    containsWord(word: string): boolean;

    /**
     * Get the data associated with a trie word node
     */
    getWordData(word: string): DataType | void;

    /**
     * Update the data associated with a word
     */
    updateWordData(word: string, wordData: DataType | void): void;

    removeWord(word: string): void;

    getNumWords(): number;

    getAllWords(): string[];

    getAllWordsWithPrefix(prefix: string): string[];

    /**
     * Get all words with prefix and their associated data
     */
    getAllWordsDataWithPrefix(prefix: string): iWordWithData<DataType>[];

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

    /**
     * Get all words with prefix + suffix and their associated data
     */
    getAllWordsDataWithPrefixSuffix(prefix: string, suffix: string): iWordWithData<DataType>[];

    /**
     * Get an iterable object for this trie
     */
    toIterable(): Iterable<iWordWithData<DataType>>;
}