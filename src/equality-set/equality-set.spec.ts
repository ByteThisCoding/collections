import { EqualitySet } from "./equality-set";

describe("EqualitySet", () => {


    it("should not add a duplicate to the set", () => {

        const set = new EqualitySet(
            EqualitySet.compareStrings
        );

        set.add("Byte This!");
        set.add("Byte This");
        set.add("Byte This!");

        expect(set.size).toBe(2);

    });

});