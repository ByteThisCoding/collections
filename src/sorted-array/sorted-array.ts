import { iComparable } from "../models/comparable";
import { iSortedList } from "../models/sorted-array";

export class SortedArray<
    ComparisonType,
    DataType extends ComparisonType = ComparisonType
    > implements iSortedList<ComparisonType, DataType>
{
    //use an array internally to contain the items
    private items: DataType[] = [];
    private iteratorPosition = -1;

    /**
     * This can be passed into the constructor to specify sorting by numbers in nondecreasing order
     */
    static compareNumbers = (a: number, b: number) => a - b;
    /**
     * This can be passed into the constructor to specify sorting by string via localeCompare
     */
    static compareStrings = (a: string, b: string) => a.localeCompare(b);
    /**
     * This can be passed into the constructor to specify sorting by Dates in nondecreasing order
     */
    static compareDates = (a: Date, b: Date) => +a - +b;
    /**
     * This can be passed into the constructor to specify sorting by anything which implements iComparable<any>
     */
    static compareFromComparable = (a: iComparable<any>, b: iComparable<any>) =>
        a.compareTo(b);
    /**
     * Run a comparison based on some specific property of the object
     * @param propertyName
     * @param compare
     * @returns
     */
    static compareFromProperty =
        (propertyName: string, compare: (a: any, b: any) => number) =>
            (a: any, b: any) =>
                compare(a[propertyName], b[propertyName]);

    constructor(
        public compare: (a: ComparisonType, b: ComparisonType) => number,
        copyFrom?: Iterable<DataType>
    ) {
        if (copyFrom) {
            this.addMany(copyFrom);
        }
    }

    /**
     * Get the length of the list
     */
    get length(): number {
        return this.items.length;
    }

    /**
     * Add a single item to the list
     */
    add(item: DataType): void {
        const { index } = this.findIndex(item);
        this.items = [
            ...this.items.slice(0, index),
            item,
            ...this.items.slice(index),
        ];
    }

    /**
     * Add many items to this sorted list at once
     * @param items
     */
    addMany(items: Iterable<DataType>): void {
        for (let item of items) {
            this.add(item);
        }
    }

    /**
     * Check if this sorted list contains a particular element
     * @param item
     */
    contains(item: ComparisonType): boolean {
        return this.findIndex(item).isMatch;
    }

    /**
     * Get a particular item based on the comparison type
     * @param item
     */
    find(item: ComparisonType): DataType | null {
        const { isMatch, index } = this.findIndex(item);
        if (isMatch) {
            return this.items[index];
        } else {
            return null;
        }
    }

    /**
     * Run some callback for each item.
     * @param callback : the iterator index does not specify any internal index of the item
     */
    forEach(callback: (item: DataType, iteratorIndex: number) => any): void {
        this.items.forEach((item, index) => callback(item, index));
    }

    /**
     * Map this sorted list to another sorted list
     * @param sortFunc : new sort function to use
     * @param callback : map callback to use
     */
    map<
        NewComparisonType = ComparisonType,
        NewDataType extends NewComparisonType = NewComparisonType
    >(
        sortFunc: (a: NewComparisonType, b: NewComparisonType) => number,
        callback: (item: DataType, iteratorIndex: number) => NewDataType
    ): SortedArray<NewComparisonType, NewDataType> {
        const sortedAr = new SortedArray<NewComparisonType, NewDataType>(
            sortFunc
        );
        this.items.forEach((item, index) => {
            const newItem: NewDataType = callback(item, index);
            sortedAr.add(newItem);
        })
        return sortedAr;
    }

    /**
     * Return a sorted list based on this one with certain elements removed
     * @param callback 
     */
    filter(callback: (item: DataType, iteratorIndex: number) => boolean): iSortedList<ComparisonType, DataType> {
        const filteredAr = this.items.filter((item, index) => callback(item, index));
        const newSortedArray = new SortedArray<ComparisonType, DataType>(this.compare);
        //since we know this list is guaranteed to still be sorted
        //we can apply directly to the new instance
        newSortedArray.items = filteredAr;
        return newSortedArray;
    }

    /**
     * Implement the iterable interface
     * @returns
     */
    [Symbol.iterator] = () => ({
        next: (): IteratorResult<DataType> => {
            return this.next();
        },
    });

    next(): IteratorResult<DataType> {
        this.iteratorPosition++;
        return {
            done: this.iteratorPosition === this.items.length,
            value: this.items[this.iteratorPosition],
        };
    }

    toArray(): DataType[] {
        return [...this.items];
    }

    private findIndex(item: ComparisonType): {
        index: number;
        isMatch: boolean;
    } {
        //we will begin by including all elements in the array for consideration
        let start = 0;
        let end = this.items.length;

        //be careful when using while (true)
        while (true) {
            //the item to check will be exactly halfway between the start and end index
            //if there are an even number of elements, thus two items in the center, pick the one to the left
            const pos = Math.floor((end - start) / 2 + start);

            //if the position is already the end element, we're done looking, item doesn't exist in ar
            if (pos >= end) {
                return {
                    isMatch: false,
                    index: pos,
                };
            } else if (pos < 0) {
                return {
                    isMatch: false,
                    index: 0,
                };
            }

            //compare the string we're looking for to the item in ar[pos]
            const comp = this.compare(item, this.items[pos]);

            //if we've found our item, return the pos
            if (comp === 0) {
                return {
                    isMatch: true,
                    index: pos,
                };
            }

            //if the item is lesser in our comparison
            if (comp < 0) {
                end = pos;
            } else {
                //shift the beginning to the current position + 1
                //this means we can assume all items to the left !== str
                start = pos + 1;
            }
        }
    }
}
