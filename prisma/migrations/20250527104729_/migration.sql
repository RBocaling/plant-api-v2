/*
  Warnings:

  - You are about to drop the column `personalInfoId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `personalinfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `plantcategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `plantgallery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `plantinfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `chat` DROP FOREIGN KEY `Chat_senderId_fkey`;

-- DropForeignKey
ALTER TABLE `plantgallery` DROP FOREIGN KEY `PlantGallery_plantId_fkey`;

-- DropForeignKey
ALTER TABLE `plantinfo` DROP FOREIGN KEY `PlantInfo_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_personalInfoId_fkey`;

-- DropIndex
DROP INDEX `User_personalInfoId_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `personalInfoId`,
    ADD COLUMN `profile` VARCHAR(191) NULL,
    MODIFY `role` ENUM('CUSTOMER', 'ADMIN', 'OWNER', 'SPECIALIST') NOT NULL;

-- DropTable
DROP TABLE `chat`;

-- DropTable
DROP TABLE `personalinfo`;

-- DropTable
DROP TABLE `plantcategory`;

-- DropTable
DROP TABLE `plantgallery`;

-- DropTable
DROP TABLE `plantinfo`;

-- CreateTable
CREATE TABLE `PlantAdvisory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plant_name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `request_type` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `priority` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feedback` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rating` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL,
    `response` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlantAdvisory` ADD CONSTRAINT `PlantAdvisory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
