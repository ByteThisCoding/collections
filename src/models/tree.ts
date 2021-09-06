import { iGraphNode } from "./graph-node";

export interface iTree<DataType> {

    /**
     * Root node for this tree
     */
    rootNode: iGraphNode<DataType>;

    /**
     * Represent children as their own trees
     */
    children: iTree<DataType>[];

    nodeCount: number;

    leafNodeCount: number;

    depth: number;

    /**
     * Add a child node to this tree at the root
     * @param node 
     */
    addChildNode(node: iGraphNode<DataType>): void;

    /**
     * Remove a child node from the root node if it has this child
     * @param node 
     */
    removeChildNode(node: iGraphNode<DataType>): void;

}