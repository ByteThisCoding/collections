import { AbstractTrie } from "./abstract-trie";
import { iTrieNode, TrieNode } from "./trie-node";

export class Trie<DataType = void> extends AbstractTrie<DataType> {

    protected createNode(char: string): TrieNode<DataType> {
        return new TrieNode(char);
    }
    
}