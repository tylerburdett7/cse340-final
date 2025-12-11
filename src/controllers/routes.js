import express from "express";
import {
  createBoat,
  updateBoatDetails,
  addImage,
  deleteImage
} from "./boatController.js";
import { getBoatInventory, getBoatById } from "../models/boatModel.js";
import {
  submitServiceRequest,
  getMyServiceRequests,
  getAllRequests,
  getServiceRequestDetail,
  updateRequest,
  serviceRequestValidation,
} from "./serviceRequestController.js";
import { requireLogin, requireRole } from "../middleware/auth.js";
import {
  processLogin,
  processRegister,
  processLogout,
  loginValidation,
  registerValidation,
} from "./loginController.js";

const router = express.Router();

// Home
router.get("/", async (req, res, next) => {
  try {
    res.render("pages/home");
  } catch (err) {
    next(err);
  }
});

// Boats
router.get("/boats", async (req, res, next) => {
  try {
    const boats = await getBoatInventory();
    res.render("pages/boats", { boats });
  } catch (err) {
    next(err);
  }
});

// Authentication routes
router.get("/login", (req, res) => res.render('auth/login'));
router.post("/login", loginValidation, processLogin);
router.get("/register", (req, res) => res.render('auth/register'));
router.post("/register", registerValidation, processRegister);
router.get("/logout", processLogout);

// Service request routes (customer only)
router.get("/service-request", requireLogin, requireRole(['customer']), (req, res) => res.render('pages/service-request'));
router.post("/service-request", requireLogin, requireRole(['customer']), serviceRequestValidation, submitServiceRequest);
router.get("/my-requests", requireLogin, requireRole(['customer']), getMyServiceRequests);

// Admin routes (admin, sales_rep, service_manager only)
router.get("/admin", requireLogin, requireRole(['admin', 'sales_rep', 'service_manager']), async (req, res, next) => {
  try {
    const boats = await getBoatInventory();
    res.render("pages/add-listing", { boats });
  } catch (err) {
    next(err);
  }
});
router.get("/add-listing", requireLogin, requireRole(['admin', 'sales_rep']), async (req, res, next) => {
  try {
    const boats = await getBoatInventory();
    res.render("pages/add-listing", { boats });
  } catch (err) {
    next(err);
  }
});

// Sales rep routes (add/edit boats)
router.get("/admin/edit/:id", requireLogin, requireRole(['admin', 'sales_rep']), async (req, res, next) => {
  try {
    const boat = await getBoatById(req.params.id);
    if (!boat) {
      return res.status(404).render("pages/error", {
        message: "Boat not found",
        error: {}
      });
    }
    res.render("pages/edit-boat", { boat });
  } catch (err) {
    next(err);
  }
});
router.post("/admin/add-boat", requireLogin, requireRole(['admin', 'sales_rep']), createBoat);
router.post("/admin/update-boat/:id", requireLogin, requireRole(['admin', 'sales_rep']), updateBoatDetails);
router.post("/admin/add-image/:id", requireLogin, requireRole(['admin', 'sales_rep']), addImage);
router.post("/admin/delete-image/:imageId", requireLogin, requireRole(['admin', 'sales_rep']), deleteImage);

// Service manager routes (view and manage service requests)
router.get("/admin/service-requests", requireLogin, requireRole(['admin', 'service_manager']), getAllRequests);
router.get("/admin/service-request/:id", requireLogin, requireRole(['admin', 'service_manager']), getServiceRequestDetail);
router.post("/admin/service-request/:id", requireLogin, requireRole(['admin', 'service_manager']), updateRequest);

export default router;
