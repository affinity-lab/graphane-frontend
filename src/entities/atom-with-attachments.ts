import type {FileInterface} from "./file-interface";
import type {ImageInterface} from "./image-interface";


export interface META {
    catalogs?: string[];
    ident: string;
    module: string;
    entityName: string;
}

export interface AtomWithAttachments {
    [key: string]: FileInterface[] | ImageInterface[] | number | META;

    id: number;
    META: META;
}
