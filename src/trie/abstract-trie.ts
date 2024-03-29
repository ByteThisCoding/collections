import { iTrie, iTrieWordWithInsertions, iWordWithData } from "../models/trie";
import { PriorityQueue } from "../priority-queue/priority-queue";
import { Queue } from "../queue/queue";
import { Stack } from "../stack/stack";
import { iTrieNode, TrieNode } from "./trie-node";

/**
 * A custom implementation of a trie data structure
 */
export abstract class AbstractTrie<DataType> implements iTrie<DataType> {

    //the root node will be a special empty node
    private rootNode = this.createNode("");

    private numWords = 0;

    //keep track of longest words in priority queue
    private longestWordLengths = new PriorityQueue<number>((a, b) => b - a);
    private shortestWordLengths = new PriorityQueue<number>((a, b) => a - b);
    //keep track of count of each word
    private wordLengthCounts = new Map<number, number>();

    /**
     * Create a new Trie node
     * Subclass can override for more specificity
     */
    protected abstract createNode(char: string): iTrieNode<DataType>;

    getLongestWordLength(): number {
        return this.longestWordLengths.peek() || 0;
    }

    getShortestWordLength(): number {
        return this.shortestWordLengths.peek() || 0;
    }

    /**
     * Recursively update nodes within the trie
     * Do nothing if the word already exists
     */
    addWord(word: string, wordData?: DataType | void): void {
        this.doAddWord(word, wordData);
    }

    /**
     * Add a word and return the node reference
     * @param word 
     * @returns 
     */
    protected doAddWord(word: string, wordData?: DataType | void): iTrieNode<DataType> | null {
        let node: iTrieNode<DataType> = this.rootNode;

        //iterate through the nodes until the word is complete
        for (let i = 0; i < word.length; i++) {
            const char = word[i];

            //add next node if it's not there already
            if (!node.hasNextCharNode(char)) {
                node.addNextChar(char);
            }

            //navigate to that next node
            node = node.getNextCharNode(char);
        }

        //mark the final node as the end of a word if it isn't already
        if (!node.isEndOfWord()) {
            node.markAsEndOfWord();
            node.setNodeData(wordData);
            this.numWords++;

            //add to priority queue if length is not in map
            let currentCount = 0;
            if (this.wordLengthCounts.has(word.length)) {
                currentCount = this.wordLengthCounts.get(word.length)!;
            } else {
                this.longestWordLengths.enqueue(word.length);
                this.shortestWordLengths.enqueue(word.length);
            }

            this.wordLengthCounts.set(
                word.length,
                1 + currentCount
            );

            return node;
        }

        return null;
    }

    /**
     * Get the data associated with a trie word node
     * 
     * Recursively iterate to get the data
     */
    getWordData(word: string): DataType | void {
        const node = this.getWordNode(word);
        return node ? node.getNodeData() : void 0;
    }

    /**
     * Recursively check if a word exists implicitly in the trie
     */
    containsWord(word: string): boolean {
        return this.getWordNode(word) !== null;
    }

    /**
     * Update the data associated with a word
     */
    updateWordData(word: string, wordData: DataType | void): void {
        const node = this.getWordNode(word);
        if (node) {
            node.setNodeData(wordData);
        }
    }

    private getWordNode(word: string): iTrieNode<DataType> | null {
        let isSearching = true;
        let node = this.rootNode;

        //iterate through trie to find the end of word marking
        for (let i = 0; isSearching && i < word.length; i++) {
            const char = word[i];

            if (node.hasNextCharNode(char)) {
                node = node.getNextCharNode(char);
            } else {
                isSearching = false;
            }
        }

        if (isSearching && node.isEndOfWord()) {
            return node;
        }
        return null;
    }

    /**
     * Recursively remove a word while leaving other words in-tact
     */
    removeWord(word: string): void {
        this.doRemoveWord(word);
    }

