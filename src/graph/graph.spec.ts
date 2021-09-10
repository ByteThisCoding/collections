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

    it("should enumerate paths", () => {
        const graph = new Graph<number>();

        const node17 = new GraphNode<number>(17);
        const node19 = new GraphNode<number>(19);
        node17.addConnectionTo(node19);

        graph.addNode(node17);

        //graph with one path
        const paths17and19 = graph.enumeratePaths();
        expect(paths17and19.length).toBe(1);
        expect(paths17and19[0][0].nodeValue).toBe(node17.nodeValue);
        expect(paths17and19[0][1].nodeValue).toBe(node19.nodeValue);

        //graph with two paths
        const node20 = new GraphNode(20);
        node17.addConnectionTo(node20);
        const paths17and19and20 = graph.enumeratePaths();
        expect(paths17and19and20.length).toBe(2);
        expect(paths17and19and20[0][0].nodeValue).toBe(node17.nodeValue);
        expect(paths17and19and20[0][1].nodeValue).toBe(node19.nodeValue);
        expect(paths17and19and20[1][0].nodeValue).toBe(node17.nodeValue);
        expect(paths17and19and20[1][1].nodeValue).toBe(node20.nodeValue);

        //graph with three paths
        const node50 = new GraphNode(50);
        node20.addConnectionTo(node50);
        const finalPaths = graph.enumeratePaths();
        expect(finalPaths.length).toBe(4);
    });
});
