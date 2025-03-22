const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const Upload = require('../models/Upload');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dilyeu4e6',
  api_key: '797234227951339',
  api_secret: 'jn0UqEqDMgw8x-9iAz63fu8h-Cw'
});

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// GET all uploads
router.get('/', async (req, res) => {
  try {
    const uploads = await Upload.find();
    console.log('Found uploads:', uploads);
    res.json({
      success: true,
      data: {
        documents: uploads
      }
    });
  } catch (error) {
    console.error('Error fetching uploads:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// GET single upload
router.get('/:id', async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) {
      return res.status(404).json({ 
        success: false,
        error: 'Upload not found' 
      });
    }
    res.json({
      success: true,
      data: {
        document: upload
      }
    });
  } catch (error) {
    console.error('Error fetching upload:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// POST create upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Convert file buffer to base64
    const fileBuffer = req.file.buffer;
    const base64File = fileBuffer.toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${base64File}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'raw',
      folder: 'assignments',
      secure: true,
      format: 'pdf',
      transformation: [
        { flags: 'attachment' }
      ]
    });

    // Create new upload document
    const upload = new Upload({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      projectType: req.body.projectType || '',
      fileUrl: uploadResponse.secure_url,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      cloudinaryId: uploadResponse.public_id
    });

    await upload.save();

    res.status(201).json({
      success: true,
      data: {
        document: upload
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error uploading file'
    });
  }
});

// DELETE upload
router.delete('/:id', async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) {
      return res.status(404).json({ 
        success: false,
        error: 'Upload not found' 
      });
    }

    // Delete from Cloudinary
    if (upload.cloudinaryId) {
      await cloudinary.uploader.destroy(upload.cloudinaryId);
    }

    await upload.deleteOne();
    res.json({ 
      success: true,
      message: 'Upload deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting upload:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router; 