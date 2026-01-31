import { fail, redirect } from "@sveltejs/kit";
import { d as db } from "../../../chunks/db.js";
const load = async ({ locals }) => {
  if (!locals.user) throw redirect(302, "/login");
  const items = await db("items").where({ user_id: locals.user.id });
  const incomingRequests = await db("requests").join("items", "requests.item_id", "items.id").join("users", "requests.requester_id", "users.id").where("items.user_id", locals.user.id).select("requests.id", "requests.status", "items.name as item_name", "users.name as requester_name", "users.email as requester_email");
  const outgoingRequests = await db("requests").join("items", "requests.item_id", "items.id").join("users", "items.user_id", "users.id").where("requests.requester_id", locals.user.id).select("requests.id", "requests.status", "items.name as item_name", "users.name as donor_name");
  return { items, incomingRequests, outgoingRequests };
};
const actions = {
  addItem: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const data = await request.formData();
    const name = data.get("name");
    const quantity = data.get("quantity");
    const unit = data.get("unit");
    const expiry_date = data.get("expiry_date");
    await db("items").insert({
      user_id: locals.user.id,
      name,
      quantity,
      unit,
      expiry_date: expiry_date || null,
      status: "available"
    });
  },
  deleteItem: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const data = await request.formData();
    const id = data.get("id");
    await db("items").where({ id, user_id: locals.user.id }).delete();
  },
  updateRequestStatus: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const data = await request.formData();
    const requestId = data.get("request_id");
    const newStatus = data.get("status");
    const req = await db("requests").join("items", "requests.item_id", "items.id").where("requests.id", requestId).andWhere("items.user_id", locals.user.id).first();
    if (req) {
      await db("requests").where({ id: requestId }).update({ status: newStatus });
      if (newStatus === "accepted") {
        await db("items").where({ id: req.item_id }).update({ status: "reserved" });
      }
    }
  }
};
export {
  actions,
  load
};
