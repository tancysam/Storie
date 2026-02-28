import { useState } from 'react';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

export default function PageEditor({ 
  page, 
  onRequestEdit,
  isRegenerating 
}) {
  const [showModal, setShowModal] = useState(false);
  const [issueType, setIssueType] = useState('image');
  const [feedback, setFeedback] = useState('');

  const handleSubmitEdit = () => {
    if (feedback.trim()) {
      onRequestEdit(page.id, issueType, feedback.trim());
      setShowModal(false);
      setFeedback('');
      setIssueType('image');
    }
  };

  const isThisPageRegenerating = isRegenerating === `image-${page.id}` || isRegenerating === `text-${page.id}`;

  return (
    <>
      <div className="bg-retro-paper border-3 border-retro-dark shadow-retro overflow-hidden hover:shadow-retro-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
        <div className="relative aspect-[4/3] bg-retro-sepia border-b-3 border-retro-dark">
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
          {isRegenerating === `image-${page.id}` && (
            <div className="absolute inset-0 bg-retro-dark/70 flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          )}
        </div>

        <div className="p-4 bg-retro-paper">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-retro font-semibold text-retro-rust uppercase tracking-widest">
              {page.act_title}
            </span>
            <span className="text-xs text-retro-brown font-retro">Page {page.page_number}</span>
          </div>

          <div className="min-h-[80px] mb-4">
            {isRegenerating === `text-${page.id}` ? (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner size="sm" />
              </div>
            ) : (
              <p className="text-retro-dark text-sm leading-relaxed font-storybook">
                {page.text_content}
              </p>
            )}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowModal(true)}
            disabled={isThisPageRegenerating}
            className="w-full"
          >
            Request Edit
          </Button>
        </div>
      </div>

      {/* Edit Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-retro-dark/80 flex items-center justify-center z-50 p-4">
          <div className="bg-retro-paper border-3 border-retro-dark shadow-retro-lg max-w-md w-full p-6">
            <h3 className="text-lg font-display font-bold text-retro-dark mb-4">Request Edit</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-retro uppercase tracking-widest text-retro-brown mb-2">
                What needs to be fixed?
              </label>
              <div className="flex gap-6">
                <label className="flex items-center font-retro text-retro-dark">
                  <input
                    type="radio"
                    name="issueType"
                    value="image"
                    checked={issueType === 'image'}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="mr-2 accent-retro-rust"
                  />
                  Image
                </label>
                <label className="flex items-center font-retro text-retro-dark">
                  <input
                    type="radio"
                    name="issueType"
                    value="text"
                    checked={issueType === 'text'}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="mr-2 accent-retro-rust"
                  />
                  Text
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-retro uppercase tracking-widest text-retro-brown mb-2">
                Describe what's wrong:
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={issueType === 'image' 
                  ? 'e.g., Make the character look friendlier, add more trees...'
                  : 'e.g., Make it shorter, add more excitement...'
                }
                rows={3}
                className="w-full px-3 py-2 bg-retro-cream border-3 border-retro-brown text-retro-dark placeholder-retro-brown/60 font-retro focus:border-retro-rust focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowModal(false);
                  setFeedback('');
                  setIssueType('image');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmitEdit}
                disabled={!feedback.trim()}
                className="flex-1"
              >
                Submit Edit
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
