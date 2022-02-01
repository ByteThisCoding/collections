import { LinkedList } from "./linked-list";
import { LINKED_LIST_TEST} from "./test-data";

describe("LinkedList", () => {

    let list: LinkedList<number>;

    beforeEach(() => {
        list = new LinkedList<number>(LinkedList.compareNumbers);
    });

    it("should push some items", () => {
        list.push(1);
        expect(list.length).toBe(1);
        expect(list.contains(1)).toBe(true);
        expect(list.contains(2)).toBe(false);

        list.push(2);
        expect(list.length).toBe(2);
        expect(list.contains(1)).toBe(true);
        expect(list.contains(2)).toBe(true);
        expect(list.peekLast()).toBe(2);

        list.push(3);
        expect(list.length).toBe(3);
        expect(list.contains(3)).toBe(true);

        expect(list.peekFirst()).toBe(1);
        expect(list.peekLast()).toBe(3);
    });

    it("should shift some items", () => {
        list.shift(1);
        expect(list.length).toBe(1);
        expect(list.contains(1)).toBe(true);
        expect(list.contains(2)).toBe(false);

        list.shift(2);
        expect(list.length).toBe(2);
        expect(list.contains(1)).toBe(true);
        expect(list.contains(2)).toBe(true);

        list.shift(3);
        expect(list.length).toBe(3);
        expect(list.contains(3)).toBe(true);

        expect(list.peekFirst()).toBe(3);
        expect(list.peekLast()).toBe(1);
    });

    it("should pop some item", () => {
        list.push(1);
        
        let item = list.pop();
        expect(item).toBe(1);
        expect(list.length).toBe(0);

        list.push(2);
        list.push(3);

        item = list.pop();
        expect(item).toBe(3);
        expect(list.length).toBe(1);
    });

    it("should unshift some item", () => {
        list.push(1);
        
        let item = list.pop();
        expect(item).toBe(1);
        expect(list.length).toBe(0);

        list.push(2);
        list.push(3);

        item = list.unshift();
        expect(item).toBe(2);
        expect(list.length).toBe(1);
    });

    it("should find items", () => {
        list.push(1);
        list.push(2);
        list.push(3);

        expect(list.find(2)).toBe(2);
        expect(list.find(4)).toBe(null);
        expect(list.contains(4)).toBe(false);
    });

    it("should remove items", () => {
        list.push(1);
        list.push(2);
        list.push(3);

        list.remove(2);

        expect(list.length).toBe(2);
        expect(list.contains(3)).toBe(true);
        expect(list.contains(1)).toBe(true);
        expect(list.contains(2)).toBe(false);
    });

    it("should add a large number of items", () => {
        for (const item of LINKED_LIST_TEST) {
            list.push(item);
        }

        expect(list.contains(36)).toBe(true);
    });
});