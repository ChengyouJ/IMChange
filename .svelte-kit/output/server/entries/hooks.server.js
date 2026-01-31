import "@sveltejs/kit";
import { d as db } from "../chunks/db.js";
const handle = async ({ event, resolve }) => {
  const session = event.cookies.get("session");
  if (session) {
    const user = await db("users").where({ id: session }).first();
    if (user) {
      const { password_hash, ...safeUser } = user;
      event.locals.user = safeUser;
    }
  }
  return await resolve(event);
};
export {
  handle
};
