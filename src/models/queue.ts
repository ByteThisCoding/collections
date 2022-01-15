export interface iQueue<DataType> {

    length: number;

    add(item: DataType): void;

    //alias for add
    enqueue(item: DataType): void;

    peek(): DataType | null;

    poll(): DataType | null;

    //alias for poll
    dequeue(): DataType | null;

}