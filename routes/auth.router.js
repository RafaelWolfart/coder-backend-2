import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { User } from '../config/models/user.model.js';
import { Cart } from '../config/models/cart.model.js';
import config from '../config/env.config.js';
import { getCurrentUser } from '../middlewares/auth.middleware.js';

const router = Router();

// Registrar nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;

    // Validar campos requeridos
    if (!first_name || !last_name || !email || !age || !password) {
      return res
        .status(400)
        .json({ message: 'Todos los campos son requeridos (first_name, last_name, email, age, password)' });
    }

    // Verificar si el email ya está registrado
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: `El email ${email} ya está registrado` });
    }

    // Crear nuevo usuario
    const newUser = new User({
      first_name,
      last_name,
      email: email.toLowerCase(),
      age,
      password,
      role: role || 'user',
    });

    // Guardar usuario
    await newUser.save();

    // Crear carrito para el usuario
    const newCart = new Cart({
      user: newUser._id,
      products: [],
    });
    await newCart.save();

    // Actualizar usuario con referencia al carrito
    newUser.cart = newCart._id;
    await newUser.save();

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: newUser.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login de usuario
router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err) {
        return res.status(500).json({ message: 'Error en la autenticación' });
      }

      if (!user) {
        return res.status(401).json({ message: info?.message || 'Credenciales inválidas' });
      }

      // Generar JWT
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpire }
      );

      res.status(200).json({
        message: 'Login exitoso',
        token,
        user: user.toJSON(),
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })(req, res, next);
});

// Obtener usuario actual
router.get('/current', getCurrentUser, (req, res) => {
  try {
    res.status(200).json({
      message: 'Usuario actual obtenido',
      user: req.user.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Logout (solo para referencia, el logout se maneja en el cliente eliminando el token)
router.post('/logout', (req, res) => {
  res.status(200).json({
    message: 'Logout exitoso. Por favor elimina el token del cliente.',
  });
});

export default router;
