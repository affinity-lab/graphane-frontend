import {FileInterface} from "../file-interface";
import {MaterializeIt} from "../../util/materialize-it";
import {Catalog} from "./catalog";
import {ImageInterface, ImgDimension, ImgFocus, ImgRGB} from "../image-interface";


export class FileAttachment implements FileInterface {
	size: number;
	name: string;
	mimeType: string;
	title: string;
	location: string;

	constructor(public readonly file: FileInterface, public readonly catalog: Catalog) {
		this.size = file.size;
		this.name = file.name;
		this.mimeType = file.mimeType;
		this.title = file.title;
		this.location = file.location;
	};

	@MaterializeIt()
	get url(): string { return `${Catalog.fileUrl}/${this.catalog.entity.META.ident}/${this.catalog.catalogName}/${this.name}`;};

	@MaterializeIt()
	get img(): Img | undefined {
		try {
			return new Img(this);
		} catch (e) {
			return undefined;
		}
	}
}


export class Img {
	constructor(private file: FileAttachment) {
		if (!file.mimeType.startsWith("image/")) {
			throw new Error(`Image must be an image ${file.file.name}`);
		}
	}

	private get img(): ImageInterface {return this.file.file as ImageInterface;}
	get isAnimated(): boolean {return this.img.isAnimated;}
	get dominant(): ImgRGB {return this.img.dominant;}
	get dimensions(): ImgDimension {return this.img.dimensions;}
	get version(): number {return this.img.version;}
	get focus(): ImgFocus { return this.img.focus;}
	set focus(focus: ImgFocus) { this.img.focus = focus;}

	public webp(width: number, height: number, focus?: ImgFocus): string | undefined {
		if (focus === undefined) focus = this.focus;
		const extensionMatch = this.file.name.match(/([^.]+)$/gm);
		const extension = extensionMatch === null ? undefined : extensionMatch[0];
		const basenameMatch = this.file.name.match(/.*(?=\.[^.]*$)/gm);
		const basename = basenameMatch === null ? undefined : basenameMatch[0];
		if (basename === undefined || extension === undefined) return undefined;
		return `${Catalog.imageUrl}/${this.file.catalog.entity.META.ident}/${this.file.catalog.catalogName}/${width}.${height}.${focus}.${this.version}.${extension}/${basename}.webp`;
	};
}
