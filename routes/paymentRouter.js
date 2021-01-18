const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');
const payments = require('../controllers/paymentController');

router.post('/', authenticateJWT, payments.purchaseImage);

module.exports = router;