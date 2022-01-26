export class StackNode<DataType> {

    public next: StackNode<DataType> | null = null;

    constructor(
        public readonly value: DataType
    ) {}
}