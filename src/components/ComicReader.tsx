import React, { useEffect, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

interface ComicReaderProps {
  classNumber: number;
  chapterNumber: number;
}

// Dynamically import all images in src/curriculum
const imageModules = import.meta.glob(['/src/curriculum/**/*.png', '/src/curriculum/**/*.webp'], { eager: true });

const ComicReader: React.FC<ComicReaderProps> = ({ classNumber, chapterNumber }) => {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 550, height: 750 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 1. Resolve folder path pattern
    // The directory is src/curriculum/class [X]/chapter [Y]/
    const folderPrefix = `/src/curriculum/class ${classNumber}/chapter ${chapterNumber}/`;

    // 2. Filter images matching the path prefix
    const matchedKeys = Object.keys(imageModules).filter((key) =>
      key.startsWith(folderPrefix)
    );

    // 3. Sort numerically (extract filename digit before .png)
    const sortedPages = matchedKeys.sort((a, b) => {
      const numA = parseInt(a.substring(a.lastIndexOf('/') + 1, a.lastIndexOf('.')), 10);
      const numB = parseInt(b.substring(b.lastIndexOf('/') + 1, b.lastIndexOf('.')), 10);
      return numA - numB;
    }).map((key) => {
      const module = imageModules[key] as { default: string } | string;
      return typeof module === 'string' ? module : module.default;
    });

    setPages(sortedPages);
    setLoading(false);
  }, [classNumber, chapterNumber]);

  useEffect(() => {
    const handleResize = () => {
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;
      const mobile = viewportW < 768;
      setIsMobile(mobile);

      // single page aspect ratio (width / height) - actual comic images are 1536x2752
      const aspectRatio = 1536 / 2752; // ≈ 0.558

      // Budgets: leave very small margins (e.g. 16px/32px) and reserve space for headers (120px)
      const maxW = viewportW - (mobile ? 16 : 32);
      const maxH = viewportH - 130; 

      let singlePageW = 0;
      let bookH = 0;

      if (mobile) {
        // Single page mode: occupies full width or matches height budget
        const wLimit = maxW;
        const hLimit = wLimit / aspectRatio;
        if (hLimit > maxH) {
          bookH = maxH;
          singlePageW = maxH * aspectRatio;
        } else {
          singlePageW = wLimit;
          bookH = hLimit;
        }
      } else {
        // Double page spread mode: both pages must fit in maxW, height in maxH
        const wLimit = maxW / 2;
        const hLimit = wLimit / aspectRatio;
        if (hLimit > maxH) {
          bookH = maxH;
          singlePageW = maxH * aspectRatio;
        } else {
          singlePageW = wLimit;
          bookH = hLimit;
        }
      }

      setDimensions({
        width: Math.max(280, Math.floor(singlePageW)),
        height: Math.max(380, Math.floor(bookH))
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400 font-bold">
        <div className="animate-pulse flex space-x-2 items-center">
          <div className="w-3.5 h-3.5 bg-cyan-400 rounded-full animate-bounce"></div>
          <span>Loading Comic Pages...</span>
        </div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="p-8 text-center text-red-400 font-bold border border-red-500/20 bg-red-500/5 rounded-xl">
        📖 No comic pages found for Class {classNumber}, Chapter {chapterNumber}.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full select-none">
      <div className="relative shadow-2xl rounded-xl overflow-hidden bg-slate-950 p-1 border border-white/5 max-w-full">
        {/* @ts-ignore */}
        <HTMLFlipBook
          width={dimensions.width}
          height={dimensions.height}
          size="stretch"
          minWidth={280}
          maxWidth={1200}
          minHeight={380}
          maxHeight={1600}
          drawShadow={true}
          maxShadowOpacity={0.4}
          showCover={true}
          mobileScrollSupport={true}
          className="mx-auto"
          style={{}}
          startPage={0}
          flippingTime={1000}
          useMouseEvents={true}
          swipeDistance={30}
          // @ts-ignore
          showDoublePage={!isMobile}
          // @ts-ignore
          usePortrait={isMobile}
          startZIndex={0}
          autoSize={true}
          // @ts-ignore
          clickEventForward={true}
        >
          {pages.map((src, index) => (
            <div key={index} className="bg-slate-900 flex items-center justify-center h-full w-full relative">
              <img
                src={src}
                alt={`Page ${index + 1}`}
                className="w-full h-full object-contain pointer-events-none"
                loading="lazy"
              />
              <span className="absolute bottom-2 right-4 text-[10px] text-white/30 font-bold bg-black/40 px-2 py-0.5 rounded">
                Page {index + 1}
              </span>
            </div>
          ))}
        </HTMLFlipBook>
      </div>
      <p className="mt-2 text-[10px] md:text-xs font-semibold text-slate-400">
        💡 Drag corners or click edges to turn pages
      </p>
    </div>
  );
};

export default ComicReader;
