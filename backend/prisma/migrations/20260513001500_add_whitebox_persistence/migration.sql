-- AlterTable
ALTER TABLE "TestCase" ADD COLUMN     "generatedScript" TEXT,
ADD COLUMN     "logicCode" TEXT,
ADD COLUMN     "uiCode" TEXT;

-- CreateTable
CREATE TABLE "Execution" (
    "id" TEXT NOT NULL,
    "testCaseId" TEXT NOT NULL,
    "stats" JSONB NOT NULL,
    "results" JSONB NOT NULL,
    "screenshots" JSONB NOT NULL,
    "exitCode" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Execution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Execution_testCaseId_idx" ON "Execution"("testCaseId");

-- AddForeignKey
ALTER TABLE "Execution" ADD CONSTRAINT "Execution_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
