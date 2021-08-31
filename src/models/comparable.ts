/**
 * An interface which allows us to compare an item to another item of a particular data type
 * Intended use is to have a <Type> implement iComparable<Type>
 */
export interface iComparable<DataType> {
    compareTo(item: DataType): number;
}
