import React from 'react';
import Button from './Button';
import { Link } from 'react-router-dom';
import { FiBox } from 'react-icons/fi';

const EmptyState = ({
  icon: Icon = FiBox,
  title = 'Nothing Found',
  description = 'There are no items to display at this moment.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="py-16 px-6 text-center max-w-md mx-auto flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-[#18281d] border border-gold-400/40 flex items-center justify-center text-gold-300 mb-5 shadow-lg shadow-black/40">
        <Icon className="text-2xl" />
      </div>
      <h3 className="text-2xl font-serif text-ivory mb-2 font-normal">{title}</h3>
      <p className="text-sm text-ivory/70 mb-8 leading-relaxed">{description}</p>
      {actionText && (
        actionLink ? (
          <Link to={actionLink}>
            <Button variant="gold">{actionText}</Button>
          </Link>
        ) : (
          <Button variant="gold" onClick={onAction}>
            {actionText}
          </Button>
        )
      )}
    </div>
  );
};

export default EmptyState;
