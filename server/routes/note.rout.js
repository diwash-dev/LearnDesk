import express from "express";

import {
  getNotes,
  getNote,
  downloadNote,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/note.control.js";

import authMiddleware from "../middleware/auth.middle.js";
import { uploadPdfFile } from "../middleware/upload.middle.js";

const router = express.Router();

router.get("/", getNotes);
router.get("/:id/download", downloadNote);
router.get("/:id", getNote);

router.post("/", authMiddleware, uploadPdfFile, createNote);
router.put("/:id", authMiddleware, uploadPdfFile, updateNote);
router.delete("/:id", authMiddleware, deleteNote);

export default router;
