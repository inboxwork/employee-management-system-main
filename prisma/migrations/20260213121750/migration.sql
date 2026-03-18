/*
  Warnings:

  - You are about to drop the column `formEmployee` on the `SubmittedWork` table. All the data in the column will be lost.
  - Added the required column `fromEmployee` to the `SubmittedWork` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubmittedWork" DROP COLUMN "formEmployee",
ADD COLUMN     "fromEmployee" TEXT NOT NULL;
