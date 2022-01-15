export interface iStack<DataType> {

    count: number;

    push(item: DataType): void;

    peek(): DataType | null;

    pop(): DataType | null;

}