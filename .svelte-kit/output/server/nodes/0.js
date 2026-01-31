import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.BlGrotCT.js","_app/immutable/chunks/Di6WzWfE.js","_app/immutable/chunks/BDlKai1v.js","_app/immutable/chunks/T437Z5ww.js","_app/immutable/chunks/jM1E5PI8.js"];
export const stylesheets = ["_app/immutable/assets/0.DuWmnW2L.css"];
export const fonts = [];
