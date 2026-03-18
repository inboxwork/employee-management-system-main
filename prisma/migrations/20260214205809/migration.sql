/*
  Warnings:

  - You are about to drop the column `submittedWorkId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `taskId` to the `SubmittedWork` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_submittedWorkId_fkey";

-- AlterTable
ALTER TABLE "SubmittedWork" ADD COLUMN     "taskId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "submittedWorkId";

-- AddForeignKey
ALTER TABLE "SubmittedWork" ADD CONSTRAINT "SubmittedWork_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
