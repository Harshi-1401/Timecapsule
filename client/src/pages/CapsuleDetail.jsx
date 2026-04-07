import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { capsuleAPI } from '../services/api';
import toast from 'react-hot-toast';

// ── Media Modal ────────────────────────────────────────────────────────────────
const MediaModal = ({ capsule, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <div
      className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-4"
      onClick={e => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold leading-none"
      >
        ✕
      </button>

      <div className="mt-4">
        {capsule.mediaType === 'image' && (
          <img src={capsule.mediaUrl} alt="Capsule media" className="w-full rounded-xl" />
        )}
        {capsule.mediaType === 'video' && (
          <video controls autoPlay className="w-full rounded-xl" src={capsule.mediaUrl} />
        )}
        {capsule.mediaType === 'audio' && (
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-3 text-center">{capsule.mediaFilename}</p>
            <audio controls autoPlay className="w-full" src={capsule.mediaUrl} />
          </div>
        )}
        {capsule.mediaType === 'file' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <span className="text-6xl">📄</span>
            <p className="text-gray-700 font-medium">{capsule.mediaFilename || 'File'}</p>
            <a
              href={capsule.mediaUrl}
              download={capsule.mediaFilename || 'download'}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
            >
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  </div>
);

// ── Main Page ──────────────────────────────────────────────────────────────────
const CapsuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  const [showMedia, setShowMedia] = useState(false);

  useEffect(() => { fetchCapsule(); }, [id]);

  useEffect(() => {
    if (capsule && !capsule.isUnlocked) {
      const timer = setInterval(() => {
        const now = Date.now();
        const unlockTime = new Date(normalizeDate(capsule.unlockDate)).getTime();
        const distance = unlockTime - now;

        if (distance < 0) {
          setTimeLeft('Unlocking soon...');
          clearInterval(timer);
          fetchCapsule();
        } else {
          const d = Math.floor(distance / 86400000);
          const h = Math.floor((distance % 86400000) / 3600000);
          const m = Math.floor((distance % 3600000) / 60000);
          const s = Math.floor((distance % 60000) / 1000);
          setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [capsule]);

  const fetchCapsule = async () => {
    try {
      const response = await capsuleAPI.getOne(id);
      setCapsule(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load capsule');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this capsule?')) {
      try {
        await capsuleAPI.delete(id);
        toast.success('Capsule deleted');
        navigate('/dashboard');
      } catch {
        toast.error('Failed to delete capsule');
      }
    }
  };

  const normalizeDate = (date) =>
    typeof date === 'string' && !date.endsWith('Z') && !date.includes('+')
      ? date + 'Z'
      : date;

  const formatDate = (date) =>
    new Date(normalizeDate(date)).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const mediaIcon = { image: '🖼️', video: '🎬', audio: '🎵', file: '📄' };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-600" />
    </div>
  );

  if (!capsule) return null;

  return (
    <>
      {showMedia && capsule.mediaUrl && (
        <MediaModal capsule={capsule} onClose={() => setShowMedia(false)} />
      )}

      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Back link */}
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 mb-6">
            ← Back to Dashboard
          </Link>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">

            {/* Header strip */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">{capsule.title}</h1>
                  <p className="text-xs text-gray-400 mt-1">Created {formatDate(capsule.createdAt)}</p>
                </div>
                <span className="text-3xl shrink-0">{capsule.isUnlocked ? '✅' : '🔐'}</span>
              </div>

              {/* Badges */}
              <div className="flex gap-2 mt-3">
                {capsule.isPublic && (
                  <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 rounded-full px-2.5 py-0.5">🌍 Public</span>
                )}
                {capsule.isEncrypted && (
                  <span className="text-xs bg-yellow-50 text-yellow-600 border border-yellow-100 rounded-full px-2.5 py-0.5">🔒 Encrypted</span>
                )}
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">

              {/* Unlock status */}
              {capsule.isUnlocked ? (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="text-sm font-semibold text-green-800">Capsule Unlocked</p>
                    <p className="text-xs text-green-600">on {formatDate(capsule.unlockDate)}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-4 text-center">
                  <p className="text-xs font-medium text-purple-500 uppercase tracking-wide mb-1">Time Until Unlock</p>
                  <p className="text-3xl font-bold text-purple-700 tabular-nums">{timeLeft}</p>
                  <p className="text-xs text-purple-500 mt-1">Unlocks on {formatDate(capsule.unlockDate)}</p>
                </div>
              )}

              {/* Message */}
              {capsule.isUnlocked && capsule.message && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Message</p>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-xl px-4 py-3">
                    {capsule.message}
                  </p>
                </div>
              )}

              {/* Media */}
              {capsule.isUnlocked && capsule.mediaUrl && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Attachment</p>
                  <button
                    onClick={() => setShowMedia(v => !v)}
                    className="flex items-center gap-2 text-sm font-medium text-purple-600 border border-purple-200 bg-purple-50 hover:bg-purple-100 rounded-xl px-4 py-2.5 transition"
                  >
                    <span>{mediaIcon[capsule.mediaType] || '📎'}</span>
                    <span>{showMedia ? 'Hide Media' : 'View Media'}</span>
                    {capsule.mediaFilename && (
                      <span className="text-xs text-gray-400 font-normal truncate max-w-[160px]">
                        — {capsule.mediaFilename}
                      </span>
                    )}
                  </button>

                  {/* Inline preview (toggle) */}
                  {showMedia && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-gray-100 transition-all">
                      {capsule.mediaType === 'image' && (
                        <img src={capsule.mediaUrl} alt="media" className="w-full object-contain max-h-80" />
                      )}
                      {capsule.mediaType === 'video' && (
                        <video controls className="w-full max-h-80" src={capsule.mediaUrl} />
                      )}
                      {capsule.mediaType === 'audio' && (
                        <div className="p-4 bg-gray-50">
                          <audio controls className="w-full" src={capsule.mediaUrl} />
                        </div>
                      )}
                      {capsule.mediaType === 'file' && (
                        <div className="flex items-center gap-3 p-4 bg-gray-50">
                          <span className="text-3xl">📄</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{capsule.mediaFilename}</p>
                          </div>
                          <a
                            href={capsule.mediaUrl}
                            download={capsule.mediaFilename || 'download'}
                            className="text-sm text-purple-600 hover:text-purple-800 font-medium shrink-0"
                          >
                            Download
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Legacy media notice */}
              {capsule.isUnlocked && capsule.hasLegacyMedia && !capsule.mediaUrl && (
                <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
                  📎 This capsule had a {capsule.mediaType} attachment that is no longer available.
                </div>
              )}

              {/* Locked state */}
              {!capsule.isUnlocked && (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">🔒</div>
                  <p className="text-sm">Content will be revealed when this capsule unlocks.</p>
                </div>
              )}
            </div>

            {/* Footer / delete */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">Unlocks {formatDate(capsule.unlockDate)}</p>
              <button
                onClick={handleDelete}
                className="text-xs text-red-500 hover:text-red-700 font-medium transition"
              >
                Delete Capsule
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default CapsuleDetail;
