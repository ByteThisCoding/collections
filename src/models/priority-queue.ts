export interface iPriorityQueue<
    ComparisonType,
    DataType extends ComparisonType = ComparisonType
> {

    count: number;

    enqueue(item: DataType): void;

    enqueueMany(items: Iterable<DataType>): void;

    dequeue(): DataType | null;

    peek(): DataType | null;
}