import React, { useState, useRef } from 'react';
import { cmsService } from '../../services/cmsService';
import { useToast } from '../../context/ToastContext';
import { FiUploadCloud, FiTrash2, FiLoader, FiCheck, FiImage } from 'react-icons/fi';

const CloudinaryUploader = ({
  value, // { secure_url, public_id } or array of objects
  onChange,
  multiple = false,
  label = 'Upload Image to Cloudinary',
  helperText = 'Recommended: High resolution JPG/PNG/WEBP up to 10MB',
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      if (multiple) {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
          formData.append('images', file);
        });
        const res = await cmsService.uploadMedia(formData);
        const newImages = Array.isArray(res.data) ? res.data : [res.data];
        const currentList = Array.isArray(value) ? value : [];
        onChange([...currentList, ...newImages]);
        toast.success(`${newImages.length} images uploaded to Cloudinary`);
      } else {
        const formData = new FormData();
        formData.append('image', files[0]);
        const res = await cmsService.uploadMedia(formData);
        onChange({
          secure_url: res.data.secure_url,
          public_id: res.data.public_id,
        });
        toast.success('Image uploaded to Cloudinary');
      }
    } catch (error) {
      toast.error(error.message || 'Upload to Cloudinary failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveSingle = () => {
    onChange({ secure_url: '', public_id: '' });
  };

  const handleRemoveMulti = (indexToRemove) => {
    if (Array.isArray(value)) {
      onChange(value.filter((_, i) => i !== indexToRemove));
    }
  };

  return (
    <div className="w-full space-y-3">
      {label && (
        <label className="block text-[11px] uppercase tracking-luxury text-gold-300 font-medium">
          {label}
        </label>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple={multiple}
        accept="image/png, image/jpeg, image/webp, image/jpg"
        className="hidden"
      />

      {/* Single Upload Preview */}
      {!multiple && value?.secure_url ? (
        <div className="relative w-48 aspect-square border border-gold-500/40 bg-[#18281d] overflow-hidden group shadow-md">
          <img
            src={value.secure_url}
            alt="Uploaded Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0c130e]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-gold-500 text-charcoal-900 hover:bg-gold-400 transition-colors text-xs font-semibold tracking-wider uppercase"
              title="Replace Image"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemoveSingle}
              className="p-2 bg-rose-600/90 text-white hover:bg-rose-600 transition-colors"
              title="Delete Image"
            >
              <FiTrash2 className="text-sm" />
            </button>
          </div>
          <div className="absolute bottom-1 left-1 right-1 bg-[#09100a]/90 text-[9px] text-gold-300/80 px-1.5 py-0.5 truncate font-mono border border-gold-500/20">
            {value.public_id || 'Cloudinary Linked'}
          </div>
        </div>
      ) : null}

      {/* Multi Upload Previews */}
      {multiple && Array.isArray(value) && value.length > 0 ? (
        <div className="flex flex-wrap gap-3 mb-2">
          {value.map((img, idx) => (
            <div
              key={idx}
              className="relative w-24 h-24 border border-gold-500/30 bg-[#18281d] overflow-hidden group shadow-sm"
            >
              <img
                src={img.secure_url}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveMulti(idx)}
                className="absolute inset-0 bg-rose-950/85 text-rose-200 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <FiTrash2 className="text-base" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {/* Upload Action Box */}
      {(!value?.secure_url || multiple) && (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-gold-500/30 hover:border-gold-400/70 bg-[#18281d]/50 hover:bg-[#18281d] p-6 text-center cursor-pointer transition-all ${
            uploading ? 'pointer-events-none opacity-60' : ''
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center py-3">
              <FiLoader className="animate-spin text-2xl text-gold-400 mb-2" />
              <p className="text-xs uppercase tracking-luxury text-gold-300 font-semibold">
                Streaming directly to Cloudinary...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2">
              <FiUploadCloud className="text-3xl text-gold-400 mb-2" />
              <p className="text-xs uppercase tracking-luxury text-ivory font-semibold mb-1">
                {multiple ? 'Select / Drop Multi Gallery Images' : 'Select / Drop Image'}
              </p>
              <p className="text-[11px] text-ivory/50">{helperText}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CloudinaryUploader;
