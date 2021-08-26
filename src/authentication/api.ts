import { Router } from "express";
import jsonwebtoken from "jsonwebtoken";
import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { Strategy } from "passport-local";

import { JWT_SECRET_KEY } from "config";
import { GrammerService } from "grammer/repositories";

import { AuthUser } from "./models";

export const passportSetup = (): void => {
  passport.use('register', new Strategy({
    usernameField: "username",
    passwordField: "password"
  },
  async (username, password, done) => {
    const grammerService = new GrammerService();

    try {
      const grammer = grammerService.createGrammer(username, password);

      return done(null, grammer);
    } catch (exc) {
      console.error("error during account creation");
      console.error(exc.stack);
      done(exc)
    }
  }));

  passport.use('login', new Strategy({
    usernameField: "username",
    passwordField: "password"
  }, async (username, password, done) => {
    // TODO: this should be grammer service instead
    // Create grammer, then auth user via signal, before insert
    const grammerService = new GrammerService();

    try {
      const grammer = await grammerService.getByUsernameAndPassword(username, password);

      return done(null, grammer);
    } catch(exc) {
      console.error("error during login");
      console.error(exc.stack);

      return done(exc);
    }
  }));

  passport.use(new JWTStrategy({
    secretOrKey: JWT_SECRET_KEY,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  },
  async (token, done) => {
    try {
      return done(null, token.user);
    } catch (exc) {
      console.error("error during jwt extract");
      console.error(exc.stack);

      done(exc);
    }
  }));
}

// TODO: these views should be on grammer API
export const authRouter = Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: logs into an existing account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: successful login token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token to use with bearer authentication
 *       500:
 *         description: unexpected server error
 */
authRouter.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user: AuthUser) => {
    // TODO: extract all this to service to better test things
    try {
      if (err) {
        console.error(err);
        return next(new Error("Unexpected error during login"));
      }

      req.login(user, { session: false }, async (error) => {
        if (error) {
          return next(error);
        }

        const jwtBody = { id: user.id, username: user.username };
        const token = jsonwebtoken.sign({ user: jwtBody }, JWT_SECRET_KEY)

        return res.status(200).json({ token })
      });
    } catch (exc) {
      console.error("error during login");
      console.error(exc.stack);

      return next(exc);
    }
  })(req, res, next);
});

/**
 * @swagger
 * /register:
 *   post:
 *     summary: creates a new account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: empty successful response
 */
authRouter.post('/register', passport.authenticate('register', { session: false }) , async (_, res) => {
  res.status(201).send();
});
