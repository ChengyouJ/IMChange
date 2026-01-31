import * as server from '../entries/pages/register/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/register/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/register/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.BMsN5l8n.js","_app/immutable/chunks/Di6WzWfE.js","_app/immutable/chunks/BDlKai1v.js"];
export const stylesheets = ["_app/immutable/assets/4.BKIxzMXB.css"];
export const fonts = [];
