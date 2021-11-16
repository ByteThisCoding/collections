import { iGraphNode } from "../../models/graph-node";

export class GraphNode<DataType> implements iGraphNode<DataType> {

    private connectionsAddedCallbacks: Function[] = [];
    private connectionsRemovedCallbacks: Function[] = [];

    constructor(public nodeValue: DataType) { }

    /**
     * A list of nodes this is connected to
     */
    readonly outConnections: GraphNode<DataType>[] = [];

    /**
     * Add a connection to another node from this node
     * @param node
     */
    addConnectionTo(node: GraphNode<DataType>): boolean {
        const referenceIndex = this.outConnections.findIndex(
            (conn) => conn === node
        );
        if (referenceIndex === -1) {
            this.outConnections.push(node);
            this.connectionsAddedCallbacks.forEach(callback => callback(node));
            return true;
        }
        return false;
    }

    /**
     * Remove a connection to another node from this node if it exists
     * @param node
     */
    removeConnectionTo(node: GraphNode<DataType>): boolean {
        const referenceIndex = this.outConnections.findIndex(
            (conn) => conn === node
        );
        if (referenceIndex > -1) {
            this.outConnections.splice(referenceIndex, 1);
            this.connectionsRemovedCallbacks.forEach(callback => callback(node));
            return true;
        }
        return false;
    }

    /**
     * Event listener when a node connection is added
     * @param callback 
     */
    onNodeConnectionAdded(callback: (node: iGraphNode<DataType>) => any): void {
        this.connectionsAddedCallbacks.push(callback);
    }

    /**
     * Event listener when a node connection is removed
     * @param callback 
     */
    onNodeConnectionRemoved(callback: (node: iGraphNode<DataType>) => any): void {
        this.connectionsRemovedCallbacks.push(callback);
    }

    /**
     * Check if this node connects to another node
     * @param node
     */
    hasPathToNode(node: GraphNode<DataType>): boolean {
        return this.getMinPathLengthToNode(node) > -1;
    }

    /**
     * Get the path length from this node to another node, or -1 if not connected
     * @param node
     */
    getMinPathLengthToNode(node: GraphNode<DataType>): number {
        const minPath = this.getMinPathToNode(node);
        return minPath ? minPath.length - 1 : -1;
    }

    /**
     * Get the shortest path from this node to another node, or -1 if not connected
     * @param node
     */
    getMinPathToNode(node: iGraphNode<DataType>): iGraphNode<DataType>[] | null {
        const paths = this.doGetPathsToNode(node as GraphNode<DataType>, []);
        return paths === null || paths.length === 0 ? null : paths.reduce(
            (minPath, path) => path.length < (minPath?.length || Infinity) ? path : minPath
        );
    }

    /**
     * Get all paths from this node to another node
     * @param node
     */
    getPathsToNode(node: GraphNode<DataType>): GraphNode<DataType>[][] {
        return this.doGetPathsToNode(node, []);
    }

    private doGetPathsToNode(
        node: GraphNode<DataType>,
        visitedNodes: GraphNode<DataType>[]
    ): GraphNode<DataType>[][] {
        if (visitedNodes.findIndex((vnode) => vnode === this) > -1) {
            return [];
        }
        visitedNodes.push(this);

        return this.outConnections
            .map((outNode) => {
                if (outNode === node) {
                    return [[this, node]];
                } else {
                    return outNode
                        .doGetPathsToNode(node, [...visitedNodes])
                        .map((path) => [this, ...path]);
                }
            })
            .flat(1);
    }
}
