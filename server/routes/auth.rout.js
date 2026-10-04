import express from "express";
import { adminLogin } from "../controllers/auth.control.js";

const router = express.Router();

router.post("/admin/login", adminLogin);

export default router;
