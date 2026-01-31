import { fail, redirect } from "@sveltejs/kit";
import { d as db } from "../../../chunks/db.js";
const load = async ({ locals, url }) => {
  if (!locals.user) throw redirect(302, "/login");
  const search = url.searchParams.get("q") || "";
  let query = db("items").join("users", "items.user_id", "users.id").whereNot("items.user_id", locals.user.id).andWhere("items.status", "available").select("items.*", "users.name as foodbank_name", "users.address", "users.latitude", "users.longitude");
  if (search) {
    query = query.where("items.name", "like", `%${search}%`);
  }
  const items = await query;
  return { items };
};
const actions = {
  requestItem: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const data = await request.formData();
    const item_id = data.get("item_id");
    const existing = await db("requests").where({ requester_id: locals.user.id, item_id }).first();
    if (existing) {
      return fail(400, { duplicate: true });
    }
    await db("requests").insert({
      requester_id: locals.user.id,
      item_id,
      status: "pending"
    });
    return { success: true };
  }
};
export {
  actions,
  load
};
