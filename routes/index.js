import express from "express";
import { getTestData } from "../models/testModel.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await getTestData();
    res.render("home", { data });
  } catch (err) {
    next(err);
  }
});

export default router;
