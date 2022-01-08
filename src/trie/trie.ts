import { AbstractTrie } from "./abstract-trie";
import { iTrieNode, TrieNode } from "./trie-node";

export class Trie extends AbstractTrie {

    protected createNode(char: string): TrieNode {
        return new TrieNode(char);
    }
    
}