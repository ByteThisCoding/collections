export interface iLinkedList<ComparisonType, DataType extends ComparisonType = ComparisonType> {

    length: number;

    //add to the beginning of the list
    shift(item: DataType): void;

    //add to the end of the list
    push(item: DataType): void;

    //remove from the beginning of the list
    unshift(): DataType | null;

    //remove from the end of the list
    pop(): DataType | null;

    peekFirst(): DataType | null;

    peekLast(): DataType | null;

    //find a particular item
    find(item: ComparisonType): DataType | null;

    //check if this list has a particular item
    contains(item: ComparisonType): boolean;

    //remove any item which satisfies the comparison type
    remove(item: ComparisonType): boolean;
}