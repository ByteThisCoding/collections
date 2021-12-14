export interface iQueue<DataType> {

    length: number;

    add(item: DataType): void;

    peek(): DataType | null;

    poll(): DataType | null;

}