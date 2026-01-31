import * as server from '../entries/pages/search/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/search/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/search/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.9PVVCUOg.js","_app/immutable/chunks/Di6WzWfE.js","_app/immutable/chunks/BDlKai1v.js","_app/immutable/chunks/DCVhqhQ7.js","_app/immutable/chunks/jM1E5PI8.js"];
export const stylesheets = ["_app/immutable/assets/7.CXtal5OC.css"];
export const fonts = [];
