import { Queue } from "./queue";

describe("Queue", () => {

    it("should insert and remove an item", () => {
        const queue = new Queue<number>()
        queue.add(7);

        expect(queue.length).toBe(1);
        expect(queue.peek()).toBe(7);

        const val = queue.poll();

        expect(queue.length).toBe(0);
        expect(val).toBe(7);
    });

    it("should insert multiple items and queue in correct order", () => {
        const queue = new Queue<number>();
        queue.add(0);
        queue.add(1);
        queue.add(2);
        queue.add(3);

        const len = queue.length;
        for (let i=0; i<len; i++) {
            expect(queue.poll()).toBe(i);
        }

        expect(queue.length).toBe(0);
        expect(queue.peek()).toBeNull();
    });

    it("should empty, then allow for more insertions", () => {
        const queue = new Queue<number>();
        queue.add(0);
        queue.add(1);
        queue.add(2);
        queue.add(3);

        let len = queue.length;
        for (let i=0; i<len; i++) {
            expect(queue.poll()).toBe(i);
        }

        expect(queue.length).toBe(0);
        expect(queue.peek()).toBeNull();

        //repeat operation
        queue.add(0);
        queue.add(1);
        queue.add(2);
        queue.add(3);

        len = queue.length;
        for (let i=0; i<len; i++) {
            expect(queue.poll()).toBe(i);
        }

        expect(queue.length).toBe(0);
        expect(queue.peek()).toBeNull();
    });

});