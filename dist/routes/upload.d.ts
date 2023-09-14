import type { RequestEvent, RequestHandler } from "@sveltejs/kit";
export declare function uploadRoute(uploadUrl: string, api_key: string, createToken: (event: RequestEvent) => string | undefined): RequestHandler;
