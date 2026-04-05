"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
const post_route_1 = require("../modules/post/post.route");
const comment_route_1 = require("../modules/comment/comment.route");
const like_route_1 = require("../modules/like/like.route");
const router = (0, express_1.Router)();
const moduleRouters = [
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/posts",
        route: post_route_1.PostRoutes,
    },
    {
        path: "/comments",
        route: comment_route_1.CommentRoutes,
    },
    {
        path: "/likes",
        route: like_route_1.LikeRoutes,
    },
];
moduleRouters.forEach((route) => router.use(route.path, route.route));
exports.default = router;
