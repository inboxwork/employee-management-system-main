-- DropForeignKey
ALTER TABLE "SubmittedWork" DROP CONSTRAINT "SubmittedWork_taskId_fkey";

-- AddForeignKey
ALTER TABLE "SubmittedWork" ADD CONSTRAINT "SubmittedWork_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
