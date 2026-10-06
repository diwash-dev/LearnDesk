import express from "express";
import cors from "cors";
import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.ts";
import authRoutes from "./routes/auth.rout.js";
import noteRoutes from "./routes/note.rout.js";
import questionPaperRoutes from "./routes/questionPaper.rout.js";
import catalogRoutes from "./routes/catalog.rout.js";
import labReportRoutes from "./routes/labReport.rout.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/question-papers", questionPaperRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/lab-reports", labReportRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected ");

   app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server started Successfully`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

startServer();