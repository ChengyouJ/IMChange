import * as server from '../entries/pages/login/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/login/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/login/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.Djen6sAl.js","_app/immutable/chunks/Di6WzWfE.js","_app/immutable/chunks/BDlKai1v.js"];
export const stylesheets = ["_app/immutable/assets/4.BKIxzMXB.css"];
export const fonts = [];
