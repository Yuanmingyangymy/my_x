-- CreateTable
CREATE TABLE `UserSimilarity` (
    `userId` VARCHAR(191) NOT NULL,
    `similarUser` VARCHAR(191) NOT NULL,
    `similarity` DOUBLE NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `UserSimilarity_similarity_idx`(`similarity`),
    PRIMARY KEY (`userId`, `similarUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
