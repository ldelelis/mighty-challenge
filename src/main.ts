import "reflect-metadata";
import express from "express";
import passport from "passport";
import { createConnection } from "typeorm";
import { postsRouter } from "./post/api";
import { authRouter, passportSetup } from "./authentication/api";
import { SERVICE_PORT } from "./config";

createConnection().then(_ => {
  const app = express();

  passportSetup();
  app.use(express.json());
  app.use('/', authRouter);
  app.use('/posts', passport.authenticate('jwt', { session: false }), postsRouter);

  app.listen(SERVICE_PORT, () => {
    console.log("blablablaa listening");
  });
}).catch(exc => console.error(`ok something failed idk ${exc.stack}`));


// TODO: RELATION CASCADES
/// API
// TODO: attempt to extract postService to common constant
// TODO: input validation
// TODO: rework entity variables as camelCase, column names as snake_case
