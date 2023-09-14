import jwt from "jsonwebtoken";
/** Wrapper class for encoding and decoding JSON Web Tokens. */
export declare class Jwt<T> {
    private readonly secret;
    private readonly expires?;
    private readonly algorithm;
    constructor(secret: string, expires?: string | undefined, algorithm?: jwt.Algorithm);
    decode<R = T>(token: string | undefined): R | undefined;
    encode<I = T>(payload: I, expires?: string): string;
}
