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
        const files = entity.attachments[catalogName];
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
}
exports.Catalog = Catalog;
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
        return `${Catalog.hostUrl}/files/${this.catalog.entity.ident}/${this.catalog.catalogName}/${this.name}`;
    }
    ;
    img(x, y) {
        return new ImageAttachment(this.file, this.catalog, {
            width: x,
            height: y
        });
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
    constructor(file, catalog, dimensions) {
        super(file, catalog);
        this.dominant = file.dominant;
        this.isAnimated = file.isAnimated;
        this.focus = file.focus;
        this.version = file.version;
        this.dimensions = dimensions;
        const i = this.name.lastIndexOf(".");
        if (i === -1)
            throw new Error(`No extension: ${this.name}`);
        this.fileName = this.name.slice(0, i);
        this.extension = this.name.slice(i + 1);
    }
    ;
    get webp() {
        return `${Catalog.hostUrl}/images/${this.catalog.entity.ident}/${this.catalog.catalogName}/${this.dimensions.width}.${this.dimensions.height}.${this.focus}.${this.version}.${this.extension}/${this.fileName}.webp`;
    }
    ;
}
exports.ImageAttachment = ImageAttachment;
__decorate([
    (0, materialize_it_1.MaterializeIt)(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], ImageAttachment.prototype, "webp", null);
