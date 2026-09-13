import React from 'react';
import { motion } from 'framer-motion';

const ImageReveal = ({
  src,
  alt = '',
  className = '',
  aspectRatio = 'aspect-[4/5]',
}) => {
  return (
    <div className={`relative overflow-hidden bg-ivory-200 ${aspectRatio} ${className}`}>
      <motion.div
        initial={{ scale: 1.15, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      </motion.div>
    </div>
  );
};

export default ImageReveal;
