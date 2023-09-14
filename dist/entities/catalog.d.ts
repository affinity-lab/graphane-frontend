import type { AtomWithAttachments } from "./atom-with-attachments";
import { FileInterface } from "./file-interface";
import { ImageInterface, ImgDimension, ImgFocus, ImgRGB } from "./image-interface";
export declare class Catalog {
    readonly entity: AtomWithAttachments;
    readonly catalogName: string;
    static readonly fileUrl: string;
    static readonly imageUrl: string;
    static readonly uploadUrl: string;
    readonly files: FileAttachment[];
    constructor(entity: AtomWithAttachments, catalogName: string);
    get first(): FileAttachment | undefined;
    find(namePattern: string): FileAttachment | undefined;
    download(url: string): Promise<Response>;
    upload(files: File | File[]): Promise<any>;
}
export declare class FileAttachment implements FileInterface {
    readonly file: FileInterface;
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
    static create(init: FileAttachment, dimensions: ImgDimension): ImageAttachment;
    get webp(): string;
}
