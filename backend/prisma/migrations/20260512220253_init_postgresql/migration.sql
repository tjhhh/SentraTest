-- CreateTable
CREATE TABLE "bva_test_cases" (
    "id" TEXT NOT NULL,
    "requirementText" TEXT NOT NULL,
    "testCases" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "bva_test_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_table_cases" (
    "id" TEXT NOT NULL,
    "requirementText" TEXT NOT NULL,
    "decisionTable" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "decision_table_cases_pkey" PRIMARY KEY ("id")
);
