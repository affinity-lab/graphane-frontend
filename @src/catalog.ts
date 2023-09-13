import type {AtomWithAttachments} from "./atom-with-attachments";
import {FileInterface} from "./file-interface";
import {MaterializeIt} from "./materialize-it";
import {ImageInterface, ImgDimension, ImgFocus, ImgRGB} from "./image-interface";
import {isMatch} from "micromatch";


export class Catalog {
    public static readonly hostUrl: string;

    public readonly files: FileAttachment[] = [];

    constructor(
        public readonly entity: AtomWithAttachments,
        public readonly catalogName: string
    ) {
        const files: FileInterface[] = entity.attachments[catalogName];
        for (let file of files) {
            this.files.push(new FileAttachment(file, this));
        }
    };

    get first(): FileAttachment | undefined {
        return this.files[0];
    };

    find(namePattern: string): FileAttachment | undefined {
        return this.files.find((file: FileAttachment): boolean => isMatch(file.name, namePattern));
    };

    // async download(url: string): Promise<any> {
    // };
    //
    // async upload(): Promise<any> {
    // };
}

export class FileAttachment implements FileInterface {
    size: number;

    name: string;

    mimeType: string;

    title: string;

    location: string;

    constructor(protected readonly file: FileInterface, protected readonly catalog: Catalog) {
        this.size = file.size;
        this.name = file.name;
        this.mimeType = file.mimeType;
        this.title = file.title;
        this.location = file.location;
    };

    @MaterializeIt()
    get url(): string {
        return `${Catalog.hostUrl}/files/${this.catalog.entity.ident}/${this.catalog.catalogName}/${this.name}`;
    };

    img(x: number, y: number): ImageAttachment {
        return new ImageAttachment(
            this.file as ImageInterface,
            this.catalog,
            {
                width: x,
                height: y
            }
        );
    };
}

export class ImageAttachment extends FileAttachment implements ImageInterface {
    dimensions: ImgDimension;

    dominant: ImgRGB;

    isAnimated: boolean;

    focus: ImgFocus;

    version: number;

    fileName: string;

    extension: string;

    constructor(file: ImageInterface, catalog: Catalog, dimensions: ImgDimension) {
        super(file, catalog);
        this.dominant = file.dominant;
        this.isAnimated = file.isAnimated;
        this.focus = file.focus;
        this.version = file.version;
        this.dimensions = dimensions;
        const i: number = this.name.lastIndexOf(".");
        if (i === -1) throw new Error(`No extension: ${this.name}`);
        this.fileName = this.name.slice(0, i);
        this.extension = this.name.slice(i + 1);
    };

    @MaterializeIt()
    get webp(): string {
        return `${Catalog.hostUrl}/images/${this.catalog.entity.ident}/${this.catalog.catalogName}/${this.dimensions.width}.${this.dimensions.height}.${this.focus}.${this.version}.${this.extension}/${this.fileName}.webp`;
    };
}
