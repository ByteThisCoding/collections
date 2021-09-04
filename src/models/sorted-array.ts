import { iComparable } from "./comparable";

/**
 * Generic Types are ComparisonType and DataType
 * ---> ComparisonType tells us what we need to make a comparison between to DataTypes
 * ---> DataType is the full data type we will be storing
 */
export interface iSortedList<
    ComparisonType,
    DataType extends ComparisonType = ComparisonType
    > extends Iterator<DataType> {
    /**
     * Get the length of the list
     */
    readonly length: number;

    compare: (a: ComparisonType, b: ComparisonType) => number;

    /**
     * Add a single item to the list
     */
    add(item: DataType): void;

    /**
     * Add many items to this sorted list at once
     * @param items
     */
    addMany(items: Iterable<DataType>): void;

    /**
     * Check if this sorted list contains a particular element
     * @param item
     */
    contains(item: ComparisonType): boolean;

    /**
     * Get a particular item based on the comparison type
     * @param item
     */
    find(item: ComparisonType): DataType | null;

    /**
     * Run some callback for each item.
     * @param callback : the iterator index does not specify any internal index of the item
     */
    forEach(callback: (item: DataType, iteratorIndex: number) => any): void;

    /**
     * Map this sorted list to another sorted list
     * @param sortFunc : new sort function to use
     * @param callback : map callback to use
     */
    map<
        NewComparisonType,
        NewDataType extends NewComparisonType = NewComparisonType
    >(
        sortFunc: <NewComparisonType>(a: NewComparisonType, b: NewComparisonType) => number,
        callback: (item: DataType, iteratorIndex: number) => NewDataType
    ): iSortedList<NewComparisonType, NewDataType>

    /**
     * Return a sorted list based on this one with certain elements removed
     * @param callback 
     */
    filter(callback: (item: DataType, iteratorIndex: number) => boolean): iSortedList<ComparisonType, DataType>;

    /**
     * Return a copy of this sorted array as a basic list
     */
    toArray(): DataType[];

    /**
     * Deep clone this object
     */
    clone(): iSortedList<ComparisonType, DataType>;
}
