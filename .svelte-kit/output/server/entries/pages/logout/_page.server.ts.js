import { redirect } from "@sveltejs/kit";
const actions = {
  default: async ({ cookies }) => {
    cookies.delete("session", { path: "/" });
    throw redirect(303, "/");
  }
};
export {
  actions
};
