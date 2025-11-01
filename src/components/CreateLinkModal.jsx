import React, { useState } from 'react';
import { X } from 'lucide-react';
import { isValidUrl } from '../utils/urlValidator';

const CreateLinkModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    longUrl: '',
    heading: '',
    description: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    
    if (!formData.longUrl.trim()) {
      setError('Long URL is required');
      return;
    }
    
    // if (!isValidUrl(formData.longUrl)) {
    //   setError('Please enter a valid URL (must start with http:// or https://)');
    //   return;
    // }
    
    if (!formData.heading.trim()) {
      setError('Heading is required');
      return;
    }
    
    onSubmit(formData);
    setFormData({ longUrl: '', heading: '', description: '' });
  };

  const handleClose = () => {
    setFormData({ longUrl: '', heading: '', description: '' });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-[#0b2030] rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-gray-100">Create Short Link</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Long URL <span className="text-rose-300">*</span>
            </label>
            <input
              type="text"
              name="longUrl"
              value={formData.longUrl}
              onChange={handleChange}
              placeholder="https://example.com/my-long-url"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[#061226] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Heading <span className="text-rose-300">*</span>
            </label>
            <input
              type="text"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              placeholder="My Awesome Link"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[#061226] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a description for this link..."
              rows="3"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[#061226] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none disabled:opacity-50"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-400/10 border border-rose-400/40 rounded-lg">
              <p className="text-sm text-rose-300">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-gray-100 rounded-lg font-medium transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-gray-100 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLinkModal;
