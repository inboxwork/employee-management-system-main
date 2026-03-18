/*
  Warnings:

  - You are about to drop the `LoginHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LoginHistory" DROP CONSTRAINT "LoginHistory_userId_fkey";

-- DropTable
DROP TABLE "LoginHistory";

-- CreateTable
CREATE TABLE "SubmittedWork" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "formEmployee" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "priority" "TaskPriority" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL,
    "attachments" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "status" "TaskStatus" NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submitted" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),
    "archivedBy" TEXT,
    "archivedDate" TIMESTAMP(3),
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reassignReason" TEXT,

    CONSTRAINT "SubmittedWork_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubmittedWork" ADD CONSTRAINT "SubmittedWork_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
