import type {RequestEvent, RequestHandler} from "@sveltejs/kit";


export function uploadRoute(
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
        if (typeof module !== "string" || typeof entityName !== "string" || typeof id !== "string" || typeof catalog !== "string") throw new Error("Bad upload input.");
        const uploadToken: {token: string} = (await fetch(uploadUrl, {
                body: JSON.stringify({
                    "query": `mutation ${module}_modifyFiles${entityName}($variables: FileInputVariables!, $id: Float!, $command: String!, $catalog: String!) {
                    token: ${module}_modifyFile${entityName}(variables: $variables, id: $id, command: $command, catalog: $catalog)}`,
                    "variables": {
                        "variables": {},
                        "id": id,
                        "command": "upload",
                        "catalog": catalog
                    }
                }),
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        ).then((res: Response) => res.json())).data;
        return await event.fetch(uploadUrl, {
            headers: {
                "authorization": createToken(event) ?? "",
                "api-key": api_key,
                "file-token": uploadToken.token
            },
            body,
            method: "POST"
        });
    };
}
