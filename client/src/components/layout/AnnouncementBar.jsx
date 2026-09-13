import React from 'react';

const AnnouncementBar = () => {
  return (
    <aside aria-label="Announcement" className="bg-[#0e0e0e] text-gold-300 text-[10px] md:text-[11px] uppercase tracking-widest py-2 px-4 border-b border-gold-500/20 text-center font-medium">
      <div className="container mx-auto flex items-center justify-center gap-6 overflow-hidden">
        <span className="hidden sm:inline">✦ Certified BIS 916 Hallmarked Gold</span>
        <span>✦ Complimentary Insured Delivery Across India</span>
        <span className="hidden md:inline">✦ Bespoke Bridal Appointments</span>
      </div>
    </aside>
  );
};

export default AnnouncementBar;
