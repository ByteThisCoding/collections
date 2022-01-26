import { iStack } from "../models/stack";
import { StackNode } from "./stack-node";


export class Stack<DataType> implements iStack<DataType> {

    private head: StackNode<DataType> | null = null;
    private _length: number = 0;

    get count(): number {
        return this._length;
    }

    push(item: DataType): void {
        const stackNode = new StackNode<DataType>(item);
        stackNode.next = this.head;
        this.head = stackNode;
        this._length++;
    }

    peek(): DataType | null {
        return this.head?.value || null;
    }

    pop(): DataType | null {
        if (this.head === null) {
            return null;
        }
        this._length --;

        const nodeValue = this.head.value;
        this.head = this.head.next;

        return nodeValue;
    }
}