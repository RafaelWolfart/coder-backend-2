import passport from 'passport';
import LocalStrategy from 'passport-local';
import JWTStrategy from 'passport-jwt';
import { User } from './models/user.model.js';
import config from './env.config.js';

const JWTExtract = JWTStrategy.ExtractJwt;

// Estrategia Local para Login
passport.use(
  'login',
  new LocalStrategy.Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: 'Email no registrado' });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Estrategia JWT para validar tokens
passport.use(
  'jwt',
  new JWTStrategy.Strategy(
    {
      jwtFromRequest: JWTExtract.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtSecret,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Estrategia "current" para obtener usuario del JWT
passport.use(
  'current',
  new JWTStrategy.Strategy(
    {
      jwtFromRequest: JWTExtract.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtSecret,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);

        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialización de usuario (para sesiones si las usamos)
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
