import { AbstractTrie } from "./abstract-trie";
import { SortedTrieNode } from "./sorted-trie-node";
import { iTrieNode, TrieNode } from "./trie-node";

/**
 * This is a trie where each node has its children sorted by alphabetical order
 */
export class SortedTrie<DataType = void> extends AbstractTrie<DataType> {

    protected createNode(char: string): SortedTrieNode<DataType> {
        return new SortedTrieNode(char);
    }
    
}