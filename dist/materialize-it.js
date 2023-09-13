"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterializeIt = void 0;
/** A decorator function that materializes a getter property into a value property after the first access. */
function MaterializeIt() {
    return function (target, name, descriptor) {
        const getter = descriptor.get;
        if (!getter) {
            throw new Error(`Getter property descriptor expected when materializing. Name: ${target.name}, property: ${name.toString()}`);
        }
        descriptor.get = function () {
            const value = getter.call(this);
            Object.defineProperty(this, name, {
                configurable: descriptor.configurable,
                enumerable: descriptor.enumerable,
                writable: false,
                value
            });
            return value;
        };
    };
}
exports.MaterializeIt = MaterializeIt;
