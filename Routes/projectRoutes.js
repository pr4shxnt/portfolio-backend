const express = require('express');
const router = express.Router();
const { createNewProject } = require('../Controllers/projectControllers');
const upload = require('../Middlewares/multer');


router.post('/create', upload.array('images', 10), createNewProject);

module.exports = router;