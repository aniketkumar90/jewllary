import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../common/Modal';
import Button from '../common/Button';
import PriceDisplay from '../common/PriceDisplay';
import { FiArrowRight } from 'react-icons/fi';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const images = [
    product.mainImage?.secure_url,
    ...(product.galleryImages?.map((img) => img.secure_url) || []),
  ].filter(Boolean);

  const currentImage = images[activeImageIndex] || product.mainImage?.secure_url;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start text-left">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-[#18281d] rounded-lg overflow-hidden border border-gold-400/35 shadow-md">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 brightness-[0.95]"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 border rounded flex-shrink-0 overflow-hidden bg-[#18281d] transition-all ${
                    activeImageIndex === idx ? 'border-gold-400 ring-1 ring-gold-400/50' : 'border-gold-500/25 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
              {product.category?.name || 'Haute Joaillerie'}
            </span>
            <h3 className="text-2xl font-serif text-ivory font-normal leading-snug">
              {product.name}
            </h3>
            <p className="text-[11px] text-gold-400/70 uppercase tracking-widest mt-1 font-mono">
              SKU: {product.sku}
            </p>
          </div>

          <PriceDisplay
            price={product.price}
            salePrice={product.salePrice}
            size="xl"
            light={true}
          />

          <p className="text-xs text-ivory/75 leading-relaxed font-light">
            {product.shortDescription || product.description}
          </p>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-2 text-xs border-y border-gold-500/20 py-3 text-ivory/80">
            <div>
              <span className="text-gold-400/70 block text-[10px] uppercase tracking-widest font-sans">Material</span>
              <span className="font-medium text-ivory">{product.material}</span>
            </div>
            <div>
              <span className="text-gold-400/70 block text-[10px] uppercase tracking-widest font-sans">Approx. Weight</span>
              <span className="font-medium text-ivory">{product.weight}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="block w-full"
            >
              <Button
                variant="gold"
                fullWidth
                size="lg"
                icon={FiArrowRight}
              >
                View Full Heirloom Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuickViewModal;
