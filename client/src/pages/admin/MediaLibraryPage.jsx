import React, { useState, useEffect } from 'react';
import CloudinaryUploader from '../../components/admin/CloudinaryUploader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import { cmsService } from '../../services/cmsService';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';
import { FiCopy, FiTrash2, FiExternalLink, FiPlus, FiCheck } from 'react-icons/fi';

const MediaLibraryPage = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Deletion state
  const [deleteItem, setDeleteItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const toast = useToast();

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await cmsService.getMediaList({ page, limit: 18 });
      setMediaList(res.media || []);
      setTotalPages(res.pages || 1);
      setTotalCount(res.total || 0);
    } catch (e) {
      toast.error('Failed to load media library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [page]);

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Cloudinary secure URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    try {
      await cmsService.deleteMedia(deleteItem._id);
      toast.success('Image deleted from Cloudinary & library');
      setDeleteItem(null);
      fetchMedia();
    } catch (err) {
      toast.error(err.message || 'Failed to delete media');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
            ✦ Remote CDN Assets ✦
          </span>
          <h1 className="text-3xl font-serif text-ivory font-normal">
            Cloudinary Media Vault ({totalCount})
          </h1>
        </div>

        <Button
          variant="gold"
          icon={FiPlus}
          onClick={() => setShowUploadModal(!showUploadModal)}
        >
          {showUploadModal ? 'Close Uploader' : 'Upload Images'}
        </Button>
      </div>

      {/* Inline Uploader Drawer */}
      {showUploadModal && (
        <div className="bg-[#142318] border border-gold-400/40 p-6 shadow-xl">
          <CloudinaryUploader
            multiple={true}
            value={[]}
            onChange={() => {
              fetchMedia();
              setShowUploadModal(false);
            }}
            label="Upload High-Resolution Imagery to Cloudinary"
            helperText="Drag and drop or select images to upload directly into Cloudinary CDN"
          />
        </div>
      )}

      {loading ? (
        <LoadingSpinner label="Loading Cloudinary Media Assets..." />
      ) : mediaList.length === 0 ? (
        <div className="bg-[#142318] border border-gold-400/30 p-12 text-center shadow-lg">
          <p className="font-serif text-lg text-ivory mb-2">No Cloudinary Images Found</p>
          <p className="text-xs text-ivory/60 mb-4">Upload your first high jewellery image asset above.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaList.map((item) => (
              <div
                key={item._id}
                className="bg-[#142318] border border-gold-400/30 overflow-hidden group shadow-md flex flex-col justify-between"
              >
                {/* Photo */}
                <div className="relative aspect-square overflow-hidden bg-[#18281d]">
                  <img
                    src={item.secure_url}
                    alt={item.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#0c130e]/85 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <a
                      href={item.secure_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gold-500 text-charcoal-900 hover:bg-gold-400 rounded-full transition-colors"
                      title="Open full size"
                    >
                      <FiExternalLink />
                    </a>
                    <button
                      onClick={() => handleCopy(item.secure_url, item._id)}
                      className="p-2 bg-gold-500 text-charcoal-900 hover:bg-gold-400 rounded-full transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === item._id ? <FiCheck className="text-emerald-950 font-bold" /> : <FiCopy />}
                    </button>
                    <button
                      onClick={() => setDeleteItem(item)}
                      className="p-2 bg-rose-600/90 text-white hover:bg-rose-600 rounded-full transition-colors"
                      title="Delete image"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-2.5 bg-[#18281d] text-[10px] space-y-1 border-t border-gold-500/15">
                  <p className="truncate font-medium text-ivory" title={item.fileName}>
                    {item.fileName}
                  </p>
                  <p className="text-gold-300/60 font-mono text-[9px] truncate">
                    {item.public_id}
                  </p>
                  <p className="text-ivory/40 text-[9px]">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteItem)}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDeleteConfirm}
        title="Destroy Cloudinary Asset"
        message={`Are you sure you wish to delete "${deleteItem?.fileName}"? It will be removed from Cloudinary.`}
        confirmText="Destroy Asset"
        isDestructive={true}
        loading={isDeleting}
      />
    </div>
  );
};

export default MediaLibraryPage;
