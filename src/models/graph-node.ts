/**
 * Representation of a graph node with connections to other nodes
 * Each node can only have one connection to another node (though that node can connect back at the same time)
 * A node with connections to other nodes implicitly represents a connected graph
 */
export interface iGraphNode<DataType> {
    /**
     * A list of nodes this is connected to
     */
    outConnections: iGraphNode<DataType>[];

    /**
     * Value stored by this node
     */
    nodeValue: DataType;

    /**
     * Add a connection to another node from this node
     * Return true if node was added, false otherwise (node already added?)
     * @param node
     */
    addConnectionTo(node: iGraphNode<DataType>): boolean;


    /**
     * Event listener when a node connection is added
     * @param callback 
     */
    onNodeConnectionAdded(callback: (node: iGraphNode<DataType>) => any): void;

    /**
     * Remove a connection to another node from this node if it exists
     * @param node
     */
    removeConnectionTo(node: iGraphNode<DataType>): boolean;

    /**
     * Event listener when a node connection is removed
     * @param callback 
     */
    onNodeConnectionRemoved(callback: (node: iGraphNode<DataType>) => any): void;

    /**
     * Check if this node connects to another node
     * @param node
     */
    hasPathToNode(node: iGraphNode<DataType>): boolean;

    /**
     * Get the path length from this node to another node, or -1 if not connected
     * @param node
     */
    getMinPathLengthToNode(node: iGraphNode<DataType>): number;

    /**
     * Get the shortest path from this node to another node, or -1 if not connected
     * @param node
     */
     getMinPathToNode(node: iGraphNode<DataType>): iGraphNode<DataType>[] | null;

    /**
     * Get all paths from this node to another node
     * @param node
     */
    getPathsToNode(node: iGraphNode<DataType>): iGraphNode<DataType>[][];

}
