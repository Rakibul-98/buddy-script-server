import express from "express";
import { PostController } from "./post.controller";
import validate from "../../middlewares/validate";
import auth from "../../middlewares/auth";
import upload from "../../middlewares/upload";
import { createPostSchema, updatePostSchema } from "./post.validation";

const router = express.Router();

router.post(
  "/",
  auth(),
  upload.single("image"),
  validate(createPostSchema),
  PostController.createPost,
);

router.get("/", PostController.getAllPosts);

router.get("/:id", PostController.getSinglePost);

router.patch(
  "/:id",
  auth(),
  validate(updatePostSchema),
  PostController.updatePost,
);

router.delete("/:id", auth(), PostController.deletePost);

export const PostRoutes = router;
