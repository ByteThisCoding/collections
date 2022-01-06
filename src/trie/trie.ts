import { iTrie } from "../models/trie";
import { PriorityQueue } from "../priority-queue/priority-queue";

/**
 * A trie node with references to next chars
 * and marks if this represents the end of a word
 * 
 * This can be the end of a word AND a prefix to another word
 * in certain cases, such as "go" and "goat"
 */
class TrieNode {

    //store children using char => trieNode map
    //the char "*" indicates this node represents the end of a word
    private nextChars = new Map<string, TrieNode | null>();

    constructor(
        private char: string
    ) { }

    getNodeChar(): string {
        return this.char;
    }

    /**
     * Check if this node points to "char" as the next char
     */
    hasNextCharNode(char: string): boolean {
        return this.nextChars.has(char);
    }

    /**
     * Get the node reference for "char"
     */
    getNextCharNode(char: string): TrieNode {
        return this.nextChars.get(char)!;
    }

    /**
     * Get all next char nodes
     */
    getAllNextCharNodes(): TrieNode[] {
        const nodes: TrieNode[] = [];
        for (const [char, node] of this.nextChars) {
            if (char !== "*") {
                nodes.push(node!);
            }
        }
        return nodes;
    }

    /**
     * Add a char reference to this node
     */
    addNextChar(char: string): void {
        this.nextChars.set(char, new TrieNode(char));
    }

    /**
     * Delete a reference to a next character
     */
    removeNextChar(char: string): void {
        this.nextChars.delete(char);
    }

    /**
     * Check if this corresponds to the end of a word
     */
    isEndOfWord(): boolean {
        return this.nextChars.has("*");
    }

    /**
     * Mark the current node as the ending of a word
     */
    markAsEndOfWord(): void {
        this.nextChars.set("*", null);
    }

    /**
     * Unmark the current node as the ending of a word
     */
    unmarkAsEndOfWord(): void {
        this.nextChars.delete("*");
    }

    /**
     * Check if this node is the end of a word
     * or has outgoing connections 
     */
    isEmpty(): boolean {
        return this.nextChars.size === 0;
    }

}

/**
 * A custom implementation of a trie data structure
 */
export class Trie implements iTrie {

    //the root node will be a special empty node
    private rootNode = new TrieNode("");

    private numWords = 0;

    //keep track of longest words in priority queue
    private longestWordLengths = new PriorityQueue<number>((a, b) => b - a);
    private shortestWordLengths = new PriorityQueue<number>((a, b) => a - b);
    //keep track of count of each word
    private wordLengthCounts = new Map<number, number>();

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
    addWord(word: string): void {
        let node = this.rootNode;

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

        }
    }

    /**
     * Recursively check if a word exists implicitly in the trie
     */
    containsWord(word: string): boolean {
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

        return isSearching && node.isEndOfWord();
    }

    /**
     * Recursively remove a word while leaving other words in-tact
     */
    removeWord(word: string): void {
        let isSearching = true;
        let node = this.rootNode;

        //use an array as a quick stack implementation option
        //linked list based stack may perform better
        const nodeStack: TrieNode[] = [];

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
            let prevNode: TrieNode;
            while (nodeStack.length > 0) {
                prevNode = node;
                node = nodeStack.pop()!;

                //if previous node is now empty, remove reference to it
                if (prevNode.isEmpty()) {
                    node.removeNextChar(prevNode.getNodeChar());
                }
            }
        }
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
        if (!isSearching) {
            return [];
        }

        //otherwise, recursively determine words by breadth first search
        const words: string[] = [];

        //we'll use an array for convenience
        //but a linked list would be more performant
        const nodeQueue: TrieNode[] = [];
        const queuePrefixes: string[] = [];

        //use breadth first search to find words
        while (true) {
            const nextNodes = node.getAllNextCharNodes();

            for (const nextNode of nextNodes) {
                nodeQueue.push(nextNode);
                queuePrefixes.push(prefix + nextNode.getNodeChar());
            }

            if (node.isEndOfWord()) {
                words.push(prefix);
            }

            //if queue is empty, stop
            if (nodeQueue.length === 0) {
                break;
            }

            //get from queue for next iteration
            node = nodeQueue.shift()!;
            prefix = queuePrefixes.shift()!;
        }

        return words;
    }

    getRandomWords(numWords: number, minLength = 0, maxLength = Infinity): string[] {
        //if the input params are invalid, return immediately
        if (this.getNumWords() === 0 || minLength > this.getLongestWordLength() || maxLength < this.getShortestWordLength()) {
            return [];
        }

        const words = new Set<string>();
        for (let i = 0; i < numWords; i++) {
            const randomWord = this.getRandomWord(this.rootNode, "", minLength, maxLength, words);
            if (randomWord) {
                words.add(randomWord);
            }
        }
        return Array.from(words);
    }

    private getRandomWord(node: TrieNode, prefix: string, minLength: number, maxLength: number, includedSet: Set<string>): string | null {
        //invalid state, return null
        if (prefix.length >= maxLength) {
            return null;
        }

        prefix = prefix + node.getNodeChar();
        let children = [...node.getAllNextCharNodes()];
        //if this is a word and we're within length range
        if (prefix.length > minLength && prefix.length < maxLength && !includedSet.has(prefix)) {
            //if no children, return this current word
            if (children.length === 0 && node.isEndOfWord()) {
                return prefix;
            }

            //if so, randomly return this word or not
            if (node.isEndOfWord() && (Math.floor(Math.random() * (children.length + 1))) === children.length) {
                return prefix;
            }
        }

        children = Trie.shuffle(children);

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
        const nodeQueue: TrieNode[] = [];
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
                yield prefix;
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
}
