import { Stack } from "./stack";

describe("Stack", () => {

    it("should push and pop an item", () => {
        const stack = new Stack<number>();
        stack.push(7);

        expect(stack.count).toBe(1);
        expect(stack.peek()).toBe(7);

        const val = stack.pop();

        expect(stack.count).toBe(0);
        expect(val).toBe(7);
    });

    it("should insert multiple items and queue in correct order", () => {
        const stack = new Stack<number>();
        stack.push(0);
        stack.push(1);
        stack.push(2);
        stack.push(3);
        const initialCount = stack.count;

        const len = stack.count;
        for (let i=0; i<len; i++) {
            expect(stack.pop()).toBe(initialCount - i - 1);
        }

        expect(stack.count).toBe(0);
        expect(stack.peek()).toBeNull();
    });

    it("should empty, then allow for more insertions", () => {
        const stack = new Stack<number>();
        stack.push(0);
        stack.push(1);
        stack.push(2);
        stack.push(3);
        const initialCount = stack.count;

        let len = stack.count;
        for (let i=0; i<len; i++) {
            expect(stack.pop()).toBe(initialCount - i - 1);
        }

        expect(stack.count).toBe(0);
        expect(stack.peek()).toBeNull();

        //repeat operation
        stack.push(0);
        stack.push(1);
        stack.push(2);
        stack.push(3);

        len = stack.count;
        for (let i=0; i<len; i++) {
            expect(stack.pop()).toBe(initialCount - i - 1);
        }

        expect(stack.count).toBe(0);
        expect(stack.peek()).toBeNull();
    });

});