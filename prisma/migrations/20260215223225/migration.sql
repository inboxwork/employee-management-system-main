/*
  Warnings:

  - Added the required column `assignedBy` to the `SubmittedWork` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubmittedWork" ADD COLUMN     "assignedBy" TEXT NOT NULL;
