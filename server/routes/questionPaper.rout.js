import express from "express";

import {
  getPublishedPapers,
  getAdminPapers,
  getAdminPaper,
  downloadPaper,
  createPaper,
  updatePaper,
  deletePaper,
} from "../controllers/questionPaper.control.js";

import authMiddleware, { adminOnly } from "../middleware/auth.middle.js";
import { uploadPdfFile } from "../middleware/upload.middle.js";

const router = express.Router();

router.param("id", (req, res, next, value) => {
  if (!/^\d+$/.test(value)) {
    return res.status(404).json({
      message: "Question paper not found",
    });
  }

  next();
});

router.get("/", getPublishedPapers);
router.get("/admin", authMiddleware, adminOnly, getAdminPapers);
router.get("/admin/:id", authMiddleware, adminOnly, getAdminPaper);
router.get("/:id/download", downloadPaper);

router.post("/", authMiddleware, adminOnly, uploadPdfFile, createPaper);
router.put("/:id", authMiddleware, adminOnly, uploadPdfFile, updatePaper);
router.delete("/:id", authMiddleware, adminOnly, deletePaper);

export default router;
