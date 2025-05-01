/*
  Warnings:

  - Added the required column `directory` to the `Attatchment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attatchment" ADD COLUMN     "directory" TEXT NOT NULL;
