-- CreateTable
CREATE TABLE "BvaTestCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requirementText" TEXT NOT NULL,
    "testCases" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT
);
