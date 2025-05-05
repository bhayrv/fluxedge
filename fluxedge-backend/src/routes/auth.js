const router = require('express').Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/signup', authController.signup); // New signup route
router.get('/profile', verifyToken, authController.getProfile); // New profile route

module.exports = router;
