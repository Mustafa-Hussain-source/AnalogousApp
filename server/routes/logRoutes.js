import express from "express";
import LoginLog from "../models/loginLog.js";

const router = express.Router();

router.get("/recent", async (req, res) => {
  try {
    const logs = await LoginLog.find()
      .sort({ timestamp: -1 })
      .limit(10);

    res.json(logs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;