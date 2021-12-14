import { iQueue } from "../models/queue";
import { QueueNode } from "./queue-node";

export class Queue<DataType> implements iQueue<DataType> {

    private head: QueueNode<DataType> | null = null;
    private tail: QueueNode<DataType> | null = null;
    private _length: number = 0;

    get length(): number {
        return this._length;
    }

    add(item: DataType): void {
        const queueNode = new QueueNode<DataType>(item);
        if (this.head === null) {
            this.head = queueNode;
            this.tail = queueNode;
            this._length = 1;
        } else {
            //update refs
            this.tail!.next = queueNode;
            this.tail = this.tail!.next;

            this._length ++;
        }
    }

    peek(): DataType | null {
        return this.tail?.value || null;
    }

    poll(): DataType | null {
        if (this.head === null) {
            return null;
        }

        const nodeValue = this.head.value;

        if (this.head.next === null) {
            this.head = null;
            this.tail = null;
            this._length = 0;
        } else {
            this.head = this.head.next;
            this._length --;
        }

        return nodeValue;
    }
    
}