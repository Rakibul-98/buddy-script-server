/*
  Warnings:

  - You are about to drop the column `target_id` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the `_CommentToLike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LikeToPost` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,post_id,comment_id,target_type]` on the table `likes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_CommentToLike" DROP CONSTRAINT "_CommentToLike_A_fkey";

-- DropForeignKey
ALTER TABLE "_CommentToLike" DROP CONSTRAINT "_CommentToLike_B_fkey";

-- DropForeignKey
ALTER TABLE "_LikeToPost" DROP CONSTRAINT "_LikeToPost_A_fkey";

-- DropForeignKey
ALTER TABLE "_LikeToPost" DROP CONSTRAINT "_LikeToPost_B_fkey";

-- DropIndex
DROP INDEX "likes_user_id_target_id_target_type_key";

-- AlterTable
ALTER TABLE "likes" DROP COLUMN "target_id",
ADD COLUMN     "comment_id" TEXT,
ADD COLUMN     "post_id" TEXT;

-- DropTable
DROP TABLE "_CommentToLike";

-- DropTable
DROP TABLE "_LikeToPost";

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_post_id_comment_id_target_type_key" ON "likes"("user_id", "post_id", "comment_id", "target_type");

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
