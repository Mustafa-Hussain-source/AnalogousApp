import express from "express";
import cors from "cors";
import protectedRoutes from "./routes/protectedRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import logRoutes from "./routes/logRoutes.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/logs", logRoutes);