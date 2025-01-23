import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User, { IUser } from "../models/user.js";

passport.use(
  new GoogleStrategy(
    {
      clientID:
        process.env.GOOGLE_CLIENT_ID ||
        "21071364024-bl83s8s0qd5em65c7n6um2gfd7ljsq85.apps.googleusercontent.com",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ||
        "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",
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:3000/auth/google/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: IUser | false) => void
    ) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          googleId: profile.id,
          email: profile.emails?.[0]?.value,
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
  interface DeserializeUserDone {
    (err: any, user?: IUser | null): void;
  }

  passport.deserializeUser((id: string, done: DeserializeUserDone) => {
    User.findById(id, (err: any, user: IUser | null) => {
      done(err, user);
    });
  });
});
