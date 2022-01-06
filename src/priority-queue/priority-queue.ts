import { iComparable } from "../models/comparable";
import { iPriorityQueue } from "../models/priority-queue";

export class PriorityQueue<
    ComparisonType,
    DataType extends ComparisonType = ComparisonType
    > implements iPriorityQueue<ComparisonType, DataType>
{

    //store nodes internally as an array of numbers
    private nodes: DataType[] = [];

    get count(): number {
        return this.nodes.length;
    }

    /**
     * This can be passed into the constructor to specify sorting by numbers in nondecreasing order
     */
    static compareNumbers = (a: number, b: number) => a - b;
    /**
     * This can be passed into the constructor to specify sorting by string via localeCompare
     */
    static compareStrings = (a: string, b: string) => a.localeCompare(b);
    /**
     * This can be passed into the constructor to specify sorting by Dates in nondecreasing order
     */
    static compareDates = (a: Date, b: Date) => +a - +b;
    /**
     * This can be passed into the constructor to specify sorting by anything which implements iComparable<any>
     */
    static compareFromComparable = (a: iComparable<any>, b: iComparable<any>) =>
        a.compareTo(b);
    /**
     * Run a comparison based on some specific property of the object
     * @param propertyName
     * @param compare
     * @returns
     */
    static compareFromProperty =
        (propertyName: string, compare: (a: any, b: any) => number) =>
            (a: any, b: any) =>
                compare(a[propertyName], b[propertyName]);

    constructor(
        public compare: (a: ComparisonType, b: ComparisonType) => number,
        copyFrom?: Iterable<DataType>
    ) {
        if (copyFrom) {
            this.enqueueMany(copyFrom);
        }
    }

    enqueue(item: DataType): void {
        this.nodes.push(item);

        //swap nodes to preserve heap properties
        let nodeIndex = this.nodes.length - 1;
        let parentNodeIndex = this.getParentIndex(nodeIndex);

        //first part of condition will fail after root node is processed
        while (parentNodeIndex !== -1 && this.compare(this.nodes[nodeIndex], this.nodes[parentNodeIndex]) < 0) {
            this.swapNodes(nodeIndex, parentNodeIndex);

            nodeIndex = parentNodeIndex;
            parentNodeIndex = this.getParentIndex(parentNodeIndex);
        }
    }

    enqueueMany(items: Iterable<DataType>): void {
        for (const item of items) {
            this.enqueue(item);
        }
    }

    peek(): DataType | null {
        return this.nodes.length === 0 ? null : this.nodes[0];
    }

    dequeue(): DataType | null {
        //base case, no nodes present
        if (this.nodes.length === 0) {
            return null;
        } else if (this.nodes.length === 1) {
            return this.nodes.pop()!;
        }

        //otherwise, proceed as normal
        const rootNodeValue = this.nodes[0];

        //swap root with last node, then delete last node
        this.nodes[0] = this.nodes.pop()!;

        //remove root node and reshift elements to preserve heap properties
        let nodeIndex = 0;
        while (true) {
            const leftChildIndex = this.getLeftChildIndex(nodeIndex);
            const rightChildIndex = this.getRightChildIndex(nodeIndex);


            //find the max child, set that value to current node, and proceed
            const isRightLesser = leftChildIndex < this.nodes.length && this.compare(this.nodes[rightChildIndex], this.nodes[leftChildIndex]) < 0;
            if (rightChildIndex < this.nodes.length && isRightLesser && this.compare(this.nodes[rightChildIndex], this.nodes[nodeIndex]) < 0) {
                this.swapNodes(nodeIndex, rightChildIndex);
                nodeIndex = rightChildIndex;
            } else if (leftChildIndex < this.nodes.length && this.compare(this.nodes[leftChildIndex], this.nodes[nodeIndex]) < 0) {
                this.swapNodes(nodeIndex, leftChildIndex);
                nodeIndex = leftChildIndex;
            } else {
                //both children are out of bounds or tree is settled
                break;
            }
        }

        return rootNodeValue;

    }

    /**
    * Get the index of the left child of the node at a given index
    */
    private getLeftChildIndex(index: number): number {
        return (index + 1) * 2 - 1;
    }

    /**
     * Get the index of the right child of the node at a given index
     */
    private getRightChildIndex(index: number): number {
        return (index + 1) * 2;
    }

    /**
     * Get the index of the parent of the node at a given index
     */
    private getParentIndex(index: number): number {
        return Math.floor((index - 1) / 2);
    }

    /**
     * Helper to swap two nodes
     */
    private swapNodes(aIndex: number, bIndex: number): void {
        const tmp = this.nodes[aIndex];
        this.nodes[aIndex] = this.nodes[bIndex];
        this.nodes[bIndex] = tmp;
    }


}