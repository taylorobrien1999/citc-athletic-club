const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');

// Files are held in memory only briefly, then streamed straight to Cloudinary —
// nothing is ever written to the server's local disk.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── POST /api/upload ───────────────────────────────────────────────────────────
// Admin only. Expects multipart/form-data with a single field named "file".
const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'citc-uploads', resource_type: 'auto' }, // 'auto' handles images + PDFs + other file types
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ message: 'Upload failed. Server error.' });
      }
      return res.status(201).json({ url: result.secure_url });
    }
  );

  uploadStream.end(req.file.buffer);
};

module.exports = { upload, uploadFile };