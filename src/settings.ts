import express from "express";
import {blogRoute} from "./routes/blog-route";
import {postRoute} from "./routes/post-route";
import {videoRoute} from "./routes/video-route";
import {testingRoute} from "./routes/testing-route";
import {userRoute} from "./routes/user-route";
import {authRoute} from "./routes/auth-route";
import {commentRoute} from "./routes/comment-route";
import cookieParser from "cookie-parser";

export const app = express()

app.use(express.json())

app.use(cookieParser())

app.use('/testing', testingRoute)
app.use('/videos', videoRoute)
app.use('/blogs', blogRoute)
app.use('/posts', postRoute)
app.use('/users', userRoute)
app.use('/auth', authRoute)
app.use("/comments", commentRoute)