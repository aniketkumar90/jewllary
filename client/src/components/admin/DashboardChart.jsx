import React from 'react';
import { formatPrice } from '../../utils/formatters';

const DashboardChart = ({ title, subtitle, data = [] }) => {
  // If data is empty, display simulated 6-month luxury sales trend
  const chartData = data.length > 0 ? data : [
    { label: 'Apr', revenue: 420000, orders: 4 },
    { label: 'May', revenue: 580000, orders: 6 },
    { label: 'Jun', revenue: 890000, orders: 8 },
    { label: 'Jul', revenue: 1120000, orders: 11 },
    { label: 'Aug', revenue: 950000, orders: 9 },
    { label: 'Sep', revenue: 1480000, orders: 14 },
  ];

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue || 1));

  return (
    <div className="bg-[#142318] border border-gold-400/30 rounded-xl p-6 shadow-xl shadow-black/40 text-left">
      <div className="flex items-center justify-between pb-6 border-b border-gold-500/20 mb-6">
        <div>
          <h3 className="font-serif text-lg text-ivory font-normal">
            {title || 'Sales & Revenue Trajectory'}
          </h3>
          {subtitle && <p className="text-xs text-ivory/60 mt-0.5 font-light">{subtitle}</p>}
        </div>
        <span className="text-[10px] uppercase tracking-luxury text-gold-300 bg-gold-500/15 border border-gold-400/35 px-2.5 py-1 font-semibold rounded">
          High Jewellery Trend
        </span>
      </div>

      {/* Bar Chart Visualizer */}
      <div className="h-64 flex items-end justify-between gap-4 pt-4 px-2">
        {chartData.map((item, index) => {
          const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-[#09100a] text-gold-300 border border-gold-400/40 px-2 py-1 pointer-events-none rounded whitespace-nowrap shadow-xl mb-1 font-mono">
                {formatPrice(item.revenue)} ({item.orders} Orders)
              </div>

              {/* Bar */}
              <div className="w-full max-w-[48px] bg-[#18281d] border border-gold-500/20 rounded-t relative overflow-hidden h-44 flex items-end">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-gradient-to-t from-gold-600 to-gold-400 rounded-t transition-all duration-700 ease-out group-hover:brightness-125 shadow-md"
                />
              </div>

              {/* Month Label */}
              <span className="text-xs text-gold-300/80 font-medium mt-1 font-mono">
                {item.label || item._id?.month || `M${index + 1}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardChart;
