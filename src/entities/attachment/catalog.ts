import type {AtomWithAttachments} from "../atom-with-attachments";
import type {FileInterface} from "../file-interface";
import {MaterializeIt} from "../../util/materialize-it";
import type {ImageInterface, ImgDimension, ImgFocus, ImgRGB} from "../image-interface";
import {minimatch}  from "minimatch";
import type {RequestEvent} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import {FileAttachment} from "./attachment";


export class Catalog {
    public static fileUrl: string
    public static imageUrl: string
    private static uploadUrl: string
    private static gqlUrl: string
    private static api_key: string

    private static createToken: (event: RequestEvent) => string | undefined;

    public files: FileAttachment[] = [];

    static init(fileUrl: string, imageUrl: string, uploadUrl: string, gqlUrl: string, api_key: string, createToken: (event: RequestEvent) => string | undefined): void {
        Catalog.fileUrl = fileUrl;
        Catalog.imageUrl = imageUrl;
        Catalog.uploadUrl = uploadUrl;
        Catalog.gqlUrl = gqlUrl;
        Catalog.api_key = api_key;
        Catalog.createToken = createToken;
        Catalog.init = (): void => {throw new Error("Catalog class has been initialized already");};
    }

    constructor(public readonly entity: AtomWithAttachments, public readonly catalogName: string) {
        if (!entity.META.catalogs?.includes(catalogName) || entity[catalogName] === undefined) throw new Error(`Catalog does not present in entity: ${entity.META.ident}.`);
        const files: FileInterface[] = entity[catalogName] as FileInterface[];
        for (let file of files) {
            this.files.push(new FileAttachment(file, this));
        }
    }

    get first(): FileAttachment | undefined {return this.files[0];}

    find(namePattern: string): FileAttachment | undefined {
        return this.files.find((file: FileAttachment): boolean => minimatch(file.name, namePattern));
    };

    download(url: string, event: RequestEvent): Promise<Response> {
        return event.fetch(url, {method: "POST"});
    };

    async upload(files: File | File[], event: RequestEvent): Promise<Response> {
        if (!Array.isArray(files)) files = [files];
        const body: FormData = new FormData();
        if (files.length === 0) throw error(400, "No files");
        for (let file of files) {
            if (file.name === "undefined") throw error(400, "Undefined file name");
            body.append(file.name, file);
        }
        const header = {
            "authorization": Catalog.createToken(event) ?? "",
            "api-key": Catalog.api_key
        };
        const res: {data?: {token?: string | null}} = await fetch(Catalog.gqlUrl, {
                body: JSON.stringify({
                    "query": `mutation ${this.entity.META.module}_modifyFiles${this.entity.META.entityName}($variables: FileInputVariables!, $id: Float!, $command: String!, $catalog: String!) {
                    token: ${this.entity.META.module}_modifyFiles${this.entity.META.entityName}(variables: $variables, id: $id, command: $command, catalog: $catalog)}`,
                    "variables": {
                        "variables": {},
                        "id": this.entity.id,
                        "command": "upload",
                        "catalog": this.catalogName
                    }
                }),
                method: "POST",
                headers: {
                    ...header,
                    "Content-Type": "application/json"
                }
            }
        ).then((res: Response) => res.json());
        if (!res.data?.token) throw error(500, "Can't get upload token");
        return await event.fetch(Catalog.uploadUrl, {
            headers: {
                ...header,
                "file-token": res.data.token
            },
            body,
            method: "POST"
        });
    };

    async remove(fileName: string, event: RequestEvent): Promise<Response> {
        const header = {
            "authorization": Catalog.createToken(event) ?? "",
            "api-key": Catalog.api_key
        };
        return await fetch(Catalog.gqlUrl, {
                body: JSON.stringify({
                    "query": `mutation ${this.entity.META.module}_modifyFiles${this.entity.META.entityName}($variables: FileInputVariables!, $id: Float!, $command: String!, $catalog: String!) {
                    token: ${this.entity.META.module}_modifyFiles${this.entity.META.entityName}(variables: $variables, id: $id, command: $command, catalog: $catalog)}`,
                    "variables": {
                        "variables": {fileName: fileName},
                        "id": this.entity.id,
                        "command": "delete",
                        "catalog": this.catalogName
                    }
                }),
                method: "POST",
                headers: {
                    ...header,
                    "Content-Type": "application/json"
                }
            }
        );
    };
}
//
// export class FileAttachment implements FileInterface {
//     size: number;
//     name: string;
//     mimeType: string;
//     title: string;
//     location: string;
//
//     constructor(public readonly file: FileInterface, protected readonly catalog: Catalog) {
//         this.size = file.size;
//         this.name = file.name;
//         this.mimeType = file.mimeType;
//         this.title = file.title;
//         this.location = file.location;
//     };
//
//     @MaterializeIt()
//     get url(): string {
//         return `${Catalog.fileUrl}/${this.catalog.entity.META.ident}/${this.catalog.catalogName}/${this.name}`;
//     };
//
//     img(x: number, y: number): ImageAttachment {
//         return ImageAttachment.create(this, {width: x, height: y});
//     };
// }
//
// export class ImageAttachment extends FileAttachment implements ImageInterface {
//     dimensions: ImgDimension;
//     dominant: ImgRGB;
//     isAnimated: boolean;
//     focus: ImgFocus;
//     version: number;
//     fileName: string;
//     extension: string;
//
//     static create(init: FileAttachment, dimensions: ImgDimension): ImageAttachment {
//         const instance: ImageAttachment = init as ImageAttachment;
//         const file: ImageInterface = init.file as ImageInterface;
//         instance.dominant = file.dominant;
//         instance.isAnimated = file.isAnimated;
//         instance.focus = file.focus;
//         instance.version = file.version;
//         instance.dimensions = dimensions;
//         const i: number = instance.name.lastIndexOf(".");
//         if (i === -1) throw new Error(`No extension: ${instance.name}`);
//         instance.fileName = instance.name.slice(0, i);
//         instance.extension = instance.name.slice(i + 1);
//         return instance;
//     };
//
//     @MaterializeIt()
//     get webp(): string {
//         return `${Catalog.imageUrl}/${this.catalog.entity.META.ident}/${this.catalog.catalogName}/${this.dimensions.width}.${this.dimensions.height}.${this.focus}.${this.version}.${this.extension}/${this.fileName}.webp`;
//     };
// }
