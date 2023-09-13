import type { FileInterface } from "./file-interface";
export declare enum ImgFocus {
    CENTRE = "centre",
    TOP = "top",
    LEFT = "left",
    BOTTOM = "bottom",
    RIGHT = "right",
    ENTROPY = "entropy",
    ATTENTION = "attention"
}
export interface ImgDimension {
    width: number;
    height: number;
}
export interface ImgRGB {
    r: number;
    g: number;
    b: number;
}
export interface ImageInterface extends FileInterface {
    version: number;
    focus: ImgFocus;
    isAnimated: boolean;
    dominant: ImgRGB;
    dimensions: ImgDimension;
}
