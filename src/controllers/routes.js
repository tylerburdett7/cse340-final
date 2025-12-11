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
import {
  showServiceRequestForm,
  submitServiceRequest,
  getMyServiceRequests,
  getAllRequests,
  getServiceRequestDetail,
  updateRequest,
  serviceRequestValidation,
} from "./serviceRequestController.js";
import { requireLogin, requireRole } from "../middleware/auth.js";
import {
  showLoginForm,
  showRegisterForm,
  processLogin,
  processRegister,
  processLogout,
  loginValidation,
  registerValidation,
} from "./loginController.js";

const router = express.Router();

// Home
router.get("/", getHomePage);

// Boats
router.get("/boats", getBoatsPage);

// Authentication routes
router.get("/login", showLoginForm);
router.post("/login", loginValidation, processLogin);
router.get("/register", showRegisterForm);
router.post("/register", registerValidation, processRegister);
router.get("/logout", processLogout);

// Service request routes (customer only)
router.get("/service-request", requireLogin, requireRole(['customer']), showServiceRequestForm);
router.post("/service-request", requireLogin, requireRole(['customer']), serviceRequestValidation, submitServiceRequest);
router.get("/my-requests", requireLogin, requireRole(['customer']), getMyServiceRequests);

// Admin routes (admin, sales_rep, service_manager only)
router.get("/admin", requireLogin, requireRole(['admin', 'sales_rep', 'service_manager']), getAdminPage);

// Sales rep routes (add/edit boats)
router.get("/admin/edit/:id", requireLogin, requireRole(['admin', 'sales_rep']), getEditBoatPage);
router.post("/admin/add-boat", requireLogin, requireRole(['admin', 'sales_rep']), createBoat);
router.post("/admin/update-boat/:id", requireLogin, requireRole(['admin', 'sales_rep']), updateBoatDetails);
router.post("/admin/add-image/:id", requireLogin, requireRole(['admin', 'sales_rep']), addImage);
router.post("/admin/delete-image/:imageId", requireLogin, requireRole(['admin', 'sales_rep']), deleteImage);

// Service manager routes (view and manage service requests)
router.get("/admin/service-requests", requireLogin, requireRole(['admin', 'service_manager']), getAllRequests);
router.get("/admin/service-request/:id", requireLogin, requireRole(['admin', 'service_manager']), getServiceRequestDetail);
router.post("/admin/service-request/:id", requireLogin, requireRole(['admin', 'service_manager']), updateRequest);

export default router;
