import {FileInterface} from "./file-interface";


export interface META {
    catalogs?: string[];
    ident: string;
    module: string;
    entityName: string;
}

export interface AtomWithAttachments {
    [key: string]: FileInterface[] | number | META;

    id: number;
    META: META;
}
