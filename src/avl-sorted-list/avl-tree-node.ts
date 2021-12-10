/**
 * Encpasulate a tree node which has:
 * : value
 * : 0-2 children / decendants
 */
export class AvlTreeNode<DataType> {
    private _leftNode: AvlTreeNode<DataType>  | null = null;
    private _rightNode: AvlTreeNode<DataType>  | null = null;
    private _parentNode: AvlTreeNode<DataType> | null = null;

    public height = 1;
    public balance = 0;
    
    public numDecendants = 0;

    /**
     * Create a node with a nodeValue + count
     * We'll use count to allow our AVL tree
     * to have duplicate entries
     */
    constructor(
        public readonly nodeValue: DataType,
        public occurenceCount: number = 1
    ) { }

    get numChildren(): number {
        return (this.leftNode === null ? 0 : 1)
            + (this.rightNode === null ? 0 : 1);
    }

    get leftNode(): AvlTreeNode<DataType>  | null {
        return this._leftNode;
    }

    /**
     * Set the left node and recalculate heights
     */
    set leftNode(node: AvlTreeNode<DataType>  | null) {
        this._leftNode = node;
        if (node) {
            node.parentNode = this;
        }
        this.resynchronizeChildren();
    }

    get rightNode(): AvlTreeNode<DataType>  | null {
        return this._rightNode;
    }

    /**
     * Set the right node and recalculate heights
     */
    set rightNode(node: AvlTreeNode<DataType>  | null) {
        this._rightNode = node;
        if (node) {
            node.parentNode = this;
        }
        this.resynchronizeChildren();
    }

    get parentNode(): AvlTreeNode<DataType> | null {
        return this._parentNode;
    }

    set parentNode(node: AvlTreeNode<DataType> | null) {
        this._parentNode = node;
    }

    /**
     * Update height and balance based on child assignments
     */
    resynchronizeChildren(): void {
        const rightNodeHeight = this._rightNode?.height || 0;
        const leftNodeHeight = this._leftNode?.height || 0;
        this.balance = leftNodeHeight - rightNodeHeight
        this.height = 1 + Math.max(leftNodeHeight, rightNodeHeight);

        const numDescLeft = this._leftNode ? 1 + this._leftNode.numDecendants : 0;
        const numDescRight = this._rightNode ? 1 + this._rightNode.numDecendants : 0;

        this.numDecendants = numDescLeft + numDescRight;
    }


    /**
     * If the input is a direct child of this node,
     * remove it and return true, false otherwise
     */
    removeChild(childNode: AvlTreeNode<DataType> ): number {
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
    clone(newValue: DataType | void): AvlTreeNode<DataType>  {
        const newNode = new AvlTreeNode<DataType> (
            typeof newValue === 'undefined' ? this.nodeValue : newValue,
            this.occurenceCount
        );
        newNode.leftNode = this.leftNode;
        newNode.rightNode = this.rightNode;
        newNode.resynchronizeChildren();
        return newNode;
    }
}