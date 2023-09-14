import type { RequestEvent, RequestHandler } from "@sveltejs/kit";
export declare function gql(gqlUrl: string, api_key: string, createToken: (event: RequestEvent) => string | undefined): RequestHandler;
