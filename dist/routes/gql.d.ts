import type { RequestEvent, RequestHandler } from "@sveltejs/kit";
export declare function gqlRoute(gqlUrl: string, api_key: string, createToken: (event: RequestEvent) => string | undefined): RequestHandler;
