const router = require('express').Router();

const adminControllers = require('../Controllers/adminControllers');

router.post('/login', adminControllers.loginAdmin);

module.exports = router;