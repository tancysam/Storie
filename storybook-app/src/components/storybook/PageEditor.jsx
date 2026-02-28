import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

export default function PageEditor({ 
  page, 
  onRegenerateImage, 
  onRegenerateText,
  isRegenerating 
}) {
  const isRegeneratingImage = isRegenerating === `image-${page.id}`;
  const isRegeneratingText = isRegenerating === `text-${page.id}`;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative aspect-[4/3] bg-gray-100">
        {page.image_url ? (
          <img
            src={page.image_url}
            alt={`Page ${page.page_number}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {isRegeneratingImage && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
            {page.act_title}
          </span>
          <span className="text-xs text-gray-400">Page {page.page_number}</span>
        </div>

        <div className="min-h-[80px] mb-4">
          {isRegeneratingText ? (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner size="sm" />
            </div>
          ) : (
            <p className="text-gray-700 text-sm leading-relaxed font-storybook">
              {page.text_content}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onRegenerateImage(page.id)}
            disabled={isRegeneratingImage || isRegeneratingText}
            className="flex-1"
          >
            New Image
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onRegenerateText(page.id)}
            disabled={isRegeneratingImage || isRegeneratingText}
            className="flex-1"
          >
            New Text
          </Button>
        </div>
      </div>
    </div>
  );
}
