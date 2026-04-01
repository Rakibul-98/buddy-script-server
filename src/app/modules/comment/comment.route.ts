import express from "express";
import { CommentController } from "./comment.controller";
import validate from "../../middlewares/validate";
import auth from "../../middlewares/auth";
import { createCommentSchema, updateCommentSchema } from "./comment.validation";

const router = express.Router();

router.post(
  "/",
  auth(),
  validate(createCommentSchema),
  CommentController.createComment,
);

router.get("/post/:postId", CommentController.getCommentsByPost);

router.patch(
  "/:id",
  auth(),
  validate(updateCommentSchema),
  CommentController.updateComment,
);

router.delete("/:id", auth(), CommentController.deleteComment);

export const CommentRoutes = router;
