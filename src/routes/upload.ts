import type {RequestEvent, RequestHandler} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";


export function uploadRoute(
    gqlUrl: string,
    uploadUrl: string,
    api_key: string,
    createToken: (event: RequestEvent) => string | undefined
): RequestHandler {
    return async function (event: RequestEvent): Promise<Response> {
        const body: FormData = await event.request.formData();
        const data = Object.fromEntries(body);
        const module: File | string | undefined = data.module;
        const entityName: File | string | undefined = data.entityName;
        const id: File | string | undefined = data.id;
        const catalog: File | string | undefined = data.catalog;
        const header = {
            "authorization": createToken(event) ?? "",
            "api-key": api_key
        };
        if (typeof module !== "string" || typeof entityName !== "string" || typeof id !== "string" || typeof catalog !== "string") throw new Error("Bad upload input.");
        const res: {data?: {token?: string | null}} = await fetch(gqlUrl, {
                body: JSON.stringify({
                    "query": `mutation ${module}_modifyFiles${entityName}($variables: FileInputVariables!, $id: Float!, $command: String!, $catalog: String!) {
                    token: ${module}_modifyFile${entityName}(variables: $variables, id: $id, command: $command, catalog: $catalog)}`,
                    "variables": {
                        "variables": {},
                        "id": parseInt(id),
                        "command": "upload",
                        "catalog": catalog
                    }
                }),
                method: "POST",
                headers: {
                    ...header,
                    "Content-Type": "application/json"
                }
            }
        ).then((res: Response) => res.json());
        if (!res.data?.token) throw error(500, "Can't get upload token");
        return await event.fetch(uploadUrl, {
            headers: {
                ...header,
                "file-token": res.data.token
            },
            body,
            method: "POST"
        });
    };
}
