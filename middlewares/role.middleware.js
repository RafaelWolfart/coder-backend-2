// Middleware para autorizar por rol
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `No tienes permisos para acceder a este recurso. Requerido: ${roles.join(', ')}, Tu rol: ${req.user.role}`,
      });
    }

    next();
  };
};

// Middleware para verificar si es admin
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Usuario no autenticado' });
  }

  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ message: 'Solo administradores pueden acceder a este recurso' });
  }

  next();
};

// Middleware para verificar si es usuario o admin
export const isUserOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Usuario no autenticado' });
  }

  if (req.user.role !== 'user' && req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'No tienes permisos para acceder a este recurso',
    });
  }

  next();
};
