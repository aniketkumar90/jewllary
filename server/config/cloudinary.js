const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Resolve Cloudinary credentials from either CLOUDINARY_URL or individual variables
let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
let apiKey = process.env.CLOUDINARY_API_KEY;
let apiSecret = process.env.CLOUDINARY_API_SECRET;
let cloudinaryUrl = process.env.CLOUDINARY_URL;

// Auto-fix if user accidentally pasted CLOUDINARY_URL into CLOUDINARY_API_SECRET
if (apiSecret && (apiSecret.startsWith('CLOUDINARY_URL=') || apiSecret.startsWith('cloudinary://'))) {
  cloudinaryUrl = apiSecret.replace('CLOUDINARY_URL=', '').trim();
  apiSecret = null;
}

// Parse CLOUDINARY_URL format: cloudinary://<api_key>:<api_secret>@<cloud_name>
if (cloudinaryUrl && (!cloudName || !apiKey || !apiSecret)) {
  try {
    const cleanedUrl = cloudinaryUrl.replace(/^CLOUDINARY_URL=/, '').trim();
    const match = cleanedUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (match) {
      apiKey = apiKey || match[1].trim();
      apiSecret = apiSecret || match[2].trim();
      cloudName = cloudName || match[3].trim();
    }
  } catch (err) {
    console.warn('[Cloudinary Config Warning] Failed to parse CLOUDINARY_URL:', err.message);
  }
}

const isConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  console.log(`[Cloudinary] Successfully configured for cloud: ${cloudName}`);
} else {
  console.log('[Cloudinary] Running in local storage fallback mode (uploads saved to server/uploads)');
}

/**
 * Upload a local file to Cloudinary (or fallback to local static serving if unconfigured)
 */
const uploadImage = async (filePath, folder = 'vanya_jewels') => {
  if (isConfigured) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: folder,
        resource_type: 'auto',
      });
      // Delete temporary local file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return {
        secure_url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (error) {
      console.error('[Cloudinary Upload Error]:', error);
      throw error;
    }
  } else {
    // Local storage fallback
    const fileName = path.basename(filePath);
    const destDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    const destPath = path.join(destDir, fileName);
    if (filePath !== destPath && fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, destPath);
      fs.unlinkSync(filePath);
    }
    const publicId = `local_${Date.now()}_${path.parse(fileName).name}`;
    return {
      secure_url: `/uploads/${fileName}`,
      public_id: publicId,
    };
  }
};

/**
 * Delete an image by public_id
 */
const deleteImage = async (publicId) => {
  if (!publicId) return true;
  if (isConfigured && !publicId.startsWith('local_')) {
    try {
      await cloudinary.uploader.destroy(publicId);
      return true;
    } catch (error) {
      console.error('[Cloudinary Delete Error]:', error);
      return false;
    }
  } else {
    // Local file deletion
    return true;
  }
};

module.exports = {
  cloudinary,
  isConfigured,
  uploadImage,
  deleteImage,
};
