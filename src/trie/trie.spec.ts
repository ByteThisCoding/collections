import { Trie } from "./trie";

describe("Trie", () => {

    it("should add words, then give the full list", () => {
        const testWords = [
            "apple",
            "orange",
            "byte",
            "test"
        ];
        
        const trie = new Trie();
        testWords.forEach(word => trie.addWord(word));

        expect(trie.getNumWords()).toBe(testWords.length);

        const trieWords = trie.getAllWords();
        expect(trieWords).toEqual(testWords);
    })

});