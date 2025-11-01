import React, { useState } from 'react';
import { X, Search as SearchIcon } from 'lucide-react';
import { getFullUrl } from '../controller/linkController';
import { isSecureUrl } from '../utils/urlValidator';
import { toast } from 'react-toastify';

const GetLinkInfoModal = ({ isOpen, onClose }) => {
  const [shortCode, setShortCode] = useState('');
  const [linkInfo, setLinkInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!shortCode.trim()) {
      setError('Please enter a short code');
      return;
    }

    if (shortCode.length !== parseInt(import.meta.env.VITE_SHORT_CODE_LENGTH)) {
      setError(`Short code must be ${import.meta.env.VITE_SHORT_CODE_LENGTH} characters long`);
      return;
    }

    setIsLoading(true);
    setError('');
    setLinkInfo(null);

    try {
      const data = await getFullUrl(shortCode);
      console.log(data);
      setLinkInfo(data);
      toast.success('Link information fetched!');
    } catch (err) {
      setError(err.message || 'Failed to fetch link information');
      toast.error(err.message || 'Failed to fetch link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShortCode('');
    setLinkInfo(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  const isSecure = linkInfo && isSecureUrl(linkInfo.longUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-[#0b2030] rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-gray-100">Get Link Info</h2>
          <button
            onClick={handleClose}
            className="text-gray-300 hover:text-gray-100 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSearch} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter Short Code (8 characters)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shortCode}
                onChange={(e) => {
                  setShortCode(e.target.value);
                  setError('');
                }}
                placeholder="e.g., q1hExQEV"
                maxLength={8}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-[#061226] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-gray-100 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <SearchIcon size={20} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-400/10 border border-rose-400/40 rounded-lg">
              <p className="text-sm text-rose-300">{error}</p>
            </div>
          )}

          {linkInfo && (
            <div className="space-y-3 mt-4 p-4 bg-[#061226] border border-gray-700 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">SHORT URL</label>
                <a
                  href={`${window.location.origin}/${linkInfo.shortCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm break-all"
                >
                  {window.location.origin}/{linkInfo.shortCode}
                </a>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">DESTINATION URL</label>
                <a
                  href={linkInfo.longUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm break-all"
                >
                  {linkInfo.longUrl}
                </a>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">SECURITY</label>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isSecure ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  <span className={`text-sm ${isSecure ? 'text-green-400' : 'text-yellow-400'}`}>
                    {isSecure ? 'Secure (HTTPS)' : 'Not Secure (HTTP)'}
                  </span>
                </div>
              </div>

            
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-gray-100 rounded-lg font-medium transition"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GetLinkInfoModal;
