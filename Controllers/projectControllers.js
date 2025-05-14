const express = require('express');
const Project = require('../Models/projectModel');


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




exports.createNewProject = async (req, res) => {
    try {
        const { id, name, description, technologies, github, live } = req.body;

        const uploadedImages = await Promise.all(req.files.map(file => uploadImageToCloudinary(file.buffer)));

        const newProject = new Project({
            id, 
            name,
             description, 
             technologies, 
             github, 
             live,
            images: uploadedImages.map(img => img.secure_url),
            imagePublicIds: uploadedImages.map(img => img.public_id)
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: 'Error creating Project', error: error.message });
    }
};