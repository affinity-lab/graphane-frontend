"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
function upload(uploadUrl, api_key, createToken) {
    return async function (event) {
        const body = await event.request.formData();
        const data = Object.fromEntries(body);
        const module = data.module;
        const entityName = data.entityName;
        const id = data.id;
        const catalog = data.catalog;
        if (typeof module !== "string" || typeof entityName !== "string" || typeof id !== "string" || typeof catalog !== "string")
            throw new Error("Bad upload input.");
        const uploadToken = (await fetch(uploadUrl, {
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
        }).then((res) => res.json())).data;
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
exports.upload = upload;
