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

}