import express from "express";
import passport from "passport";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { authRouter, passportSetup } from "authentication/api";
import { postsRouter } from "post/api";

const swaggerDefinition = {
  openapi: '3.0.0',  // OpenAPI Spec version
  info: {
    title: 'MightyGram API',
    version: '1.0.0'  // Our API version
  },
  servers: [{
    url: "http://localhost:8080",
    description: "local dev server"
  }]
};
const options = {
  swaggerDefinition,
  apis: ["./**/api.js"]
};
const swaggerSpec = swaggerJSDoc(options);

export const app = express();

passportSetup();
app.use(express.json());
app.use('/', authRouter);
app.use('/posts', passport.authenticate('jwt', { session: false }), postsRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
