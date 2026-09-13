import React from 'react';
import { ORDER_STATUS_COLORS } from '../../utils/constants';

const StatusBadge = ({ status }) => {
  const colorClass =
    ORDER_STATUS_COLORS[status] || 'bg-white/10 text-ivory/80 border-white/20';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider border ${colorClass}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
