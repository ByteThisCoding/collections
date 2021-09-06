import { iGraphNode } from "./graph-node";

export interface iGraph<DataType> {
    nodeCount: number;

    /**
     * Add an existing node to this graph
     * Return true if node was added, false otherwise (already exists)
     * @param node
     */
    addNode(node: iGraphNode<DataType>): boolean;

    /**
     * If this node exists in the graph remove it and all connections to it
     * Return true if node was deleted, false otherwise (did not exist)
     * @param node
     */
    removeNode(node: iGraphNode<DataType>): boolean;

    /**
     * Check if the graph has a node
     * @param node 
     */
    hasNode(node: iGraphNode<DataType>): boolean;

    /**
     * Event listener when a node connection is added
     * @param callback 
     */
    onNodeConnectionAdded(callback: (nodeFrom: iGraphNode<DataType>, ndoeTo: iGraphNode<DataType>) => any): void;

    /**
         * Event listener when a node connection is removed
         * @param callback 
         */
    onNodeConnectionRemoved(callback: (nodeFrom: iGraphNode<DataType>, ndoeTo: iGraphNode<DataType>) => any): void;

    /**
     * Check if there is a cycle / loop within this graph
     */
    hasCycle(): boolean;

    /**
     * Get an array of cycles which exist in the graph
     */
    getCycles(): iGraphNode<DataType>[];
}
