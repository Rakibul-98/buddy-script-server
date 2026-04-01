import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";

const router = Router();
const moduleRouters = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));
export default router;
