const multer = require('multer');


 const storage = multer.memoryStorage();

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPEG, PNG, and WEBP files are allowed"));
        }
    }
});

module.exports = upload;