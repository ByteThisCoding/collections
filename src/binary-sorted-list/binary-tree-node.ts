/**
 * Encpasulate a tree node which has:
 * : value
 * : 0-2 children / decendants
 */
export class BinaryTreeNode<DataType> {
    private _leftNode: BinaryTreeNode<DataType>  | null = null;
    private _rightNode: BinaryTreeNode<DataType>  | null = null;
    private _parentNode: BinaryTreeNode<DataType> | null = null;

    //map of item to number of occurences
    public nodeValues = new Map<DataType, number>();

    /**
     * Create a node with a nodeValue + count
     * We'll use count to allow our AVL tree
     * to have duplicate entries
     */
    constructor(
        private allowDuplicates = true
    ) {}

    /**
     * Get any value we have for comparison purposes
     */
    getValueForComparison(): DataType {
        for (const [value, count] of this.nodeValues) {
            return value;
        }
        throw "No values, invalid state!";
    }

    addValue(value: DataType): void {
        if (this.allowDuplicates || !this.nodeValues.has(value)) {
            this.nodeValues.set(
                value,
                1 + (this.nodeValues.get(value) || 0)
            );
        }
    }

    /**
     * Return true if the node is empty
     * @param value 
     */
    removeValue(value: DataType): boolean {
        const existingCount = this.nodeValues.get(value) || 1;
        if (existingCount === 1) {
            this.nodeValues.delete(value);
        } else {
            this.nodeValues.set(value, existingCount - 1);
        }
        return this.nodeValues.size === 0;
    }

    get numChildren(): number {
        return (this.leftNode === null ? 0 : 1)
            + (this.rightNode === null ? 0 : 1);
    }

    get leftNode(): BinaryTreeNode<DataType>  | null {
        return this._leftNode;
    }

    /**
     * Set the left node and recalculate heights
     */
    set leftNode(node: BinaryTreeNode<DataType>  | null) {
        this._leftNode = node;
        if (node) {
            node.parentNode = this;
        }
    }

    get rightNode(): BinaryTreeNode<DataType>  | null {
        return this._rightNode;
    }

    /**
     * Set the right node and recalculate heights
     */
    set rightNode(node: BinaryTreeNode<DataType>  | null) {
        this._rightNode = node;
        if (node) {
            node.parentNode = this;
        }
    }

    get parentNode(): BinaryTreeNode<DataType> | null {
        return this._parentNode;
    }

    set parentNode(node: BinaryTreeNode<DataType> | null) {
        this._parentNode = node;
    }


    /**
     * If the input is a direct child of this node,
     * remove it and return true, false otherwise
     */
    removeChild(childNode: BinaryTreeNode<DataType> ): number {
        let removedSide = 0;
        if (this.leftNode === childNode) {
            this.leftNode = null;
            removedSide = -1;
        } else if (this.rightNode === childNode) {
            this.rightNode = null;
            removedSide = 1;
        }
        return removedSide;
    }

    /**
     * Clone the node,
     * optionally provide a new value
     */
    clone(newValues: Map<DataType, number> | void): BinaryTreeNode<DataType>  {
        const newNode = new BinaryTreeNode<DataType> (
            this.allowDuplicates
        );
        if (newValues) {
            newNode.nodeValues = newValues;
        }
        newNode.leftNode = this.leftNode;
        newNode.rightNode = this.rightNode;
        return newNode;
    }
}