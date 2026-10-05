import express from "express";

import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/note.control.js";

import authMiddleware from "../middleware/auth.middle.js";

const router = express.Router();

router.get("/", getNotes);
router.get("/:id", getNote);

router.post("/", authMiddleware, createNote);
router.put("/:id", authMiddleware, updateNote);
router.delete("/:id", authMiddleware, deleteNote);

export default router;
