const express = require('express');
const router = express.Router();
const { createNewProject, getAllProjects } = require('../Controllers/projectControllers');
const upload = require('../Middlewares/multer');


router.post('/create', upload.array('images', 10), createNewProject);
router.get('/', getAllProjects);

module.exports = router;