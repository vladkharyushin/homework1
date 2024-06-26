"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const blog_route_1 = require("./routes/blog-route");
const post_route_1 = require("./routes/post-route");
const video_route_1 = require("./routes/video-route");
const testing_route_1 = require("./routes/testing-route");
const user_route_1 = require("./routes/user-route");
const auth_route_1 = require("./routes/auth-route");
const comment_route_1 = require("./routes/comment-route");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
exports.app.use('/testing', testing_route_1.testingRoute);
exports.app.use('/videos', video_route_1.videoRoute);
exports.app.use('/blogs', blog_route_1.blogRoute);
exports.app.use('/posts', post_route_1.postRoute);
exports.app.use('/users', user_route_1.userRoute);
exports.app.use('/auth', auth_route_1.authRoute);
exports.app.use("/comments", comment_route_1.commentRoute);
