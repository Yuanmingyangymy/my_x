/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `receiverUsername` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderUsername` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_receiverId_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_senderId_fkey`;

-- DropIndex
DROP INDEX `Message_receiverId_idx` ON `Message`;

-- DropIndex
DROP INDEX `Message_senderId_idx` ON `Message`;

-- 添加新列，允许为空
ALTER TABLE `Message` ADD COLUMN `receiverUsername` VARCHAR(191);
ALTER TABLE `Message` ADD COLUMN `senderUsername` VARCHAR(191);

-- 更新现有数据
UPDATE `Message` m
JOIN `User` u1 ON m.senderId = u1.id
SET m.senderUsername = u1.username;

UPDATE `Message` m
JOIN `User` u2 ON m.receiverId = u2.id
SET m.receiverUsername = u2.username;

-- 删除无效数据
DELETE FROM `Message` WHERE senderUsername IS NULL OR receiverUsername IS NULL;

-- 将列设置为NOT NULL
ALTER TABLE `Message` MODIFY `receiverUsername` VARCHAR(191) NOT NULL;
ALTER TABLE `Message` MODIFY `senderUsername` VARCHAR(191) NOT NULL;

-- 删除旧列
ALTER TABLE `Message` DROP COLUMN `receiverId`;
ALTER TABLE `Message` DROP COLUMN `senderId`;

-- CreateIndex
CREATE INDEX `Message_senderUsername_idx` ON `Message`(`senderUsername`);

-- CreateIndex
CREATE INDEX `Message_receiverUsername_idx` ON `Message`(`receiverUsername`);

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_senderUsername_fkey` FOREIGN KEY (`senderUsername`) REFERENCES `User`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_receiverUsername_fkey` FOREIGN KEY (`receiverUsername`) REFERENCES `User`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
