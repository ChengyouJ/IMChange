

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.JCCWn0vz.js","_app/immutable/chunks/Di6WzWfE.js","_app/immutable/chunks/BDlKai1v.js"];
export const stylesheets = ["_app/immutable/assets/2.DpxJCUac.css"];
export const fonts = [];
