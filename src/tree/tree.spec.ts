import { GraphNode } from "../graph/graph-node/graph-node";
import { Tree } from "./tree";

describe("Tree", () => {

    /*it("should add and remove children", () => {

        const tree = new Tree<number>(
            new GraphNode<number>(17)
        );

        expect(tree.rootNode.nodeValue).toBe(17);
        expect(tree.nodeCount).toBe(1);
        expect(tree.depth).toBe(0);

        const childLevelOne = new GraphNode<number>(11);
        tree.addChildNode(
            childLevelOne
        );

        expect(tree.nodeCount).toBe(2);
        expect(tree.depth).toBe(1);
        expect(tree.leafNodeCount).toBe(1);

        const childLevelTwo = new GraphNode<number>(111);
        childLevelOne.addConnectionTo(childLevelTwo);

        expect(tree.nodeCount).toBe(3);
        expect(tree.depth).toBe(2);
        expect(tree.leafNodeCount).toBe(1);
    });*/

    it("should get count of leaf nodes", () => {
        const tree = new Tree<number>(
            new GraphNode<number>(17)
        );
        expect(tree.leafNodeCount).toBe(1);

        //this will be leaf
        tree.addChildNode(new GraphNode<number>(12));
        expect(tree.leafNodeCount).toBe(1);

        //this will have children
        const parentOne = new GraphNode(123);
        tree.addChildNode(parentOne);
        expect(tree.leafNodeCount).toBe(2);

        //this will be leaf child of parentOne
        const parentOneChildLeafOne = new GraphNode(-1);
        parentOne.addConnectionTo(parentOneChildLeafOne);
        expect(tree.leafNodeCount).toBe(2);

        //this will be parent child of parentOne
        const parentOneParentOne = new GraphNode(11);
        parentOne.addConnectionTo(parentOneParentOne);
        expect(tree.leafNodeCount).toBe(3);

        //this will be leaf child of parentOneParentOne
        const parentOneParentOneChildLeafOne = new GraphNode(123123);
        parentOneParentOne.addConnectionTo(parentOneParentOneChildLeafOne);
        expect(tree.leafNodeCount).toBe(3);
    });

    /*it("should prevent cycles from being added", () => {

        const tree = new Tree<number>(
            new GraphNode<number>(17)
        );

        const childLevelOne = new GraphNode<number>(11);
        tree.addChildNode(
            childLevelOne
        );

        const childLevelTwo = new GraphNode<number>(111);
        childLevelOne.addConnectionTo(childLevelTwo);

        try {
            childLevelTwo.addConnectionTo(childLevelOne);
            console.log(childLevelTwo.getPathsToNode(childLevelTwo));
            fail("ChildLevelTwo connection to ChildLevelOne should thrown cycle error");
        } catch (err) {}


    });*/

});