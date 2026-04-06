import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { capsuleAPI } from '../services/api';
import toast from 'react-hot-toast';

const CreateCapsule = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    unlockDate: '',
    isPublic: false,
    isEncrypted: false
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File too large. Maximum size is 5MB.');
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate unlock date
    const unlockDate = new Date(formData.unlockDate);
    if (unlockDate <= new Date()) {
      toast.error('Unlock date must be in the future');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('message', formData.message);
      // Convert local datetime to UTC ISO string so backend stores correct time
      data.append('unlockDate', new Date(formData.unlockDate).toISOString());
      data.append('isPublic', formData.isPublic);
      data.append('isEncrypted', formData.isEncrypted);
      
      if (file) {
        data.append('media', file);
      }

      console.log('📤 Sending capsule data:', {
        title: formData.title,
        message: formData.message,
        unlockDate: formData.unlockDate,
        isPublic: formData.isPublic,
        isEncrypted: formData.isEncrypted,
        hasFile: !!file
      });

      await capsuleAPI.create(data);
      toast.success('Time capsule created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Capsule creation error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create capsule';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (current time + 1 minute for testing)
  const getMinDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Time Capsule</h1>
            <p className="text-gray-600">Preserve your memories for the future</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capsule Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength="100"
                className="input-field"
                placeholder="My Future Self Letter"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                maxLength="5000"
                className="input-field resize-none"
                placeholder="Write your message to the future..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.message.length}/5000 characters
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media File (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="*/*"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">📎</div>
                  <p className="text-gray-600 mb-1">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Images, videos, audio, documents (max 5MB)
                  </p>
                </label>
              </div>
            </div>

            {/* Unlock Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unlock Date & Time *
              </label>
              <input
                type="datetime-local"
                name="unlockDate"
                value={formData.unlockDate}
                onChange={handleChange}
                required
                min={getMinDate()}
                className="input-field"
              />
              <p className="text-sm text-gray-500 mt-1">
                Choose when this capsule should unlock (minimum: 1 minute from now)
              </p>
            </div>

            {/* Options */}
            <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  id="isPublic"
                />
                <label htmlFor="isPublic" className="ml-3">
                  <span className="text-gray-900 font-medium">Make Public</span>
                  <p className="text-sm text-gray-600">
                    Allow others to view this capsule after it unlocks
                  </p>
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isEncrypted"
                  checked={formData.isEncrypted}
                  onChange={handleChange}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  id="isEncrypted"
                />
                <label htmlFor="isEncrypted" className="ml-3">
                  <span className="text-gray-900 font-medium">Encrypt Content 🔒</span>
                  <p className="text-sm text-gray-600">
                    Add extra security with AES-256 encryption
                  </p>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : '🕰️ Create Time Capsule'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCapsule;
