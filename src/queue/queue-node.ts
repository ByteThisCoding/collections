export class QueueNode<DataType> {

    public next: QueueNode<DataType> | null = null;

    constructor(
        public readonly value: DataType
    ) {}

}