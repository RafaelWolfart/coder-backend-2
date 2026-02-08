import passport from 'passport';

// Middleware para autenticar con JWT
export const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Error en la autenticación' });
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: info?.message || 'No autorizado. Token inválido o no proporcionado' });
    }

    req.user = user;
    next();
  })(req, res, next);
};

// Middleware para obtener usuario actual del JWT
export const getCurrentUser = (req, res, next) => {
  passport.authenticate('current', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Error en la autenticación' });
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: info?.message || 'No autorizado. Token inválido o no proporcionado' });
    }

    req.user = user;
    next();
  })(req, res, next);
};
