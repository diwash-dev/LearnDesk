import express from "express";

import {
  getPublishedReports,
  getAdminReports,
  getAdminReport,
  viewReport,
  downloadReport,
  createReport,
  updateReport,
  deleteReport,
} from "../controllers/labReport.control.js";

import authMiddleware, { adminOnly } from "../middleware/auth.middle.js";
import { uploadPdfFile } from "../middleware/upload.middle.js";

const router = express.Router();

router.param("id", (req, res, next, value) => {
  if (!/^\d+$/.test(value)) {
    return res.status(404).json({
      message: "Lab report not found",
    });
  }

  next();
});

router.get("/", getPublishedReports);
router.get("/admin", authMiddleware, adminOnly, getAdminReports);
router.get("/admin/:id", authMiddleware, adminOnly, getAdminReport);
router.get("/:id/view", viewReport);
router.get("/:id/download", downloadReport);

router.post("/", authMiddleware, adminOnly, uploadPdfFile, createReport);
router.put("/:id", authMiddleware, adminOnly, uploadPdfFile, updateReport);
router.delete("/:id", authMiddleware, adminOnly, deleteReport);

export default router;
