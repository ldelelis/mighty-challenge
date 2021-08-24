import "reflect-metadata";
import { createConnection } from "typeorm";
import { SERVICE_PORT } from "./config";
import { app } from "./app";

createConnection(process.env.NODE_ENV || "default").then(_ => {
  app.listen(SERVICE_PORT, () => {
    console.log("blablablaa listening");
  });
}).catch(exc => console.error(`ok something failed idk ${exc.stack}`));


// TODO: RELATION CASCADES
/// API
// TODO: attempt to extract postService to common constant
// TODO: input validation
// TODO: rework entity variables as camelCase, column names as snake_case
