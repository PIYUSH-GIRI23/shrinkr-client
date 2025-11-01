import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const DeleteAccountModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-[#0b2030] rounded-2xl shadow-2xl w-full max-w-md border border-red-500">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-500" size={24} />
            <h2 className="text-2xl font-bold text-white">Delete Account</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4">
            <p className="text-red-400 font-medium mb-2">⚠️ Warning: This action cannot be undone!</p>
            <p className="text-gray-300 text-sm">
              Deleting your account will permanently remove:
            </p>
            <ul className="list-disc list-inside text-gray-300 text-sm mt-2 space-y-1">
              <li>Your profile and account information</li>
              <li>All your shortened links</li>
              <li>All analytics and click data</li>
            </ul>
          </div>

          <p className="text-gray-400 text-sm">
            Are you absolutely sure you want to delete your account?
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Deleting...' : 'Yes, Delete My Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
