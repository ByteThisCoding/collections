/**
 * A trie node with references to next chars
 * and marks if this represents the end of a word
 * 
 * This can be the end of a word AND a prefix to another word
 * in certain cases, such as "go" and "goat"
 */
export interface iTrieNode {
    getNodeChar(): string;

    /**
     * Check if this node points to "char" as the next char
     */
    hasNextCharNode(char: string): boolean;

    /**
     * Get the node reference for "char"
     */
    getNextCharNode(char: string): iTrieNode;

    /**
     * Get all next char nodes
     */
    getAllNextCharNodes(): iTrieNode[];

    /**
     * Add a char reference to this node
     */
    addNextChar(char: string): void;

    /**
     * Delete a reference to a next character
     */
    removeNextChar(char: string): void;

    /**
     * Check if this corresponds to the end of a word
     */
    isEndOfWord(): boolean;

    /**
     * Mark the current node as the ending of a word
     */
    markAsEndOfWord(): void;

    /**
     * Unmark the current node as the ending of a word
     */
    unmarkAsEndOfWord(): void;

    /**
     * Check if this node is the end of a word
     * or has outgoing connections 
     */
    isEmpty(): boolean;

    getNumNextChars(): number;
}

export class TrieNode implements iTrieNode {

    //store children using char => trieNode map
    //the char "*" indicates this node represents the end of a word
    protected nextChars = new Map<string, TrieNode | null>();

    constructor(
        private char: string
    ) { }

    getNodeChar(): string {
        return this.char;
    }

    getNumNextChars(): number {
        return this.nextChars.size - (this.isEndOfWord() ? 1 : 0);
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