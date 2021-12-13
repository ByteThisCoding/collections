import { iComparable } from "../models/comparable";
import { iSortedList } from "../models/sorted-list";
import { BinaryTreeNode } from "./binary-tree-node";

export class BinarySortedList<
    ComparisonType,
    DataType extends ComparisonType = ComparisonType
    > implements iSortedList<ComparisonType, DataType> {

    /* private? */ rootNode: BinaryTreeNode<DataType> | null = null;

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
        copyFrom?: Iterable<DataType>,
        private allowDuplicates = true
    ) {
        if (copyFrom) {
            this.addMany(copyFrom);
        }
    }

    private numNodes = 0;
    get length(): number {
        return this.numNodes;
    }

    /**
     * Add a single value to the search tree
     * @param nodeValue 
     */
    add(nodeValue: DataType): void {
        const node = this.helpInsert(this.rootNode, nodeValue);
        //update the root element
        this.rootNode = node;
        this.numNodes++;
    }

    /**
     * Add many items to this sorted list at once
     * @param items
     */
    addMany(items: Iterable<DataType>): void {
        for (let item of items) {
            this.add(item);
        }
    }

    /**
     * Check if this sorted list contains a particular element
     * @param item
     */
    contains(nodeValue: ComparisonType): boolean {
        const node = this.findNodeByValue(nodeValue);
        return node ? true : false;
    }

    /**
     * Check if the search tree has a value
     */
    find(nodeValue: ComparisonType): DataType | null {
        const node = this.findNodeByValue(nodeValue);
        return node ? node.getValueForComparison() : null;
    }

    remove(nodeValue: DataType): boolean {
        const isRemoved = this.helpRemove(nodeValue);
        if (isRemoved) {
            this.numNodes--;
        }
        return isRemoved;
    }

    /**
     * Run some callback for each item.
     * @param callback : the iterator index does not specify any internal index of the item
     */
    forEach(callback: (item: DataType, iteratorIndex: number) => any): void {
        let index = 0;
        for (const item of this) {
            callback(item, index);
            index ++;
        }
    }

    /**
     * Map this sorted list to another sorted list
     * @param sortFunc : new sort function to use
     * @param callback : map callback to use
     */
    map<
        NewComparisonType,
        NewDataType extends NewComparisonType = NewComparisonType
    >(
        sortFunc: (a: NewComparisonType, b: NewComparisonType) => number,
        callback: (item: DataType, iteratorIndex: number) => NewDataType
    ): BinarySortedList<NewComparisonType, NewDataType> {
        const newList = new BinarySortedList<NewComparisonType, NewDataType>(sortFunc);
        this.forEach((item, ind) => {
            newList.add(
                callback(item, ind)
            );
        });
        return newList;
    }

    /**
     * Return a sorted list based on this one with certain elements removed
     * @param callback
     */
    filter(
        callback: (item: DataType, iteratorIndex: number) => boolean
    ): BinarySortedList<ComparisonType, DataType> {
        const newList = new BinarySortedList<ComparisonType, DataType>(this.compare);
        this.forEach((item, ind) => {
            if (callback(item, ind)) {
                newList.add(
                    item
                );
            }
        });
        return newList;
    }

    /**
     * Implement the iterable interface
     * @returns
     */
    *[Symbol.iterator]() {
        let node = this.rootNode;
        if (!node) {
            return;
        }

        const stack: BinaryTreeNode<DataType>[] = [];
        //iterate recursively via stack
        while (node || stack.length > 0) {

            //work through the left side
            while (node) {
                stack.push(node);
                node = node.leftNode;
            }

            //get the last stored node
            node = stack.pop()!;

            for (const [value, count] of node.nodeValues) {
                for (let i=0; i<count; i++) {
                    yield value;
                }
            }

            node = node.rightNode;
        }
    }

    /**
     * Shallow clone the list
     */
    clone(): BinarySortedList<ComparisonType, DataType> {
        const newList = new BinarySortedList<ComparisonType, DataType>(this.compare);
        this.forEach((item, ind) => {
            newList.add(
                item
            );
        });
        return newList;
    }

    /**
     * Get the intersection between this list and another
     * @param list
     */
    getIntersectionWith(
        list: Iterable<DataType>
    ): BinarySortedList<ComparisonType, DataType> {
        const intersectionList = new BinarySortedList<ComparisonType, DataType>(
            this.compare
        );
        for (let listItem of list) {
            if (this.contains(listItem)) {
                intersectionList.add(listItem);
            }
        }
        return intersectionList;
    }

    /**
    * Check if this has the same elements as another list (not necessarily in the same order)
    * @param list
    */
    hasSameElementsAs(list: Iterable<DataType>): boolean {
        return this.getIntersectionWith(list).length === this.length;
    }

    /**
     * Traverse the tree and return an array 
     */
    toArray(): DataType[] {
        const ar: DataType[] = [];
        this.forEach(item => ar.push(item));
        return ar;
    }

    private helpRemove(nodeValue: DataType): boolean {
        //find node to remove and alias names
        const nodeToRemove = this.findNodeByValue(nodeValue);
        const parentOfNodeToRemove = nodeToRemove?.parentNode;

        //if node is not present, nothing to do, so return now
        if (nodeToRemove === null) {
            return false;
        } else if (this.allowDuplicates) {
            nodeToRemove.removeValue(nodeValue);
            return true;
        }

        //there cases: node has no children, one child, or two children
        if (nodeToRemove.numChildren === 0) {
            parentOfNodeToRemove!.removeChild(nodeToRemove);
        } else if (nodeToRemove.numChildren === 1) {
            //if one child, remove node and replace it with the node's only child

            const childOfRemoved = nodeToRemove.leftNode || nodeToRemove.rightNode;
            if (parentOfNodeToRemove === null) {
                this.rootNode = childOfRemoved!;
            } else {
                //replace the left/right child
                const removedSide = parentOfNodeToRemove!.removeChild(nodeToRemove);
                if (removedSide === -1) {
                    parentOfNodeToRemove!.leftNode = childOfRemoved;
                } else {
                    parentOfNodeToRemove!.rightNode = childOfRemoved;
                }
            }
        } else {

            //if two children, find successor / predecessor and swap out
            const minNode = this.findLargestSmallerThan(nodeToRemove);
            const minNodeParent = minNode.parentNode;

            //replace the node to delete with a clone of the predecessor node
            //make sure child references are intact
            const replacementNode = nodeToRemove.clone(minNode.nodeValues);
            minNodeParent!.removeChild(minNode);

            //replace the node to remove with the cloned node
            if (parentOfNodeToRemove!.leftNode === nodeToRemove) {
                parentOfNodeToRemove!.leftNode = replacementNode;
            } else {
                parentOfNodeToRemove!.rightNode = replacementNode;
            }
        }

        return true;
    }

    private helpInsert(node: BinaryTreeNode<DataType> | null, nodeValue: DataType): BinaryTreeNode<DataType> {
        //base case, node is not set
        if (node === null) {
            const newNode = new BinaryTreeNode<DataType>(this.allowDuplicates);
            newNode.addValue(nodeValue);
            return newNode;
        }

        //otherwise, determine where to insert
        if (this.compare(nodeValue, node.getValueForComparison()) < 0) {
            //recursively call to insert in the correct position
            node.leftNode = this.helpInsert(node.leftNode, nodeValue);
        } else if (this.compare(nodeValue, node.getValueForComparison()) > 0) {
            node.rightNode = this.helpInsert(node.rightNode, nodeValue);
        } else if (this.allowDuplicates) {
            node.addValue(nodeValue);
        }

        return node;
    }

    /**
     * Find a node within the tree given some node value
     */
    private findNodeByValue(nodeValue: ComparisonType): BinaryTreeNode<DataType> | null {
        //simple case, no nodes yet
        if (!this.rootNode) {
            return null;
        }

        //otherwise
        let hasNode = false;

        let searchNode = this.rootNode;
        while (true) {
            if (this.compare(searchNode.getValueForComparison(), nodeValue) === 0) {
                hasNode = true;
                break;
            } else if (this.compare(nodeValue, searchNode.getValueForComparison()) < 0) {
                //check if we can traverse
                if (searchNode.leftNode === null) {
                    break;
                } else {
                    searchNode = searchNode.leftNode;
                }
            } else {
                //check if we can traverse
                if (searchNode.rightNode === null) {
                    break;
                } else {
                    searchNode = searchNode.rightNode;
                }
            }
        }

        //if we have the node, return refs, otherwise, return nulls
        return hasNode ? searchNode : null;
    }

    /**
     * Find the largest node in subtree smaller than root
     */
    private findLargestSmallerThan(startNode: BinaryTreeNode<DataType>): BinaryTreeNode<DataType> {
        const searchValue = startNode.getValueForComparison();

        let matchNode = startNode;

        let searchNode = startNode;

        while (searchNode !== null) {
            if (searchNode.getValueForComparison() < searchValue) {
                matchNode = searchNode;
            }

            if (searchNode.rightNode !== null && searchNode.rightNode!.getValueForComparison() < searchValue) {
                searchNode = searchNode.rightNode;
            } else {
                searchNode = searchNode.leftNode!;
            }
        }

        return matchNode
    }
}