    /**
     * Remove a word and return the deleted nodes
     */
    protected doRemoveWord(word: string): iTrieNode<DataType>[] {
        let isSearching = true;
        let node = this.rootNode;
        const deletedNodes: iTrieNode<DataType>[] = [];

        //use an array as a quick stack implementation option
        //linked list based stack may perform better
        const nodeStack: iTrieNode<DataType>[] = [];

        //iterate through trie to find the end of word marking
        for (let i = 0; isSearching && i < word.length; i++) {
            nodeStack.push(node);
            const char = word[i];

            if (node.hasNextCharNode(char)) {
                node = node.getNextCharNode(char);
            } else {
                isSearching = false;
            }
        }

        //if we've found the word, proceed on deletion
        if (isSearching && node.isEndOfWord()) {
            //mark this as not the end of the word
            node.unmarkAsEndOfWord();
            this.numWords--;

            let wordLenCount = this.wordLengthCounts.get(word.length)!;
            if (wordLenCount === 1) {
                this.wordLengthCounts.delete(word.length);
                if (word.length === this.longestWordLengths.peek()) {
                    do {
                        this.longestWordLengths.dequeue();
                    } while (
                        this.longestWordLengths.count > 0
                        && !this.wordLengthCounts.has(this.longestWordLengths.peek()!)
                    );
                } else if (word.length === this.shortestWordLengths.peek()) {
                    do {
                        this.shortestWordLengths.dequeue();
                    } while (
                        this.shortestWordLengths.count > 0
                        && !this.wordLengthCounts.has(this.shortestWordLengths.peek()!)
                    );
                }
            } else {
                this.wordLengthCounts.set(word.length, wordLenCount - 1);
            }

            //loop through stack and delete char by char in reverse
            let prevNode: iTrieNode<DataType>;
            while (nodeStack.length > 0) {
                prevNode = node;
                node = nodeStack.pop()!;

                //if previous node is now empty, remove reference to it
                if (prevNode.isEmpty()) {
                    node.removeNextChar(prevNode.getNodeChar());
                    deletedNodes.push(prevNode);
                }
            }
        }

        return deletedNodes;
    }

    /**
     * Get the number of words this Trie contains
     */
    getNumWords(): number {
        return this.numWords;
    }

    /**
     * Get all words represented in this trie
     */
    getAllWords(): string[] {
        return this.getAllWordsWithPrefix("");;
    }

    /**
     * Get a list of all words with an initial prefix
     */
    getAllWordsWithPrefix(prefix: string): string[] {
        return this.getAllWordsWithPrefixSuffix(prefix, "");
    }

    /**
     * Get all words with prefix and their associated data
     */
    getAllWordsDataWithPrefix(prefix: string): iWordWithData<DataType>[] {
        return this.getAllWordsDataWithPrefixSuffix(prefix, "");
    }

    /**
     * Get all words which start with a prefix and end with a suffix
     */
    getAllWordsWithPrefixSuffix(prefix: string, suffix: string): string[] {
        let node = this.findEndPrefixNode(prefix);

        //if prefix doesn't exist in tree, return empty array
        if (!node) {
            return [];
        }

        //otherwise, recursively determine words by depth first search
        const words: string[] = [];
        this.recursiveFindWordsAfterPrefix(node, false, prefix, suffix, words);

        return words;
    }

    /**
     * Get all words with prefix + suffix and their associated data
     */
    getAllWordsDataWithPrefixSuffix(prefix: string, suffix: string): iWordWithData<DataType>[] {
        let node = this.findEndPrefixNode(prefix);

        //if prefix doesn't exist in tree, return empty array
        if (!node) {
            return [];
        }

        //otherwise, recursively determine words by depth first search
        const words: iWordWithData<DataType>[] = [];
        this.recursiveFindWordsAfterPrefix(node, true, prefix, suffix, words);

        return words;
    }

    /**
     * Recursively find words given a prefix (depth first search)
     * Modifies words array in place
     */
    private recursiveFindWordsAfterPrefix(
        node: iTrieNode<DataType>,
        includeData: boolean,
        prefix: string,
        suffix: string,
        words: string[] | iWordWithData<DataType>[]
    ): void {
        if (node.isEndOfWord() && (!suffix || prefix.substring(suffix.length) === suffix)) {
            if (includeData) {
                (words as iWordWithData<DataType>[]).push({
                    word: prefix,
                    data: node.getNodeData()
                })
            } else {
                (words as string[]).push(prefix);
            }
        }

        for (const nextNode of node.getAllNextCharNodes()) {
            const nextPrefix = prefix + nextNode.getNodeChar();
            this.recursiveFindWordsAfterPrefix(nextNode, includeData, nextPrefix, suffix, words);
        }
    }

    /**
     * Given a prefix, find the last node corresponding to the last char of that prefix
     */
    private findEndPrefixNode(prefix: string): iTrieNode<DataType> | null {
        let isSearching = true;
        let node = this.rootNode;

        //iterate through trie to find the end of word marking
        for (let i = 0; isSearching && i < prefix.length; i++) {
            const char = prefix[i];

            if (node.hasNextCharNode(char)) {
                node = node.getNextCharNode(char);
            } else {
                isSearching = false;
            }
        }

        //if prefix doesn't exist in tree, return empty array
        return isSearching ? node : null;
    }

    /**
     * Given an iterable of characters,
     * find all words which contain those characters in any order
     */
    findWordsWithCharacters(characters: string[], mustIncludeAll: boolean): iTrieWordWithInsertions[] {
        const words: iTrieWordWithInsertions[] = [];
        this.searchWordsCharacters(this.rootNode, "", [], words, characters, mustIncludeAll);
        return words;
    }

