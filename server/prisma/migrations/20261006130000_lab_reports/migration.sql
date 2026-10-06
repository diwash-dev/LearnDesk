-- CreateTable
CREATE TABLE "LabReport" (
    "id" SERIAL NOT NULL,
    "experimentNo" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "PaperStatus" NOT NULL DEFAULT 'draft',
    "fileUrl" TEXT NOT NULL,
    "filePublicId" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "pages" INTEGER,
    "semesterId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "uploadedBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LabReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LabReport_subjectId_experimentNo_key" ON "LabReport"("subjectId", "experimentNo");

-- AddForeignKey
ALTER TABLE "LabReport" ADD CONSTRAINT "LabReport_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LabReport" ADD CONSTRAINT "LabReport_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LabReport" ADD CONSTRAINT "LabReport_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
