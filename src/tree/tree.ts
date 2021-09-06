import { Graph } from "../graph/graph";
import { iGraphNode } from "../models/graph-node";
import { iTree } from "../models/tree";

export class Tree<DataType> implements iTree<DataType> {

    //use a graph to represent internally
    private graph = new Graph<DataType>();

    private leafNodeCountChangeMarked = true;
    private lastLeafNodeCount: number = -1;

    private depthCountChangeMarked = true;
    private lastDepthCount: number = -1;

    constructor(
        public readonly rootNode: iGraphNode<DataType>
    ) {
        this.graph.addNode(rootNode);
        this.graph.onNodeConnectionAdded((nodeFrom, nodeTo) => {
            this.validateNoCycle(nodeTo);
            this.markTreeChanged();
        });
    }

    get nodeCount(): number {
        return this.graph.nodeCount;
    }


    get leafNodeCount(): number {
        if (this.leafNodeCountChangeMarked) {
            const children = this.children;
            if (children.length === 0) {
                this.lastLeafNodeCount = 1;
            } else {
                this.lastLeafNodeCount = children.reduce((acc, child) => acc + child.leafNodeCount, 0);
            }
            this.leafNodeCountChangeMarked = false;
        }
        return this.lastLeafNodeCount;
    }

    get depth(): number {
        if (this.depthCountChangeMarked) {
            this.lastDepthCount = Math.max(0, ...this.children.map((child) => {
                return 1 + child.depth;
            }));
            this.depthCountChangeMarked = false;
        }
        return this.lastDepthCount;
    }

    /**
     * Represent children as their own trees
     */
    get children(): iTree<DataType>[] {
        return this.rootNode.outConnections.map(childNode => {
            const subTree = new Tree<DataType>(childNode);
            subTree.graph = this.graph;
            return subTree;
        });
    }

    /**
     * Add a child node to this tree at the root
     * @param node 
     */
    addChildNode(node: iGraphNode<DataType>): void {
        this.rootNode.addConnectionTo(node);
        this.markTreeChanged();
    }

    private validateNoCycle(node: iGraphNode<DataType>): void {
        if (node.hasPathToNode(node)) {
            throw new Error(`A cycle has been detected.`);
        }
    }

    /**
     * Remove a child node from the root node if it has this child
     * @param node 
     */
    removeChildNode(node: iGraphNode<DataType>): void {
        this.graph.removeNode(node);
        this.markTreeChanged();
    }

    private markTreeChanged() {
        this.depthCountChangeMarked = true;
        this.leafNodeCountChangeMarked = true;
    }

}