import { iSortedList } from "./sorted-list";

export interface iEqualitySet<
    ComparisonType,
    DataType extends ComparisonType = ComparisonType
    > extends iSortedList<ComparisonType, DataType> {

    size: number;

}