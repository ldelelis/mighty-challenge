import { Router } from "express";
import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import jsonwebtoken from "jsonwebtoken";
import { Strategy } from "passport-local";
import { AuthUser } from "./models";
import { GrammerService } from "../grammer/repositories";

export const passportSetup = () => {
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
    // TODO: extract to env variable
    secretOrKey: 'TOPSECRET',
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

authRouter.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user: AuthUser) => {
    try {
      if (err) {
        console.error(err);
        return next(new Error("login error occurred boo"));
      }

      req.login(user, { session: false }, async (error) => {
        if (error) {
          return next(error);
        }

        const jwtBody = { id: user.id, username: user.username };
        // TODO: extract token secret to env variable
        const token = jsonwebtoken.sign({ user: jwtBody }, 'TOPSECRET')

        return res.json({ token })
      });
    } catch (exc) {
      console.error("error during login");
      console.error(exc.stack);

      return next(exc);
    }
  })(req, res, next);
});

/*
 * @param {string} username
 * @param {string} password
 */
authRouter.post('/register', passport.authenticate('register', { session: false }) , async (_, res) => {
  res.status(200).json({});
});
