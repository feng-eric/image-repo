const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const authenticateJWT = require('../middleware/auth');
const images = require('../controllers/imageController');

// Get all public images
router.get('/all', images.getAllPublicImages);

// Search images
router.get('/search', images.searchImages);

// Get Images for logged in user
router.get('/me', authenticateJWT, images.getUserImages);

// Get image by id
router.get('/:id', images.getImageDetails);

// Get image by category
router.get('/category/:category', images.getImageByCategory);

// Upload image
router.post('/', authenticateJWT, upload.single('image'), images.uploadImage);

// Update image details
router.put('/:id', authenticateJWT, images.updateImageDetails);

// Delete image
router.delete('/:id', authenticateJWT, images.deleteImage);

module.exports = router;