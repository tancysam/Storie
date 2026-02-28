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
      className={`min-h-screen bg-retro-dark relative overflow-hidden ${isFullscreen ? 'flex flex-col' : ''}`}
    >
      {/* Header */}
      <div className={`${isFullscreen ? 'bg-retro-paper border-b-3 border-retro-dark' : 'absolute top-0 left-0 right-0 bg-gradient-to-b from-retro-dark/90 to-transparent'} p-4 flex justify-between items-center z-20`}>
        <div className="text-retro-dark">
          <h1 className="text-xl font-display font-bold truncate">{storybook.title}</h1>
          <p className="text-sm font-retro text-retro-brown">for {storybook.child_name}</p>
        </div>
        <Button variant="ghost" onClick={toggleFullscreen} className="text-retro-dark border-retro-dark">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </Button>
      </div>

      {/* Main Story View */}
      {isFullscreen ? (
        // Fullscreen layout: image above, text below
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Image Section */}
          <div className="flex-1 relative overflow-hidden">
            <img
              src={currentPageData.image_url}
              alt={`Page ${currentPage + 1}`}
              className="w-full h-full object-contain bg-retro-dark"
            />
          </div>

          {/* Text Section - White box below */}
          <div className="bg-retro-paper border-t-3 border-retro-dark p-4 md:p-6 max-h-[40vh] overflow-y-auto">
            <span className="text-retro-gold text-sm font-retro font-semibold uppercase tracking-widest mb-2 block">
              {currentPageData.act_title}
            </span>
            <p className="text-retro-dark text-lg md:text-xl leading-relaxed font-storybook">
              {currentPageData.text_content}
            </p>
          </div>

          {/* Page Indicators - Inside text area */}
          <div className="bg-retro-paper pb-4 flex justify-center gap-3">
            {sortedPages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`w-4 h-4 border-2 border-retro-dark transition-colors ${
                  index === currentPage 
                    ? 'bg-retro-rust border-retro-rust' 
                    : 'bg-transparent hover:bg-retro-sepia'
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        // Normal layout: overlay style
        <div className="relative min-h-screen flex items-center justify-center p-4 pt-20 pb-24">
          <div className="relative w-full max-w-4xl aspect-[4/3] border-3 border-retro-dark shadow-retro-lg overflow-hidden">
            {/* Background Image */}
            <img
              src={currentPageData.image_url}
              alt={`Page ${currentPage + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Text Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-retro-dark/90 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-retro-paper/95 border-t-3 border-retro-dark">
              <span className="text-retro-gold text-sm font-retro font-semibold uppercase tracking-widest mb-2 block">
                {currentPageData.act_title}
              </span>
              <p className="text-retro-dark text-lg md:text-xl lg:text-2xl leading-relaxed font-storybook">
                {currentPageData.text_content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      {currentPage > 0 && (
        <button
          onClick={() => setCurrentPage(prev => prev - 1)}
          className={`absolute left-4 top-1/2 -translate-y-1/2 bg-retro-paper border-3 border-retro-dark text-retro-dark p-3 hover:bg-retro-sepia transition-colors z-10 ${isFullscreen ? 'top-[calc(50%-10vh)]' : ''}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {currentPage < sortedPages.length - 1 && (
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          className={`absolute right-4 top-1/2 -translate-y-1/2 bg-retro-paper border-3 border-retro-dark text-retro-dark p-3 hover:bg-retro-sepia transition-colors z-10 ${isFullscreen ? 'top-[calc(50%-10vh)]' : ''}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Page Indicators for normal mode */}
      {!isFullscreen && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-10">
          {sortedPages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`w-4 h-4 border-2 border-retro-cream transition-colors ${
                index === currentPage 
                  ? 'bg-retro-rust border-retro-rust' 
                  : 'bg-transparent hover:bg-retro-sepia'
              }`}
            />
          ))}
        </div>
      )}

      {/* Swipe Hint - only in normal mode */}
      {!isFullscreen && (
        <div className="absolute bottom-12 left-0 right-0 text-center text-retro-cream/60 text-sm font-retro">
          Swipe or use arrows to navigate
        </div>
      )}
    </div>
  );
}
