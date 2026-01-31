import bcrypt from "bcryptjs";
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
export {
  hashPassword as h,
  verifyPassword as v
};
