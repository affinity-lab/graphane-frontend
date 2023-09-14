import type {RequestEvent, RequestHandler} from "@sveltejs/kit";


export function gql(
    gqlUrl: string,
    api_key: string,
    createToken: (event: RequestEvent) => string | undefined
): RequestHandler {
    return async function (event: RequestEvent): Promise<Response> {
        return await fetch(gqlUrl, {
            body: await event.request.text(),
            headers: {
                "Content-Type": "application/json",
                "authorization": createToken(event) ?? "",
                "api-key": api_key
            },
            method: "POST"
        });
    };
}
