import {FileInterface} from "./file-interface";


export interface AtomWithAttachments {
    id: number;
    ident: string;
    attachments: Record<string, FileInterface[]>;
}
