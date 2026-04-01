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

export const PostRoutes = router;
