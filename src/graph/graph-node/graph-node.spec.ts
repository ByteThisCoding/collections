import { EqualitySet } from "../../equality-set/equality-set";
import { GraphNode } from "./graph-node";

describe("GraphNode", () => {
    it("should add and remove node connections", () => {
        const nodeStart = new GraphNode<number>(16);

        expect(nodeStart.outConnections.length).toBe(0);

        nodeStart.addConnectionTo(new GraphNode<number>(17));
        expect(nodeStart.outConnections.length).toBe(1);

        const connection = new GraphNode<number>(17);
        nodeStart.addConnectionTo(connection);
        expect(nodeStart.outConnections.length).toBe(2);

        //if object reference is same, don't add again
        nodeStart.addConnectionTo(connection);
        expect(nodeStart.outConnections.length).toBe(2);

        nodeStart.removeConnectionTo(connection);
        expect(nodeStart.outConnections.length).toBe(1);
    });

    it("should get the min length between start node and some connected node", () => {
        const nodeStart = new GraphNode<number>(16);

        //directly connected
        const nodeOneAway = new GraphNode<number>(17);
        nodeStart.addConnectionTo(nodeOneAway);
        expect(nodeStart.getMinPathLengthToNode(nodeOneAway)).toBe(1);
        expect(nodeStart.hasPathToNode(nodeOneAway)).toBe(true);

        //path two
        const nodeTwoAway = new GraphNode<number>(18);
        nodeOneAway.addConnectionTo(nodeTwoAway);
        expect(nodeStart.getMinPathLengthToNode(nodeTwoAway)).toBe(2);
        expect(nodeStart.hasPathToNode(nodeTwoAway)).toBe(true);

        //disconnected node
        const disconnectedNode = new GraphNode<number>(19);
        expect(nodeStart.getMinPathLengthToNode(disconnectedNode)).toBe(-1);
        expect(nodeStart.hasPathToNode(disconnectedNode)).toBe(false);

        //avoid infinite loop in cycles
        nodeOneAway.addConnectionTo(nodeStart);
        const nodeTwoAwayAlternate = new GraphNode<number>(1);
        nodeOneAway.addConnectionTo(nodeTwoAwayAlternate);
        expect(nodeStart.getMinPathLengthToNode(nodeTwoAwayAlternate)).toBe(2);
        expect(nodeStart.hasPathToNode(nodeTwoAwayAlternate)).toBe(true);
    });

    it("should get paths to node", () => {
        const nodeStart = new GraphNode<number>(16);

        //directly connected
        const nodeOneAway = new GraphNode<number>(17);
        nodeStart.addConnectionTo(nodeOneAway);
        expect(nodeStart.getPathsToNode(nodeOneAway)).toStrictEqual([
            [nodeStart, nodeOneAway],
        ]);

        //path two
        const nodeTwoAway = new GraphNode<number>(18);
        nodeOneAway.addConnectionTo(nodeTwoAway);
        expect(nodeStart.getPathsToNode(nodeTwoAway)).toStrictEqual([
            [nodeStart, nodeOneAway, nodeTwoAway],
        ]);

        //add another path two
        const nodeTwoAwayAlternate = new GraphNode<number>(180);
        nodeOneAway.addConnectionTo(nodeTwoAwayAlternate);
        expect(nodeStart.getPathsToNode(nodeTwoAwayAlternate)).toStrictEqual([
            [nodeStart, nodeOneAway, nodeTwoAwayAlternate],
        ]);

        //add node one alternate and connect to nodeTwo
        const nodeOneAwayAlternate = new GraphNode<number>(171);
        nodeStart.addConnectionTo(nodeOneAwayAlternate);
        nodeOneAwayAlternate.addConnectionTo(nodeTwoAway);
        expect(nodeStart.getPathsToNode(nodeTwoAway)).toStrictEqual([
            [nodeStart, nodeOneAway, nodeTwoAway],
            [nodeStart, nodeOneAwayAlternate, nodeTwoAway],
        ]);

        //add loop to start
        nodeOneAwayAlternate.addConnectionTo(nodeStart);
        const nodeStartToStartPaths = nodeStart.getPathsToNode(nodeStart);
        expect(nodeStartToStartPaths.length).toBe(1);
        expect(nodeStartToStartPaths[0][0]).toBe(nodeStart);
        expect(nodeStartToStartPaths[0][1]).toBe(nodeOneAwayAlternate);
        expect(nodeStartToStartPaths[0][2]).toBe(nodeStart);

        //add loop to nodeOneAwayAlternate to itself
        nodeOneAwayAlternate.addConnectionTo(nodeOneAwayAlternate);
        const nodeOneAwayAlternateCycle =
            nodeOneAwayAlternate.getPathsToNode(nodeOneAwayAlternate);
        expect(nodeOneAwayAlternateCycle.length).toBe(2);
        expect(nodeOneAwayAlternateCycle[0][0]).toBe(nodeOneAwayAlternate);
        expect(nodeOneAwayAlternateCycle[0][1]).toBe(nodeStart);
        expect(nodeOneAwayAlternateCycle[0][2]).toBe(nodeOneAwayAlternate);

        expect(nodeOneAwayAlternateCycle[1][0]).toBe(nodeOneAwayAlternate);
        expect(nodeOneAwayAlternateCycle[1][1]).toBe(nodeOneAwayAlternate);

        expect(nodeOneAwayAlternate.hasPathToNode(nodeOneAwayAlternate)).toBe(true);
    });
});
