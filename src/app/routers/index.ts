import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { PostRoutes } from "../modules/post/post.route";
import { CommentRoutes } from "../modules/comment/comment.route";
import { LikeRoutes } from "../modules/like/like.route";

const router = Router();
const moduleRouters = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/posts",
    route: PostRoutes,
  },
  {
    path: "/comments",
    route: CommentRoutes,
  },
  {
    path: "/likes",
    route: LikeRoutes,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));
export default router;
