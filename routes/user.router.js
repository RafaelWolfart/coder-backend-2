import { Router } from 'express';
import mongoose from 'mongoose';
import { User } from '../config/models/user.model.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { isAdmin, authorize } from '../middlewares/role.middleware.js';

const router = Router();

// Obtener todos los usuarios (solo admin)
router.get('/', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('cart');
    res.status(200).json({
      message: 'Usuarios obtenidos exitosamente',
      users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener usuario por ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Formato de ID inválido' });
    }

    const user = await User.findById(req.params.id).select('-password').populate('cart');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // El usuario solo puede ver sus propios datos, a menos que sea admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para ver este usuario' });
    }

    res.status(200).json({
      message: 'Usuario obtenido exitosamente',
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear nuevo usuario (solo admin)
router.post('/', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({
        message: 'Todos los campos son requeridos (first_name, last_name, email, age, password)',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: `El email ${email} ya está registrado` });
    }

    const newUser = new User({
      first_name,
      last_name,
      email: email.toLowerCase(),
      age,
      password,
      role: role || 'user',
    });

    await newUser.save();

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: newUser.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Actualizar usuario
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Formato de ID inválido' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // El usuario solo puede actualizar sus propios datos, a menos que sea admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para actualizar este usuario' });
    }

    const { first_name, last_name, email, age, role } = req.body;

    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.params.id },
      });
      if (existingUser) {
        return res.status(400).json({ message: `El email ${email} ya está en uso` });
      }
      user.email = email.toLowerCase();
    }
    if (age) user.age = age;
    if (role && req.user.role === 'admin') user.role = role;

    await user.save();

    res.status(200).json({
      message: 'Usuario actualizado exitosamente',
      user: user.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Eliminar usuario (solo admin)
router.delete('/:id', authenticateJWT, isAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Formato de ID inválido' });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      message: 'Usuario eliminado exitosamente',
      user: user.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
