import "reflect-metadata";
import { createConnection } from "typeorm";

import { app } from "app";
import { SERVICE_PORT } from "config";

createConnection(process.env.NODE_ENV || "default").then(_ => {
  app.listen(SERVICE_PORT, () => {
    console.log(`Listening on port ${SERVICE_PORT}`);
  });
}).catch(exc => {
  console.error(`Error during application startup: ${exc.stack}`)
});
