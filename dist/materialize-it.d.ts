interface CachePropertyDescriptor<T, R> extends PropertyDescriptor {
    get?: (this: T) => R;
}
/** A decorator function that materializes a getter property into a value property after the first access. */
export declare function MaterializeIt(): <T, R>(target: any, name: PropertyKey, descriptor: CachePropertyDescriptor<T, R>) => void;
export {};
