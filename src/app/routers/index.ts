import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { PostRoutes } from "../modules/post/post.route";

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
];

moduleRouters.forEach((route) => router.use(route.path, route.route));
export default router;
