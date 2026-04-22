const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUserRole, deleteUser } = require('../controllers/user.controller');
const { protect, adminOnly } = require('../middleware/auth');

// All user-management routes require auth + admin
router.use(protect, adminOnly);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Admin - User management
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden - Admins only
 */
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