    private searchWordsCharacters(
        node: iTrieNode<DataType>,
        prefix: string,
        prefixInsertions: string[],
        wordsList: iTrieWordWithInsertions[],
        chars: string[],
        mustIncludeAll: boolean
    ): void {
        //iterate over each char available in chars
        const visitedChars = new Set<string>();
        for (let cIndex = 0; cIndex < chars.length; cIndex++) {
            if (!visitedChars.has(chars[cIndex])) {
                visitedChars.add(chars[cIndex]);

                //case, char is wildcard, iterate over all children
                if (chars[cIndex] === "") {
                    //since it's a wildcard, iterate over every child of this node
                    for (const nextNode of node.getAllNextCharNodes()) {
                        const newPrefix = prefix + nextNode.getNodeChar();
                        const remainingChars = [...chars];
                        remainingChars.splice(cIndex, 1);

                        const newPrefixInsertions = [...prefixInsertions, nextNode.getNodeChar()];
                        //if this is the last char, or !mustIncludeAll, add word
                        if (nextNode.isEndOfWord() && (!mustIncludeAll || chars.length === 1)) {
                            wordsList.push({
                                word: newPrefix,
                                charInsertions: newPrefixInsertions
                            });
                        }

                        this.searchWordsCharacters(nextNode, newPrefix, newPrefixInsertions, wordsList, remainingChars, mustIncludeAll);
                    }
                } else {
                    if (node.hasNextCharNode(chars[cIndex])) {
                        const nextNode = node.getNextCharNode(chars[cIndex]);
                        const newPrefix = prefix + nextNode.getNodeChar();
                        const remainingChars = [...chars];
                        remainingChars.splice(cIndex, 1);

                        //if this is the last char, or !mustIncludeAll, add word
                        if (nextNode.isEndOfWord() && (!mustIncludeAll || chars.length === 1)) {
                            wordsList.push({
                                word: newPrefix,
                                charInsertions: prefixInsertions
                            });
                        }

                        this.searchWordsCharacters(nextNode, newPrefix, prefixInsertions, wordsList, remainingChars, mustIncludeAll);
                    }
                }
            }
        }
    }

    /**
     * Randomly find words throughout the trie
     */
    getRandomWords(numWords: number, minLength = 0, maxLength = Infinity): string[] {
        //if the input params are invalid, return immediately
        if (this.getNumWords() === 0 || minLength > this.getLongestWordLength() || maxLength < this.getShortestWordLength()) {
            return [];
        }

        const words = new Set<string>();
        for (let i = 0; words.size < numWords && i < this.numWords; i++) {
            const randomWord = this.getRandomWord(this.rootNode, "", minLength, maxLength, words);
            if (randomWord) {
                words.add(randomWord);
            }
        }
        return Array.from(words);
    }

    private getRandomWord(node: iTrieNode<DataType>, prefix: string, minLength: number, maxLength: number, includedSet: Set<string>): string | null {
        //invalid state, return null
        if (prefix.length >= maxLength) {
            return null;
        }

        prefix = prefix + node.getNodeChar();
        let children = [...node.getAllNextCharNodes()];
        //if this is a word and we're within length range
        if (prefix.length >= minLength && prefix.length <= maxLength && !includedSet.has(prefix)) {
            //if no children, return this current word
            if (children.length === 0 && node.isEndOfWord()) {
                return prefix;
            }

            //if so, randomly return this word or not
            if (node.isEndOfWord() && (Math.floor(Math.random() * (children.length + 1))) === children.length) {
                return prefix;
            }
        }

        children = AbstractTrie.shuffle(children);

        for (const childNode of children) {
            const word = this.getRandomWord(childNode, prefix, minLength, maxLength, includedSet);
            if (word) {
                return word;
            }
        }

        return null;
    }

    /**
     * Implement the iterable interface
     * Iterate over every word in the trie
     * @returns
     */
    *[Symbol.iterator]() {
        let node = this.rootNode;

        //we'll use an array for convenience
        //but a linked list would be more performant
        const nodeQueue: iTrieNode<DataType>[] = [];
        const queuePrefixes: string[] = [];

        //prefix for current word being iterated
        let prefix = "";

        //use breadth first search to find words
        while (true) {
            const nextNodes = node.getAllNextCharNodes();

            for (const nextNode of nextNodes) {
                nodeQueue.push(nextNode);
                queuePrefixes.push(prefix + nextNode.getNodeChar());
            }

            if (node.isEndOfWord()) {
                yield {
                    word: prefix,
                    data: node.getNodeData()
                };
            }

            //if queue is empty, stop
            if (nodeQueue.length === 0) {
                break;
            }

            //get from queue for next iteration
            node = nodeQueue.shift()!;
            prefix = queuePrefixes.shift()!;
        }
    }

    /**
     * Shuffle an array
     * @param array 
     * @returns 
     */
    private static shuffle(array: any[]) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    /**
     * Get an iterable object for this trie
     */
    toIterable(): Iterable<iWordWithData<DataType>> {
        return this[Symbol.iterator]();
    }
}

