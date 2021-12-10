import { runSortedListTests } from "../tests-common/sorted-list";
import { AvlSortedList } from "./avl-sorted-list";

describe("AvlSortedList", () => {
    runSortedListTests("AvlSortedList", AvlSortedList);
});