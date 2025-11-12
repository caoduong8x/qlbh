// src/routes/customers.js
import express from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// Có thể bật verifyToken nếu yêu cầu đăng nhập mới được dùng CRUD
router.get("/", verifyToken, getCustomers);
router.get("/:id", verifyToken, getCustomerById);
router.post("/", verifyToken, createCustomer);
router.put("/:id", verifyToken, updateCustomer);
router.delete("/:id", verifyToken, deleteCustomer);

export default router;
