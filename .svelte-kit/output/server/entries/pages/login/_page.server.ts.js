import { fail, redirect } from "@sveltejs/kit";
import { d as db } from "../../../chunks/db.js";
import { v as verifyPassword } from "../../../chunks/auth.js";
const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");
    if (!email || !password) {
      return fail(400, { missing: true });
    }
    const user = await db("users").where({ email }).first();
    if (!user || !await verifyPassword(password, user.password_hash)) {
      return fail(400, { invalid: true });
    }
    cookies.set("session", user.id.toString(), { path: "/" });
    throw redirect(303, "/dashboard");
  }
};
export {
  actions
};
