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

// Accepts one PDF in the "file" field and answers upload problems as JSON.
export const uploadPdfFile = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? "PDF must be 10 MB or smaller"
            : error.message,
      });
    }

    if (req.file && req.file.buffer.subarray(0, 5).toString() !== "%PDF-") {
      return res.status(400).json({
        message: "The uploaded file is not a valid PDF",
      });
    }

    next();
  });
};
