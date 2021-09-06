import { Graph } from "./graph";
import { GraphNode } from "./graph-node/graph-node";

describe("Graph", () => {
    it("should add and remove nodes", () => {
        const graph = new Graph<number>();

        const node17 = new GraphNode<number>(17);
        const node19 = new GraphNode<number>(19);
        node17.addConnectionTo(node19);

        graph.addNode(node17);
        expect(graph.nodeCount).toBe(2);

        graph.removeNode(node19);
        expect(graph.nodeCount).toBe(1);
        expect(node17.outConnections.length).toBe(0);
    });

    it("should detect cycles", () => {
        const graph = new Graph<number>();
        const nodeStart = new GraphNode<number>(16);
        graph.addNode(nodeStart);

        //directly connected
        const nodeOneAway = new GraphNode<number>(17);
        nodeStart.addConnectionTo(nodeOneAway);

        //path two
        const nodeTwoAway = new GraphNode<number>(18);
        nodeOneAway.addConnectionTo(nodeTwoAway);
        expect(nodeStart.getPathsToNode(nodeTwoAway)).toStrictEqual([
            [nodeStart, nodeOneAway, nodeTwoAway],
        ]);

        //add another path two
        const nodeTwoAwayAlternate = new GraphNode<number>(180);
        nodeOneAway.addConnectionTo(nodeTwoAwayAlternate);

        //add node one alternate and connect to nodeTwo
        const nodeOneAwayAlternate = new GraphNode<number>(171);
        nodeStart.addConnectionTo(nodeOneAwayAlternate);
        nodeOneAwayAlternate.addConnectionTo(nodeTwoAway);

        //add loop to start
        nodeOneAwayAlternate.addConnectionTo(nodeStart);

        //add loop to nodeOneAwayAlternate to itself
        nodeOneAwayAlternate.addConnectionTo(nodeOneAwayAlternate);

        //verify all nodes are added to graph
        expect(graph.nodeCount).toBeGreaterThan(1);

        expect(graph.hasCycle()).toBe(true);
    });
});
