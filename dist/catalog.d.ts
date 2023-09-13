import type { AtomWithAttachments } from "./atom-with-attachments";
import { FileInterface } from "./file-interface";
import { ImageInterface, ImgDimension, ImgFocus, ImgRGB } from "./image-interface";
export declare class Catalog {
    readonly entity: AtomWithAttachments;
    readonly catalogName: string;
    readonly hostUrl: string;
    readonly files: FileAttachment[];
    constructor(entity: AtomWithAttachments, catalogName: string, hostUrl: string);
    get first(): FileAttachment | undefined;
    find(name: string): FileAttachment | undefined;
}
export declare class FileAttachment implements FileInterface {
    protected readonly file: FileInterface;
    protected readonly catalog: Catalog;
    size: number;
    name: string;
    mimeType: string;
    title: string;
    location: string;
    constructor(file: FileInterface, catalog: Catalog);
    get url(): string;
    img(x: number, y: number): ImageAttachment;
}
export declare class ImageAttachment extends FileAttachment implements ImageInterface {
    dimensions: ImgDimension;
    dominant: ImgRGB;
    isAnimated: boolean;
    focus: ImgFocus;
    version: number;
    fileName: string;
    extension: string;
    constructor(file: ImageInterface, catalog: Catalog, dimensions: ImgDimension);
    get webp(): string;
}
