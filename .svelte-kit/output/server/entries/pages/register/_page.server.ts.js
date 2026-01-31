import { fail, redirect } from "@sveltejs/kit";
import { d as db } from "../../../chunks/db.js";
import { h as hashPassword } from "../../../chunks/auth.js";
const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");
    const name = data.get("name");
    const address = data.get("address");
    const contact_info = data.get("contact_info");
    if (!email || !password || !name) {
      return fail(400, { missing: true });
    }
    const existing = await db("users").where({ email }).first();
    if (existing) {
      return fail(400, { emailExists: true });
    }
    const password_hash = await hashPassword(password);
    const [id] = await db("users").insert({
      email,
      password_hash,
      name,
      address,
      contact_info,
      latitude: 0,
      longitude: 0
    });
    cookies.set("session", id.toString(), { path: "/" });
    throw redirect(303, "/dashboard");
  }
};
export {
  actions
};
