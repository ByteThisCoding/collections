import { AvlSortedList } from "../avl-sorted-list/avl-sorted-list";
import { iTrieNode } from "./trie-node";

interface iSearchTreeNode<DataType> {
    char: string;
    node: SortedTrieNode<DataType>;
}

/**
 * This Trie Node Sorts its Children By Char Order
 */
export class SortedTrieNode<DataType> implements iTrieNode<DataType> {

    private _isEndOfWord = false;

    //store children using binary search tree
    //the char "*" indicates this node represents the end of a word
    protected nextChars = new AvlSortedList<{char: string}, iSearchTreeNode<DataType>>(
        (a, b) => a.char.localeCompare(b.char), void 0, false
    );

    constructor(
        private char: string,
        private data?: DataType | void
    ) { }

    getNodeChar(): string {
        return this.char;
    }

    /**
     * Get the data this node represents
     */
    getNodeData(): DataType | void {
        return this.data;
    }

    setNodeData(data: DataType | void): void {
        this.data = data;
    }

    getNumNextChars(): number {
        return this.nextChars.length - (this.isEndOfWord() ? 1 : 0);
    }

    /**
     * Check if this node points to "char" as the next char
     */
    hasNextCharNode(char: string): boolean {
        return !!this.nextChars.find({char});
    }

    /**
     * Get the node reference for "char"
     */
    getNextCharNode(char: string): SortedTrieNode<DataType> {
        return this.nextChars.find({char})!.node;
    }

    /**
     * Get all next char nodes
     */
    getAllNextCharNodes(): SortedTrieNode<DataType>[] {
        const nodes: SortedTrieNode<DataType>[] = [];
        for (const treeNode of this.nextChars) {
            nodes.push(treeNode.node!);
        }
        return nodes;
    }

    /**
     * Add a char reference to this node
     */
    addNextChar(char: string): void {
        const existing = this.nextChars.find({char});
        if (existing) {
            existing.node = new SortedTrieNode(char);
        } else {
            this.nextChars.add({
                char,
                node: new SortedTrieNode(char)
            });
        }
    }

    /**
     * Delete a reference to a next character
     */
    removeNextChar(char: string): void {
        this.nextChars.removeAll({char});
    }

    /**
     * Check if this corresponds to the end of a word
     */
    isEndOfWord(): boolean {
        return this._isEndOfWord;
    }

    /**
     * Mark the current node as the ending of a word
     */
    markAsEndOfWord(): void {
        this._isEndOfWord = true;
    }

    /**
     * Unmark the current node as the ending of a word
     */
    unmarkAsEndOfWord(): void {
        this._isEndOfWord = false;
    }

    /**
     * Check if this node is the end of a word
     * or has outgoing connections 
     */
    isEmpty(): boolean {
        return this.nextChars.length === 0;
    }
}