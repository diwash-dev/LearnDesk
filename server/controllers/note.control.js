import { prisma } from "../server.js";

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

export const createNote = async (req, res) => {
  try {
    const { title, description, fileUrl, fileType, semesterId, subjectId } =
      req.body;

    if (!title || !fileUrl || !fileType || !semesterId || !subjectId) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const note = await prisma.note.create({
      data: {
        title,
        description,
        fileUrl,
        fileType,
        semesterId: Number(semesterId),
        subjectId: Number(subjectId),
        uploadedBy: req.user.id,
      },
    });

    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create note",
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { title, description, fileUrl, fileType, semesterId, subjectId } =
      req.body;

    const note = await prisma.note.update({
      where: { id },
      data: {
        title,
        description,
        fileUrl,
        fileType,
        semesterId: Number(semesterId),
        subjectId: Number(subjectId),
      },
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
