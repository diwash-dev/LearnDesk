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
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== "application/pdf") {
      return callback(new Error("Only PDF files are allowed"));
    }
    callback(null, true);
  },
});

const router = express.Router();

router.get("/", getNotes);
router.get("/:id/download", downloadNote);
router.get("/:id", getNote);

router.post("/", authMiddleware, upload.single("file"), createNote);
router.put("/:id", authMiddleware, upload.single("file"), updateNote);
router.delete("/:id", authMiddleware, deleteNote);

export default router;
