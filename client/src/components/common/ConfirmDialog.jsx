import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you wish to proceed? This action cannot be reversed.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showClose={!loading}>
      <div className="text-center py-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-gold-500/15 border border-gold-400/40 flex items-center justify-center mb-4 text-gold-300">
          <FiAlertTriangle className="text-xl" />
        </div>
        <h3 className="text-lg font-serif text-ivory mb-2 font-normal">{title}</h3>
        <p className="text-sm text-ivory/70 mb-6 font-light leading-relaxed">{message}</p>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="border border-gold-500/30 text-ivory/80 hover:bg-[#18281d] hover:text-ivory"
          >
            {cancelText}
          </Button>
          <Button
            variant={isDestructive ? 'danger' : 'gold'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
