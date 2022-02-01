import { iComparable } from "../models/comparable";
import { iLinkedList } from "../models/linked-list";
import { LinkedListNode } from "./linked-list-node";

/**
 * This uses a circular doubly linked list
 */
export class LinkedList<ComparisonType, DataType extends ComparisonType = ComparisonType> implements iLinkedList<ComparisonType, DataType> {

    /**
    * This can be passed into the constructor to specify sorting by numbers in nondecreasing order
    */
    static compareNumbers = (a: number, b: number) => a === b;
    /**
     * This can be passed into the constructor to specify sorting by string via localeCompare
     */
    static compareStrings = (a: string, b: string) => a === b
    /**
     * This can be passed into the constructor to specify sorting by Dates in nondecreasing order
     */
    static compareDates = (a: Date, b: Date) => +a === +b;
    /**
     * This can be passed into the constructor to specify sorting by anything which implements iComparable<any>
     */
    static compareFromComparable = (a: iComparable<any>, b: iComparable<any>) =>
        a.compareTo(b) === 0;
    /**
     * Run a comparison based on some specific property of the object
     * @param propertyName
     * @param compare
     * @returns
     */
    static compareFromProperty =
        (propertyName: string, compare: (a: any, b: any) => number) =>
            (a: any, b: any) =>
                compare(a[propertyName], b[propertyName]) === 0;

    constructor(
        public compare: (a: ComparisonType, b: ComparisonType) => boolean,
        copyFrom?: Iterable<DataType>
    ) {
        if (copyFrom) {
            for (const item of copyFrom) {
                this.push(item);
            }
        }
    }

    private head: LinkedListNode<DataType> | null = null;

    private size = 0;
    get length(): number {
        return this.size;
    }

    peekFirst(): DataType | null {
        if (this.size === 0) {
            return null;
        }
        return this.head!.value;
    }

    peekLast(): DataType | null {
        if (this.size === 0) {
            return null;
        }
        return this.head!.prev.value;
    }

    shift(item: DataType): void {
        const newNode = new LinkedListNode<DataType>(item);
        if (this.head) {
            newNode.next = this.head;
            newNode.prev = this.head.prev;
            this.head.prev.next = newNode;
            newNode.next.prev = newNode;
        }
        this.head = newNode;
        this.size ++;
    }

    push(item: DataType): void {
        const newNode = new LinkedListNode<DataType>(item);
        if (this.head) {
            newNode.next = this.head;
            newNode.prev = this.head.prev;
            this.head.prev.next = newNode;
            this.head.prev = newNode;
        } else {
            this.head = newNode;
        }
        this.size ++;
    }

    unshift(): DataType | null {
        if (this.size === 0) {
            return null;
        }

        const headValue = this.head!.value;
        if (this.size === 1) {
            this.size = 0;
            this.head = null;
            return headValue;
        }

        this.head!.prev.next = this.head!.next;
        this.head!.prev.next!.prev = this.head!.prev;

        this.size --;
        return headValue;
    }

    pop(): DataType | null {
        if (this.size === 0) {
            return null;
        }

        const tailValue = this.head!.prev!.value;
        if (this.size === 1) {
            this.size = 0;
            this.head = null;
            return tailValue;
        }
        
        this.head!.prev = this.head!.prev.prev;
        this.head!.prev!.prev!.next = this.head!;

        this.size --;
        return tailValue;
    }

    find(item: ComparisonType): DataType | null {
        if (this.size === 0) {
            return null;
        }

        let node = this.head!;
        do {
            if (this.compare(node.value, item)) {
                return node.value;
            }
            node = node.next;
        } while (node !== this.head);

        return null;
    }

    contains(item: ComparisonType): boolean {
        return this.find(item) !== null;
    }

    remove(item: ComparisonType): boolean {
        let itemDeleted = false;

        if (this.size === 0) {
            return itemDeleted;
        }

        let node = this.head!;
        do {
            if (this.compare(node.value, item)) {
                node.prev.next = node.next;
                node.next.prev = node.prev;
                if (node === this.head) {
                    this.head = node.next;
                }
                itemDeleted = true;
                this.size --;
            }
            node = node.next;
        } while (node !== this.head);

        return itemDeleted;
    }

}