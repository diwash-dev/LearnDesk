import { prisma } from "../server.js";
import { uploadPdf, deletePdf } from "../services/cloudinary.js";

const FOLDER = "studyhub/lab-reports";
const STATUSES = ["draft", "published"];
const DUPLICATE_MESSAGE =
  "A lab report with this experiment number already exists for this subject";
const include = { semester: true, subject: true };

const uploadMessage = (error) =>
  error?.error?.message || error?.message || "Cloudinary upload failed";

const fileFields = (uploaded) => ({
  fileUrl: uploaded.secure_url,
  filePublicId: uploaded.public_id,
  fileType: "PDF",
  pages: uploaded.pages ?? null,
});

const text = (value) => (typeof value === "string" ? value.trim() : "");

// Validates the form fields and returns either { data } or { error }.
const readFields = async (body) => {
  const semesterId = Number(body.semesterId);
  const subjectId = Number(body.subjectId);
  const experimentNo = text(body.experimentNo);
  const title = text(body.title);
  const description = text(body.description) || null;
  const { status } = body;

  if (!Number.isInteger(semesterId) || !Number.isInteger(subjectId)) {
    return { error: "Semester and subject are required" };
  }
  if (!experimentNo || experimentNo.length > 30) {
    return { error: "Lab / experiment number is required (30 characters max)" };
  }
  if (!title || title.length > 150) {
    return { error: "Title is required (150 characters max)" };
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

  return {
    data: { experimentNo, title, description, status, semesterId, subjectId },
  };
};

export const getPublishedReports = async (req, res) => {
  try {
    const reports = await prisma.labReport.findMany({
      where: { status: "published" },
      select: {
        id: true,
        experimentNo: true,
        title: true,
        description: true,
        status: true,
        fileUrl: true,
        fileType: true,
        pages: true,
        semesterId: true,
        subjectId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch lab reports",
    });
  }
};

export const getAdminReports = async (req, res) => {
  try {
    const reports = await prisma.labReport.findMany({
      include,
      orderBy: { createdAt: "desc" },
    });

    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch lab reports",
    });
  }
};

export const getAdminReport = async (req, res) => {
  try {
    const report = await prisma.labReport.findUnique({
      where: { id: Number(req.params.id) },
      include,
    });

    if (!report) {
      return res.status(404).json({
        message: "Lab report not found",
      });
    }

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch lab report",
    });
  }
};

export const viewReport = async (req, res) => {
  try {
    const report = await prisma.labReport.findFirst({
      where: { id: Number(req.params.id), status: "published" },
      select: { fileUrl: true },
    });

    if (!report) {
      return res.status(404).json({
        message: "Lab report not found",
      });
    }

    return res.redirect(report.fileUrl);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to view lab report",
    });
  }
};

export const downloadReport = async (req, res) => {
  try {
    const report = await prisma.labReport.findFirst({
      where: { id: Number(req.params.id), status: "published" },
      select: {
        experimentNo: true,
        title: true,
        fileUrl: true,
        subject: { select: { name: true } },
      },
    });

    if (!report) {
      return res.status(404).json({
        message: "Lab report not found",
      });
    }

    const fileResponse = await fetch(report.fileUrl);
    if (!fileResponse.ok || !fileResponse.body) {
      return res.status(502).json({
        message: "Failed to download lab report file",
      });
    }

    const filename =
      `${report.subject.name}_${report.experimentNo}_${report.title}`
        .replace(/[^a-z0-9._-]+/gi, "_")
        .concat(".pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const buffer = Buffer.from(await fileResponse.arrayBuffer());
    return res.send(buffer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to download lab report",
    });
  }
};

export const createReport = async (req, res) => {
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
      console.error("Cloudinary lab report upload error:", uploadError);
      return res.status(502).json({ message: uploadMessage(uploadError) });
    }

    try {
      const report = await prisma.labReport.create({
        data: { ...data, ...fileFields(uploaded), uploadedBy: req.user.id },
        include,
      });

      res.status(201).json(report);
    } catch (dbError) {
      await deletePdf(uploaded.public_id);
      if (dbError.code === "P2002") {
        return res.status(409).json({ message: DUPLICATE_MESSAGE });
      }
      console.error("Lab report database error:", dbError);
      res.status(500).json({
        message: "Failed to save lab report",
      });
    }
  } catch (error) {
    console.error("Create lab report error:", error);
    res.status(500).json({
      message: "Failed to create lab report",
    });
  }
};

export const updateReport = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.labReport.findUnique({
      where: { id },
      select: { filePublicId: true },
    });
    if (!existing) {
      return res.status(404).json({
        message: "Lab report not found",
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
        console.error("Cloudinary lab report upload error:", uploadError);
        return res.status(502).json({ message: uploadMessage(uploadError) });
      }
    }

    try {
      const report = await prisma.labReport.update({
        where: { id },
        data: uploaded ? { ...data, ...fileFields(uploaded) } : data,
        include,
      });

      if (uploaded) await deletePdf(existing.filePublicId);

      res.json(report);
    } catch (dbError) {
      if (uploaded) await deletePdf(uploaded.public_id);
      if (dbError.code === "P2002") {
        return res.status(409).json({ message: DUPLICATE_MESSAGE });
      }
      console.error("Lab report database error:", dbError);
      res.status(500).json({
        message: "Failed to update lab report",
      });
    }
  } catch (error) {
    console.error("Update lab report error:", error);
    res.status(500).json({
      message: "Failed to update lab report",
    });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.labReport.findUnique({
      where: { id },
      select: { filePublicId: true },
    });
    if (!existing) {
      return res.status(404).json({
        message: "Lab report not found",
      });
    }

    await prisma.labReport.delete({ where: { id } });
    await deletePdf(existing.filePublicId);

    res.json({
      message: "Lab report deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete lab report",
    });
  }
};
