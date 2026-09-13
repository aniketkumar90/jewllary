import React, { useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

// Base default collection items for the showcase
const defaultBentoItems = [
  {
    id: 'bento-1',
    title: 'Embroidered Bridal Suites',
    subtitle: 'Grace in every handcrafted curve.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop',
    link: '/jewellery?category=bridal',
  },
  {
    id: 'bento-2',
    title: 'Polki & Jadau Chokers',
    subtitle: 'Everyday royal elegance redefined.',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1000&auto=format&fit=crop',
    link: '/jewellery?category=necklaces',
  },
  {
    id: 'bento-3',
    title: 'Temple Nakshi Kadas',
    subtitle: 'Sacred repoussé heritage motifs.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
    link: '/jewellery?category=bracelets-bangles',
  },
  {
    id: 'bento-4',
    title: 'The Solitaire Dynasties',
    subtitle: 'Stories sculpted in celestial diamonds.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
    link: '/jewellery?category=rings',
  },
];

/**
 * Dynamic Repeating Process Generator:
 * 1 Vertical (Tall) -> 2 Horizontal (Stacked) -> 1 Vertical (Tall) -> 2 Horizontal (Stacked)...
 * Automatically labels sequential tags: 01 —, 02 —, 03 —, 04 —...
 */
const generateBentoColumns = (rawItems) => {
  const items = (rawItems && rawItems.length > 0 ? rawItems : defaultBentoItems).map((item, index) => ({
    ...item,
    tag: item.tag || `${String(index + 1).padStart(2, '0')} —`,
  }));

  const columns = [];
  let i = 0;
  let isVertical = true;

  while (i < items.length) {
    if (isVertical || i + 1 >= items.length) {
      // 1 Vertical Column (Tall)
      columns.push({
        type: 'vertical',
        items: [items[i]],
      });
      i += 1;
      isVertical = false;
    } else {
      // 2 Horizontal Column (Stacked)
      columns.push({
        type: 'horizontal-stacked',
        items: [items[i], items[i + 1]],
      });
      i += 2;
      isVertical = true;
    }
  }

  return columns;
};

const BannerSection = ({ banner, items = defaultBentoItems }) => {
  const scrollContainerRef = useRef(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  // Dynamically generate the repeating (1 Vertical -> 2 Horizontal) columns
  const columns = useMemo(() => generateBentoColumns(items), [items]);

  const handleMobileScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, offsetWidth } = scrollContainerRef.current;
    const itemWidth = offsetWidth * 0.84 + 16;
    const idx = Math.round(scrollLeft / itemWidth);
    setActiveMobileIndex(Math.min(Math.max(idx, 0), columns.length - 1));
  };

  const scrollToMobileCard = (idx) => {
    if (!scrollContainerRef.current) return;
    const itemWidth = scrollContainerRef.current.offsetWidth * 0.84 + 16;
    scrollContainerRef.current.scrollTo({
      left: idx * itemWidth,
      behavior: 'smooth',
    });
    setActiveMobileIndex(idx);
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#112015] py-20 lg:py-28 my-12 border-y border-gold-400/30">
      {/* Ambient Warm Sunlight Background Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,_rgba(212,175,55,0.18),_transparent_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_70%,_rgba(212,175,55,0.10),_transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-gold-400 font-semibold mb-2 block drop-shadow-sm">
            ✦ BESPOKE BRIDAL TROUSSEAU ✦
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-ivory font-normal tracking-wide leading-tight drop-shadow">
            The Pieces Our Patrons Reach For Most
          </h2>
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-4" />
        </div>

        {/* ================= DESKTOP VIEW: REPEATING (1 VERTICAL -> 2 HORIZONTAL) PATTERN ================= */}
        <div className="hidden lg:grid grid-cols-12 gap-5 xl:gap-6 items-stretch min-h-[600px]">
          {columns.map((col, colIdx) => {
            if (col.type === 'vertical') {
              const card = col.items[0];
              return (
                <div
                  key={`col-vert-${colIdx}`}
                  className="col-span-4 relative h-[600px] rounded-2xl overflow-hidden border border-gold-400/35 bg-[#142319] group shadow-2xl hover:border-gold-300/80 transition-all duration-700 flex flex-col justify-between p-8"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.75] contrast-[1.05] transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08120c]/95 via-[#08120c]/45 to-[#08120c]/25 pointer-events-none" />
                  <div className="absolute inset-2 border border-gold-400/20 rounded-xl pointer-events-none" />

                  <div className="relative z-10">
                    <span className="text-gold-400 font-mono text-xs tracking-widest block font-medium drop-shadow">
                      {card.tag}
                    </span>
                    <h3 className="text-2xl xl:text-3xl font-serif text-ivory font-normal leading-tight mt-1.5 drop-shadow-md group-hover:text-gold-200 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-ivory/80 font-sans font-light mt-1.5 max-w-[240px] leading-relaxed drop-shadow">
                      {card.subtitle}
                    </p>
                  </div>

                  <div className="relative z-10 pt-4">
                    <Link
                      to={card.link}
                      aria-label={`Explore ${card.title}`}
                      className="w-11 h-11 rounded-full bg-ivory text-forest-950 flex items-center justify-center shadow-xl hover:bg-gold-400 hover:scale-105 transition-all duration-300 group/btn"
                    >
                      <FiArrowRight className="text-base transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              );
            }

            // Horizontal Stacked Column (2 cards stacked vertically)
            const cardTop = col.items[0];
            const cardBottom = col.items[1];

            return (
              <div
                key={`col-stack-${colIdx}`}
                className="col-span-4 flex flex-col justify-between gap-5 h-[600px]"
              >
                {/* Top Card */}
                <div className="relative h-[290px] rounded-2xl overflow-hidden border border-gold-400/35 bg-[#142319] group shadow-xl hover:border-gold-300/80 transition-all duration-700 flex">
                  <div className="w-1/2 p-6 xl:p-7 flex flex-col justify-between z-10 relative">
                    <div>
                      <span className="text-gold-400 font-mono text-xs tracking-widest block font-medium">
                        {cardTop.tag}
                      </span>
                      <h3 className="text-lg xl:text-xl font-serif text-ivory font-normal leading-snug mt-1 group-hover:text-gold-200 transition-colors">
                        {cardTop.title}
                      </h3>
                      <p className="text-[11px] text-ivory/75 font-sans font-light mt-1 line-clamp-2 leading-relaxed">
                        {cardTop.subtitle}
                      </p>
                    </div>
                    <div>
                      <Link
                        to={cardTop.link}
                        aria-label={`Explore ${cardTop.title}`}
                        className="w-10 h-10 rounded-full bg-ivory text-forest-950 flex items-center justify-center shadow-lg hover:bg-gold-400 hover:scale-105 transition-all duration-300 group/btn"
                      >
                        <FiArrowRight className="text-sm transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>

                  <div className="w-1/2 relative h-full overflow-hidden">
                    <img
                      src={cardTop.image}
                      alt={cardTop.title}
                      className="w-full h-full object-cover object-center brightness-[0.82] contrast-[1.05] transition-transform duration-1000 ease-out group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#142319] via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Bottom Card */}
                <div className="relative h-[290px] rounded-2xl overflow-hidden border border-gold-400/35 bg-[#142319] group shadow-xl hover:border-gold-300/80 transition-all duration-700 flex">
                  <div className="w-1/2 p-6 xl:p-7 flex flex-col justify-between z-10 relative">
                    <div>
                      <span className="text-gold-400 font-mono text-xs tracking-widest block font-medium">
                        {cardBottom.tag}
                      </span>
                      <h3 className="text-lg xl:text-xl font-serif text-ivory font-normal leading-snug mt-1 group-hover:text-gold-200 transition-colors">
                        {cardBottom.title}
                      </h3>
                      <p className="text-[11px] text-ivory/75 font-sans font-light mt-1 line-clamp-2 leading-relaxed">
                        {cardBottom.subtitle}
                      </p>
                    </div>
                    <div>
                      <Link
                        to={cardBottom.link}
                        aria-label={`Explore ${cardBottom.title}`}
                        className="w-10 h-10 rounded-full bg-ivory text-forest-950 flex items-center justify-center shadow-lg hover:bg-gold-400 hover:scale-105 transition-all duration-300 group/btn"
                      >
                        <FiArrowRight className="text-sm transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>

                  <div className="w-1/2 relative h-full overflow-hidden">
                    <img
                      src={cardBottom.image}
                      alt={cardBottom.title}
                      className="w-full h-full object-cover object-center brightness-[0.82] contrast-[1.05] transition-transform duration-1000 ease-out group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#142319] via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= MOBILE PHONE VIEW: REPEATING DYNAMIC PEEK SLIDER ================= */}
        <div className="block lg:hidden relative w-full overflow-hidden">
          <div
            ref={scrollContainerRef}
            onScroll={handleMobileScroll}
            className="flex gap-4 overflow-x-auto scrollbar-none px-4 pb-4 pt-1 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {columns.map((col, colIdx) => {
              if (col.type === 'vertical') {
                const card = col.items[0];
                return (
                  <div
                    key={`mob-vert-${colIdx}`}
                    className="relative w-[84vw] max-w-[320px] h-[480px] flex-shrink-0 snap-center rounded-2xl overflow-hidden border border-gold-400/40 bg-[#142319] shadow-2xl flex flex-col justify-between p-6"
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.72] contrast-[1.05]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08120c]/95 via-[#08120c]/45 to-[#08120c]/25 pointer-events-none" />
                    <div className="absolute inset-1.5 border border-gold-400/20 rounded-xl pointer-events-none" />

                    <div className="relative z-10">
                      <span className="text-gold-400 font-mono text-xs tracking-widest block font-medium drop-shadow">
                        {card.tag}
                      </span>
                      <h3 className="text-2xl font-serif text-ivory font-normal leading-snug mt-1 drop-shadow">
                        {card.title}
                      </h3>
                      <p className="text-xs text-ivory/80 font-sans font-light mt-1 leading-relaxed drop-shadow">
                        {card.subtitle}
                      </p>
                    </div>

                    <div className="relative z-10 pt-4">
                      <Link
                        to={card.link}
                        aria-label={`Explore ${card.title}`}
                        className="w-10 h-10 rounded-full bg-ivory text-forest-950 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                      >
                        <FiArrowRight className="text-sm" />
                      </Link>
                    </div>
                  </div>
                );
              }

              // Horizontal Stacked Column for Mobile (BOTH items inside 1 slide frame!)
              const cardTop = col.items[0];
              const cardBottom = col.items[1];

              return (
                <div
                  key={`mob-stack-${colIdx}`}
                  className="relative w-[84vw] max-w-[320px] h-[480px] flex-shrink-0 snap-center flex flex-col justify-between gap-3.5"
                >
                  {/* Top Item */}
                  <div className="relative h-[232px] rounded-2xl overflow-hidden border border-gold-400/40 bg-[#142319] shadow-xl flex flex-col justify-between p-4 group">
                    <img
                      src={cardTop.image}
                      alt={cardTop.title}
                      className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.70] contrast-[1.05]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08120c]/95 via-[#08120c]/45 to-transparent pointer-events-none" />
                    <div className="absolute inset-1 border border-gold-400/20 rounded-xl pointer-events-none" />

                    <div className="relative z-10">
                      <span className="text-gold-400 font-mono text-[10px] tracking-widest block font-medium drop-shadow">
                        {cardTop.tag}
                      </span>
                      <h3 className="text-lg font-serif text-ivory font-normal leading-snug mt-0.5 drop-shadow">
                        {cardTop.title}
                      </h3>
                      <p className="text-[10px] text-ivory/75 font-sans font-light mt-0.5 line-clamp-1 leading-tight drop-shadow">
                        {cardTop.subtitle}
                      </p>
                    </div>

                    <div className="relative z-10 pt-2">
                      <Link
                        to={cardTop.link}
                        aria-label={`Explore ${cardTop.title}`}
                        className="w-8 h-8 rounded-full bg-ivory text-forest-950 flex items-center justify-center shadow-md active:scale-95 transition-transform"
                      >
                        <FiArrowRight className="text-xs" />
                      </Link>
                    </div>
                  </div>

                  {/* Bottom Item */}
                  <div className="relative h-[232px] rounded-2xl overflow-hidden border border-gold-400/40 bg-[#142319] shadow-xl flex flex-col justify-between p-4 group">
                    <img
                      src={cardBottom.image}
                      alt={cardBottom.title}
                      className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.70] contrast-[1.05]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08120c]/95 via-[#08120c]/45 to-transparent pointer-events-none" />
                    <div className="absolute inset-1 border border-gold-400/20 rounded-xl pointer-events-none" />

                    <div className="relative z-10">
                      <span className="text-gold-400 font-mono text-[10px] tracking-widest block font-medium drop-shadow">
                        {cardBottom.tag}
                      </span>
                      <h3 className="text-lg font-serif text-ivory font-normal leading-snug mt-0.5 drop-shadow">
                        {cardBottom.title}
                      </h3>
                      <p className="text-[10px] text-ivory/75 font-sans font-light mt-0.5 line-clamp-1 leading-tight drop-shadow">
                        {cardBottom.subtitle}
                      </p>
                    </div>

                    <div className="relative z-10 pt-2">
                      <Link
                        to={cardBottom.link}
                        aria-label={`Explore ${cardBottom.title}`}
                        className="w-8 h-8 rounded-full bg-ivory text-forest-950 flex items-center justify-center shadow-md active:scale-95 transition-transform"
                      >
                        <FiArrowRight className="text-xs" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Mobile Progress Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {columns.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToMobileCard(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === activeMobileIndex ? 'w-8 bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.7)]' : 'w-2.5 bg-gold-500/25'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default BannerSection;
