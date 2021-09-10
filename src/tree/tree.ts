import { Graph } from "../graph/graph";
import { iGraph } from "../models/graph";
import { iGraphNode } from "../models/graph-node";
import { iTree } from "../models/tree";

export class Tree<DataType> implements iTree<DataType> {

    //use a graph to represent internally
    private graph = new Graph<DataType>();

    private leafNodesChangeMarked = true;
    private lastLeafNodes: iGraphNode<DataType>[] = [];

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

    /**
     * Get all leaf nodes in this tree
     */
    get leafNodes(): iGraphNode<DataType>[] {
        if (this.leafNodesChangeMarked) {
            const children = this.children;
            if (children.length === 0) {
                this.lastLeafNodes = [this.rootNode];
            } else {
                this.lastLeafNodes = children.reduce((arr, child) => [...arr, ...child.leafNodes], [] as iGraphNode<DataType>[]);
            }
            this.leafNodesChangeMarked = false;
        }
        return this.lastLeafNodes;
    }

    get leafNodeCount(): number {
        return this.leafNodes.length;
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


    /**
     * Get all paths from the root node to the leaf nodes
     */
    enumeratePathsFromRootToLeaves(): iGraphNode<DataType>[][] {
        return this.leafNodes.map(leafNode => this.rootNode.getPathsToNode(leafNode)).flat();
    }

    private markTreeChanged() {
        this.depthCountChangeMarked = true;
        this.leafNodesChangeMarked = true;
    }

}