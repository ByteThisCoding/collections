export class LinkedListNode<DataType> {

    public next: LinkedListNode<DataType> = this;
    public prev: LinkedListNode<DataType> = this;

    constructor(
        public readonly value: DataType
    ) {}
}