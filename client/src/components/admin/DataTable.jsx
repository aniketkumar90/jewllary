import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  page = 1,
  totalPages = 1,
  onPageChange,
  emptyMessage = 'No records found',
}) => {
  if (loading) {
    return (
      <div className="bg-[#142318] border border-gold-400/30 rounded-xl p-12 shadow-xl shadow-black/40">
        <LoadingSpinner label="Loading records..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-[#142318] border border-gold-400/30 rounded-xl p-8 shadow-xl shadow-black/40">
        <EmptyState title="No Records" description={emptyMessage} />
      </div>
    );
  }

  return (
    <div className="bg-[#142318] border border-gold-400/30 rounded-xl shadow-xl shadow-black/40 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-ivory/80 font-sans">
          <thead className="bg-[#18281d] border-b border-gold-500/20 text-[10px] uppercase tracking-luxury text-gold-400 font-semibold">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`py-3.5 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-500/15">
            {data.map((row, rowIdx) => (
              <tr key={row._id || rowIdx} className="hover:bg-[#18281d]/60 transition-colors">
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`py-3.5 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
                  >
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="p-4 border-t border-gold-500/20 bg-[#18281d]/40 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default DataTable;
