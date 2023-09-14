"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageAttachment = exports.FileAttachment = exports.Catalog = void 0;
const materialize_it_1 = require("./materialize-it");
const micromatch_1 = require("micromatch");
class Catalog {
    constructor(entity, catalogName) {
        this.entity = entity;
        this.catalogName = catalogName;
        this.files = [];
        if (!entity.META.catalogs?.includes(catalogName) || entity[catalogName] === undefined)
            throw new Error(`Catalog does not present in entity: ${entity.META.ident}.`);
        const files = entity[catalogName];
        for (let file of files) {
            this.files.push(new FileAttachment(file, this));
        }
    }
    ;
    get first() {
        return this.files[0];
    }
    ;
    find(namePattern) {
        return this.files.find((file) => (0, micromatch_1.isMatch)(file.name, namePattern));
    }
    ;
    download(url) {
        return fetch(url, { method: "POST" });
    }
    ;
    async upload(files) {
        if (!Array.isArray(files))
            files = [files];
        const body = new FormData();
        for (let file of files) {
            body.append(file.name, file);
        }
        body.append("module", this.entity.META.module);
        body.append("entityName", this.entity.META.entityName);
        body.append("id", this.entity.id.toString());
        body.append("catalog", this.catalogName);
        return await fetch(Catalog.uploadUrl, { body });
    }
    ;
}
exports.Catalog = Catalog;
Catalog.fileUrl = "";
Catalog.imageUrl = "";
Catalog.uploadUrl = "";
class FileAttachment {
    constructor(file, catalog) {
        this.file = file;
        this.catalog = catalog;
        this.size = file.size;
        this.name = file.name;
        this.mimeType = file.mimeType;
        this.title = file.title;
        this.location = file.location;
    }
    ;
    get url() {
        return `${Catalog.fileUrl}/${this.catalog.entity.ident}/${this.catalog.catalogName}/${this.name}`;
    }
    ;
    img(x, y) {
        return ImageAttachment.create(this, { width: x, height: y });
    }
    ;
}
exports.FileAttachment = FileAttachment;
__decorate([
    (0, materialize_it_1.MaterializeIt)(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], FileAttachment.prototype, "url", null);
class ImageAttachment extends FileAttachment {
    static create(init, dimensions) {
        const instance = init;
        const file = init.file;
        instance.dominant = file.dominant;
        instance.isAnimated = file.isAnimated;
        instance.focus = file.focus;
        instance.version = file.version;
        instance.dimensions = dimensions;
        const i = instance.name.lastIndexOf(".");
        if (i === -1)
            throw new Error(`No extension: ${instance.name}`);
        instance.fileName = instance.name.slice(0, i);
        instance.extension = instance.name.slice(i + 1);
        return instance;
    }
    ;
    get webp() {
        return `${Catalog.imageUrl}/${this.catalog.entity.ident}/${this.catalog.catalogName}/${this.dimensions.width}.${this.dimensions.height}.${this.focus}.${this.version}.${this.extension}/${this.fileName}.webp`;
    }
    ;
}
exports.ImageAttachment = ImageAttachment;
__decorate([
    (0, materialize_it_1.MaterializeIt)(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], ImageAttachment.prototype, "webp", null);
