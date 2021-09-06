import { iEqualitySet } from "../models/equality-set";
import { SortedArray } from "../sorted-array/sorted-array";

export class EqualitySet<
        ComparisonType,
        DataType extends ComparisonType = ComparisonType
    >
    extends SortedArray<ComparisonType, DataType>
    implements iEqualitySet<ComparisonType, DataType>
{
    get size(): number {
        return this.length;
    }

    add(item: DataType): void {
        if (!this.contains(item)) {
            super.add(item);
        }
    }
}
