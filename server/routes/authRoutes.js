import express from "express";
import authenticationMiddleware from "../middleware/auth.js";
import {
  register,
  login,
  changePassword,
  deleteAccount
} from "../controllers/login.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get(
  "/protected",
  authenticationMiddleware,
  (req, res) => {
    res.json({
      message: "This is a protected route",
      user: req.user
    });
  }
);

router.put(
  "/change-password",
  authenticationMiddleware,
  changePassword
);

router.delete(
  "/delete-account",
  authenticationMiddleware,
  deleteAccount
);

export default router;
