import { c as create_ssr_component } from "../../../chunks/ssr.js";
const css = {
  code: ".error.svelte-1ey7bel{color:var(--danger);background:#fee2e2;padding:0.5rem;border-radius:0.25rem}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script>\\n    export let form;\\n<\/script>\\n\\n<div style=\\"max-width: 400px; margin: 0 auto;\\">\\n    <h1>Log In</h1>\\n\\n    <form method=\\"POST\\">\\n        <label>\\n            Email\\n            <input name=\\"email\\" type=\\"email\\" required />\\n        </label>\\n\\n        <label>\\n            Password\\n            <input name=\\"password\\" type=\\"password\\" required />\\n        </label>\\n\\n        {#if form?.missing}\\n            <p class=\\"error\\">Please fill in all fields.</p>\\n        {/if}\\n        {#if form?.invalid}\\n            <p class=\\"error\\">Invalid email or password.</p>\\n        {/if}\\n\\n        <button type=\\"submit\\" style=\\"width: 100%\\">Log In</button>\\n    </form>\\n\\n    <p style=\\"text-align: center; margin-top: 1rem;\\">\\n        New here? <a href=\\"/register\\">Register your Food Bank</a>\\n    </p>\\n</div>\\n\\n<style>\\n    .error {\\n        color: var(--danger);\\n        background: #fee2e2;\\n        padding: 0.5rem;\\n        border-radius: 0.25rem;\\n    }\\n</style>\\n"],"names":[],"mappings":"AAkCI,qBAAO,CACH,KAAK,CAAE,IAAI,QAAQ,CAAC,CACpB,UAAU,CAAE,OAAO,CACnB,OAAO,CAAE,MAAM,CACf,aAAa,CAAE,OACnB"}'
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { form } = $$props;
  if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
  $$result.css.add(css);
  return `<div style="max-width: 400px; margin: 0 auto;"><h1 data-svelte-h="svelte-1o01xsh">Log In</h1> <form method="POST"><label data-svelte-h="svelte-bnudib">Email
            <input name="email" type="email" required></label> <label data-svelte-h="svelte-i84ria">Password
            <input name="password" type="password" required></label> ${form?.missing ? `<p class="error svelte-1ey7bel" data-svelte-h="svelte-16vnxl3">Please fill in all fields.</p>` : ``} ${form?.invalid ? `<p class="error svelte-1ey7bel" data-svelte-h="svelte-995vfo">Invalid email or password.</p>` : ``} <button type="submit" style="width: 100%" data-svelte-h="svelte-1x67i2i">Log In</button></form> <p style="text-align: center; margin-top: 1rem;" data-svelte-h="svelte-7d1ocl">New here? <a href="/register">Register your Food Bank</a></p> </div>`;
});
export {
  Page as default
};
