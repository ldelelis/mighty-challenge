import express from "express";
import passport from "passport";
import { authRouter, passportSetup } from "./authentication/api";
import { postsRouter } from "./post/api";

export const app = express();

passportSetup();
app.use(express.json());
app.use('/', authRouter);
app.use('/posts', passport.authenticate('jwt', { session: false }), postsRouter);
