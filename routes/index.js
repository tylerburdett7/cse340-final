import express from "express";
import { getHomePage } from "../controllers/homeController.js";
import {
  getBoatsPage,
  getAdminPage,
  getEditBoatPage,
  createBoat,
  updateBoatDetails,
  addImage,
  deleteImage
} from "../controllers/boatController.js";

const router = express.Router();

router.get("/", getHomePage);

router.get("/boats", getBoatsPage);

router.get("/admin", getAdminPage);
router.get("/admin/edit/:id", getEditBoatPage);
router.post("/admin/add-boat", createBoat);
router.post("/admin/update-boat/:id", updateBoatDetails);
router.post("/admin/add-image/:id", addImage);
router.post("/admin/delete-image/:imageId", deleteImage);

export default router;
