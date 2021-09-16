/**
 * Create a generator function which will repeatedly invoke a callback and yield its result
 * @param callback 
 * @returns 
 */
export function* GeneratorFrom<DataType>(callback: (iteration: number) => {
    isLast: boolean,
    value: DataType
}): IterableIterator<DataType> {
    for (let i=0; true; i++) {
        const next = callback(i);
        if (next.isLast) {
            return next.value;
        } else {
            yield next.value;
        }
    }
};