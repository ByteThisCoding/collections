import { runSortedListTests } from "../tests-common/sorted-list";
import { BinarySortedList } from "./binary-sorted-list";

describe("BinarySortedList", () => {
    runSortedListTests("BinarySortedList", BinarySortedList);
});