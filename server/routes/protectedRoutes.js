import express from "express";
import authenticationMiddleware from "../middleware/auth.js";
import adminOnly from "../middleware/admin.js";
import { getAllUsers } from "../controllers/login.js";
import { disableUser } from "../controllers/login.js";
import { enableUser } from "../controllers/login.js";

const router = express.Router();

router.get(
  "/admin/dashboard",
  authenticationMiddleware,
  adminOnly,
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

router.get(
  "/admin/users",
  authenticationMiddleware,
  adminOnly,
  getAllUsers
);

router.put(
  "/admin/disable/:id",
  authenticationMiddleware,
  adminOnly,
  disableUser
);

router.put(
  "/admin/enable/:id",
  authenticationMiddleware,
  adminOnly,
  enableUser
);


export default router;