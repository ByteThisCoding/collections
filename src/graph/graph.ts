import { iGraph } from "../models/graph";
import { iGraphNode } from "../models/graph-node";
import { GraphNode } from "./graph-node/graph-node";

export class Graph<DataType> implements iGraph<DataType> {

    private connectionsAddedCallbacks: Function[] = [];
    private connectionsRemovedCallbacks: Function[] = [];

    private nodes: iGraphNode<DataType>[] = [];

    get nodeCount(): number {
        return this.nodes.length;
    }

    /**
     * Add an existing node to this graph
     * @param node
     */
    addNode(node: iGraphNode<DataType>): boolean {
        const nodeIndex = this.nodes.findIndex((gnode) => gnode === node);
        if (nodeIndex === -1) {
            this.nodes.push(node);
            node.outConnections.forEach(outNode => this.addNode(outNode));
            node.onNodeConnectionAdded(addedNode => {
                if (this.hasNode(node)) {
                    this.addNode(addedNode);
                    this.connectionsAddedCallbacks.forEach(callback => callback(node, addedNode));
                }
            });
            node.onNodeConnectionRemoved(removedNode => {
                if (this.hasNode(node)) {
                    this.connectionsRemovedCallbacks.forEach(callback => callback(node, removedNode));
                }
            });
            return true;
        }
        return false;
    }

    /**
     * If this node exists in the graph remove it and all connections to it
     * @param node
     */
    removeNode(node: iGraphNode<DataType>): boolean {
        const nodeIndex = this.nodes.findIndex((gnode) => gnode === node);
        if (nodeIndex > -1) {
            this.nodes.splice(nodeIndex, 1);
            this.nodes.forEach((gnode) => gnode.removeConnectionTo(node));
            return true;
        }
        return false;
    }

    /**
     * Event listener when a node connection is added
     * @param callback 
     */
    onNodeConnectionAdded(callback: (nodeFrom: iGraphNode<DataType>, ndoeTo: iGraphNode<DataType>) => any): void {
        this.connectionsAddedCallbacks.push(callback);
    }

    /**
         * Event listener when a node connection is removed
         * @param callback 
         */
    onNodeConnectionRemoved(callback: (nodeFrom: iGraphNode<DataType>, ndoeTo: iGraphNode<DataType>) => any): void {
        this.connectionsRemovedCallbacks.push(callback);
    }

    /**
     * Check if this graph has a node
     * @param node 
     */
    hasNode(node: iGraphNode<DataType>): boolean {
        return !!this.nodes.find(gnode => gnode === node);
    }

    /**
     * Check if there is a cycle / loop within this graph
     */
    hasCycle(): boolean {
        return this.getCycles().length > 0;
    }

    /**
     * Get an array of cycles which exist in the graph
     */
    getCycles(): iGraphNode<DataType>[] {
        return this.nodes.reduce(
            (allCycles: iGraphNode<DataType>[], node: iGraphNode<DataType>) => {
                return [...allCycles, ...node.getPathsToNode(node).flat(1)];
            },
            [] as iGraphNode<DataType>[]
        );
    }

    /**
     * Enumerate all paths which exist in a graph
     */
    enumeratePaths(): iGraphNode<DataType>[][] {
        let paths: iGraphNode<DataType>[][] = [];
        for (let i=0; i<this.nodes.length; i++) {
            const nodeFrom = this.nodes[i];
            for (let j=0; j<this.nodes.length; j++) {
                const nodeTo = this.nodes[j];
                paths = [...paths, ...nodeFrom.getPathsToNode(nodeTo)];
            }
        }
        return paths;
    }

    findNodes(callback: (node: iGraphNode<DataType>) => boolean): iGraphNode<DataType>[] {
        return this.nodes.filter(callback);
    }
}
