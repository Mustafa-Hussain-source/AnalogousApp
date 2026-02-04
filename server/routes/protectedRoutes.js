import express from "express";
import authenticationMiddleware from "../middleware/auth.js";

const router = express.Router();

// router.get("/protected", authenticationMiddleware, (req, res) => 
// {
//     res.json({ message: "This is a protected route", user: req.user });
// });

export default router;