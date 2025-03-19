/*
  Warnings:

  - You are about to drop the column `rePostId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_rePostId_fkey`;

-- DropIndex
DROP INDEX `Post_rePostId_fkey` ON `Post`;

-- AlterTable
ALTER TABLE `Post` DROP COLUMN `rePostId`;
