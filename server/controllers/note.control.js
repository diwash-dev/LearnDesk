import { prisma } from "../server.js";
import { uploadPdf } from "../services/cloudinary.js";

export const getNotes = async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      include: {
        semester: true,
        subject: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch notes",
    });
  }
};

export const getNote = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        semester: true,
        subject: true,
      },
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch note",
    });
  }
};

export const downloadNote = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const note = await prisma.note.findUnique({
      where: { id },
      select: { title: true, fileUrl: true },
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    const fileResponse = await fetch(note.fileUrl);
    if (!fileResponse.ok || !fileResponse.body) {
      return res.status(502).json({
        message: "Failed to download note file",
      });
    }

    const filename = `${note.title.replace(/[^a-z0-9._-]+/gi, "_")}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const buffer = Buffer.from(await fileResponse.arrayBuffer());
    return res.send(buffer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to download note",
    });
  }
};

export const createNote = async (req, res) => {
  try {
    const { title, description, semesterId, subjectId } = req.body;

    if (!title || !semesterId || !subjectId || !req.file) {
      return res.status(400).json({
        message: "Title, PDF file, semester and subject are required",
      });
    }

    let uploaded;
    try {
      uploaded = await uploadPdf(req.file);
    } catch (error) {
      console.error("Cloudinary note upload error:", error);
      return res.status(502).json({
        message:
          error?.error?.message || error?.message || "Cloudinary upload failed",
      });
    }

    try {
      const note = await prisma.note.create({
        data: {
          title,
          description,
          fileUrl: uploaded.secure_url,
          fileType: "PDF",
          semesterId: Number(semesterId),
          subjectId: Number(subjectId),
          uploadedBy: req.user.id,
        },
      });

      res.status(201).json(note);
    } catch (error) {
      console.error("Note database error:", error);
      res.status(500).json({
        message: "Note uploaded, but saving note details failed",
      });
    }
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({
      message: "Failed to create note",
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { title, description, semesterId, subjectId } = req.body;

    const data = {
      title,
      description,
      semesterId: Number(semesterId),
      subjectId: Number(subjectId),
      updatedAt: new Date(),
    };

    if (req.file) {
      const uploaded = await uploadPdf(req.file);
      data.fileUrl = uploaded.secure_url;
      data.fileType = "PDF";
    }

    const note = await prisma.note.update({
      where: { id },
      data,
    });

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update note",
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.note.delete({
      where: { id },
    });

    res.json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete note",
    });
  }
};
