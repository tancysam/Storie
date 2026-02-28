import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import Button from '../common/Button';

export default function StorytimeMode({ storybook, pages }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sortedPages = [...pages].sort((a, b) => a.page_number - b.page_number);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentPage < sortedPages.length - 1) {
        setCurrentPage(prev => prev + 1);
      }
    },
    onSwipedRight: () => {
      if (currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      }
    },
    trackMouse: true,
  });

  const goToPage = (index) => {
    setCurrentPage(index);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const currentPageData = sortedPages[currentPage];

  if (!currentPageData) {
    return <div className="text-center py-12">No pages to display</div>;
  }

  return (
    <div 
      {...handlers}
      className="min-h-screen bg-gradient-to-b from-emerald-950 to-emerald-900 relative overflow-hidden"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/50 to-transparent">
        <div className="text-white">
          <h1 className="text-xl font-bold">{storybook.title}</h1>
          <p className="text-sm opacity-80">for {storybook.child_name}</p>
        </div>
        <Button variant="ghost" onClick={toggleFullscreen} className="text-white">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </Button>
      </div>

      {/* Main Story View */}
      <div className="relative min-h-screen flex items-center justify-center p-4 pt-20 pb-24">
        <div className="relative w-full max-w-4xl aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
          {/* Background Image */}
          <img
            src={currentPageData.image_url}
            alt={`Page ${currentPage + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Text Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <span className="text-amber-300 text-sm font-semibold uppercase tracking-wide mb-2 block">
              {currentPageData.act_title}
            </span>
            <p className="text-white text-lg md:text-xl lg:text-2xl leading-relaxed font-storybook">
              {currentPageData.text_content}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {currentPage > 0 && (
        <button
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {currentPage < sortedPages.length - 1 && (
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Page Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {sortedPages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToPage(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentPage 
                ? 'bg-white' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Swipe Hint */}
      <div className="absolute bottom-12 left-0 right-0 text-center text-white/60 text-sm">
        Swipe or use arrows to navigate
      </div>
    </div>
  );
}
