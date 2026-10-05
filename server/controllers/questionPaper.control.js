import { prisma } from "../server.js";
import { uploadPdf, deletePdf } from "../services/cloudinary.js";

const FOLDER = "studyhub/question-papers";
const PAPER_TYPES = [
  "University",
  "College",
  "Mid-Term",
  "Internal",
  "Model",
  "Practical",
  "Other",
];
const STATUSES = ["draft", "published"];
const include = { semester: true, subject: true };

const uploadMessage = (error) =>
  error?.error?.message || error?.message || "Cloudinary upload failed";

const fileFields = (uploaded) => ({
  fileUrl: uploaded.secure_url,
  filePublicId: uploaded.public_id,
  fileType: "PDF",
  pages: uploaded.pages ?? null,
});

// Validates the form fields and returns either { data } or { error }.
const readFields = async (body) => {
  const semesterId = Number(body.semesterId);
  const subjectId = Number(body.subjectId);
  const year = Number(body.year);
  const { paperType, status } = body;

  if (!Number.isInteger(semesterId) || !Number.isInteger(subjectId)) {
    return { error: "Semester and subject are required" };
  }
  if (!Number.isInteger(year) || year < 1990 || year > 2100) {
    return { error: "Year must be between 1990 and 2100" };
  }
  if (!PAPER_TYPES.includes(paperType)) {
    return { error: "Invalid paper type" };
  }
  if (!STATUSES.includes(status)) {
    return { error: "Invalid status" };
  }

  const subject = await prisma.subject.findFirst({
    where: { id: subjectId, semesterId },
    select: { id: true },
  });
  if (!subject) {
    return { error: "Subject does not belong to the selected semester" };
  }

  return { data: { year, paperType, status, semesterId, subjectId } };
};

export const getPublishedPapers = async (req, res) => {
  try {
    const papers = await prisma.pastQuestion.findMany({
      where: { status: "published" },
      include,
      omit: { filePublicId: true, uploadedBy: true },
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    });

    res.json(papers);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch question papers",
    });
  }
};

export const getAdminPapers = async (req, res) => {
  try {
    const papers = await prisma.pastQuestion.findMany({
      include,
      orderBy: { createdAt: "desc" },
    });

    res.json(papers);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch question papers",
    });
  }
};

export const getAdminPaper = async (req, res) => {
  try {
    const paper = await prisma.pastQuestion.findUnique({
      where: { id: Number(req.params.id) },
      include,
    });

    if (!paper) {
      return res.status(404).json({
        message: "Question paper not found",
      });
    }

    res.json(paper);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch question paper",
    });
  }
};

export const downloadPaper = async (req, res) => {
  try {
    const paper = await prisma.pastQuestion.findFirst({
      where: { id: Number(req.params.id), status: "published" },
      select: {
        year: true,
        paperType: true,
        fileUrl: true,
        subject: { select: { name: true } },
      },
    });

    if (!paper) {
      return res.status(404).json({
        message: "Question paper not found",
      });
    }

    const fileResponse = await fetch(paper.fileUrl);
    if (!fileResponse.ok || !fileResponse.body) {
      return res.status(502).json({
        message: "Failed to download question paper file",
      });
    }

    const filename = `${paper.subject.name}_${paper.year}_${paper.paperType}`
      .replace(/[^a-z0-9._-]+/gi, "_")
      .concat(".pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const buffer = Buffer.from(await fileResponse.arrayBuffer());
    return res.send(buffer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to download question paper",
    });
  }
};

export const createPaper = async (req, res) => {
  try {
    const { data, error } = await readFields(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    let uploaded;
    try {
      uploaded = await uploadPdf(req.file, FOLDER);
    } catch (uploadError) {
      console.error("Cloudinary question paper upload error:", uploadError);
      return res.status(502).json({ message: uploadMessage(uploadError) });
    }

    try {
      const paper = await prisma.pastQuestion.create({
        data: { ...data, ...fileFields(uploaded), uploadedBy: req.user.id },
        include,
      });

      res.status(201).json(paper);
    } catch (dbError) {
      console.error("Question paper database error:", dbError);
      await deletePdf(uploaded.public_id);
      res.status(500).json({
        message: "Failed to save question paper",
      });
    }
  } catch (error) {
    console.error("Create question paper error:", error);
    res.status(500).json({
      message: "Failed to create question paper",
    });
  }
};

export const updatePaper = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.pastQuestion.findUnique({
      where: { id },
      select: { filePublicId: true },
    });
    if (!existing) {
      return res.status(404).json({
        message: "Question paper not found",
      });
    }

    const { data, error } = await readFields(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    let uploaded = null;
    if (req.file) {
      try {
        uploaded = await uploadPdf(req.file, FOLDER);
      } catch (uploadError) {
        console.error("Cloudinary question paper upload error:", uploadError);
        return res.status(502).json({ message: uploadMessage(uploadError) });
      }
    }

    try {
      const paper = await prisma.pastQuestion.update({
        where: { id },
        data: uploaded ? { ...data, ...fileFields(uploaded) } : data,
        include,
      });

      if (uploaded) await deletePdf(existing.filePublicId);

      res.json(paper);
    } catch (dbError) {
      console.error("Question paper database error:", dbError);
      if (uploaded) await deletePdf(uploaded.public_id);
      res.status(500).json({
        message: "Failed to update question paper",
      });
    }
  } catch (error) {
    console.error("Update question paper error:", error);
    res.status(500).json({
      message: "Failed to update question paper",
    });
  }
};

export const deletePaper = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.pastQuestion.findUnique({
      where: { id },
      select: { filePublicId: true },
    });
    if (!existing) {
      return res.status(404).json({
        message: "Question paper not found",
      });
    }

    await prisma.pastQuestion.delete({ where: { id } });
    await deletePdf(existing.filePublicId);

    res.json({
      message: "Question paper deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete question paper",
    });
  }
};
