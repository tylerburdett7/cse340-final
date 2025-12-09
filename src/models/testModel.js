import db from "../db/index.js";

export async function getTestData() {
  const result = await db.query("SELECT NOW()");
  return result.rows;
}
