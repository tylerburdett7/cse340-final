import express from "express";
import { getHomePage } from "./homeController.js";
import {
  getBoatsPage,
  getAdminPage,
  getEditBoatPage,
  createBoat,
  updateBoatDetails,
  addImage,
  deleteImage
} from "./boatController.js";
import { requireLogin } from "../middleware/auth.js";
import {
  showLoginForm,
  processLogin,
  processLogout,
  loginValidation,
} from "./loginController.js";

const router = express.Router();

// Home
router.get("/", getHomePage);

// Boats
router.get("/boats", getBoatsPage);

// Authentication routes
router.get("/login", showLoginForm);
router.post("/login", loginValidation, processLogin);
router.get("/logout", processLogout);

// Admin routes (protected)
router.get("/admin", requireLogin, getAdminPage);
router.get("/admin/edit/:id", requireLogin, getEditBoatPage);
router.post("/admin/add-boat", requireLogin, createBoat);
router.post("/admin/update-boat/:id", requireLogin, updateBoatDetails);
router.post("/admin/add-image/:id", requireLogin, addImage);
router.post("/admin/delete-image/:imageId", requireLogin, deleteImage);

export default router;
