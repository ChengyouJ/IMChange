import * as server from '../entries/pages/dashboard/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.Ch9H5Ehe.js","_app/immutable/chunks/Di6WzWfE.js","_app/immutable/chunks/BDlKai1v.js","_app/immutable/chunks/DCVhqhQ7.js","_app/immutable/chunks/jM1E5PI8.js"];
export const stylesheets = ["_app/immutable/assets/3.BORSJbGP.css"];
export const fonts = [];
