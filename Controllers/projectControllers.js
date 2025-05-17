const cloudinary = require('../Config/cloudinary');
const Project = require('../Models/projectModel');
const Admin = require('../Models/adminModel');
const jwt = require('jsonwebtoken');

const uploadImageToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "projects" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// Your createNewProject and other functions here...

exports.createNewProject = async (req, res) => {
  try {
    const {
  name,
  technologies,
  github,
  live,
  date,
  status,
  description,
  token
} = req.body;


console.log(req.body)
    

    if (!token) {
      return res.status(403).json({ status: 403, message: "Unauthorized access. No token provided." });
    }

    // Verify JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decodedToken)
    const adminId = decodedToken.id;

    // Check admin existence
    const adminExists = await Admin.findById(adminId);
    if (!adminExists) {
      return res.status(403).json({ status: 403, message: "Unauthorized access. Admin not found." });
    }

    // Upload images if any
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = await Promise.all(
        req.files.map(file => uploadImageToCloudinary(file.buffer))
      );
    }

    // Create new project object
    const newProject = new Project({
      name,
      description,
      technologies,
      github,
      live,
      date,
      status,
      images: uploadedImages.map(img => img.secure_url),
      imagePublicIds: uploadedImages.map(img => img.public_id),
    });

    await newProject.save();

    return res.status(201).json({ status: "success", project: newProject });
  } catch (error) {
    console.error("Project creation error:", error);
    return res.status(500).json({ status: 'error', message: 'Error creating project', error: error.message });
  }
};






exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();

        if (!projects || projects.length === 0) {
            return res.status(404).json({ status: 'error 404: Projects not found'});
        }

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ status: 'error 500: Error fetching projects', error: error.message });
    }
}



