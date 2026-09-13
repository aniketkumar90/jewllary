import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { SkeletonGrid } from '../common/SkeletonLoader';
import EmptyState from '../common/EmptyState';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const ProductGrid = ({
  products = [],
  loading = false,
  emptyTitle = 'No Jewellery Found',
  emptyDescription = 'We could not find any jewellery matching your chosen criteria.',
  columns = 4, // 3 | 4
}) => {
  if (loading) {
    return <SkeletonGrid count={columns === 3 ? 3 : 4} />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText="Explore All Jewellery"
        actionLink="/jewellery"
      />
    );
  }

  const gridColsClass =
    columns === 3
      ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid ${gridColsClass} gap-3 sm:gap-6 lg:gap-8`}
    >
      {products.map((product) => (
        <motion.div key={product._id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductGrid;
