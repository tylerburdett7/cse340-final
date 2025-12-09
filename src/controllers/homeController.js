import { getTestData } from "../models/testModel.js";

export async function getHomePage(req, res, next) {
  try {
    const data = await getTestData();
    res.render("pages/home", { data });
  } catch (err) {
    next(err);
  }
}
