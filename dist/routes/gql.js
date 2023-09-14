"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gql = void 0;
function gql(gqlUrl, api_key, createToken) {
    return async function (event) {
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
exports.gql = gql;
