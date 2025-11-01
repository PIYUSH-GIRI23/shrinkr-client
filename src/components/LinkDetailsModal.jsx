import React, { useState, useRef, useEffect } from 'react';
import { X, ExternalLink, Copy, Check, Shield, ShieldAlert, Calendar, MousePointerClick } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { formatDate } from '../utils/dateUtils';
import { isSecureUrl } from '../utils/urlValidator';
import { toast } from 'react-toastify';

const LinkDetailsModal = ({ isOpen, onClose, link }) => {
  const [activeTab, setActiveTab] = useState('details'); 
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const qrContainerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setActiveTab('details');
      setCopied(false);
      setCopiedField(null);
    }
  }, [isOpen]);

  if (!isOpen || !link) return null;

  const isSecure = isSecureUrl(link.longUrl);

  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopiedField(label);
      toast.success(`${label} copied to clipboard!`);
      setTimeout(() => {
        setCopied(false);
        setCopiedField(null);
      }, 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const handleClose = () => {
    setActiveTab('details');
    setCopied(false);
    setCopiedField(null);
    onClose();
  };

  const downloadQrAsPng = async () => {
    try {
      if (!qrContainerRef.current) {
        toast.error('QR code not found!');
        return;
      }

      const svg = qrContainerRef.current.querySelector('svg');
      if (!svg) {
        toast.error('QR code SVG not found!');
        return;
      }

      const svgData = new XMLSerializer().serializeToString(svg);


      const svgBlob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${svgData}`], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      
      const img = new Image();
      img.crossOrigin = 'anonymous'; 
      img.onload = () => {
      
        const scale = 8;
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              toast.error('Failed to create PNG');
              URL.revokeObjectURL(url);
              return;
            }
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = `qr-${link.shortCode || Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();

           
            URL.revokeObjectURL(pngUrl);
            URL.revokeObjectURL(url);

            toast.success('QR Code downloaded!');
          },
          'image/png',
          1.0
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        toast.error('Failed to render QR image!');
      };

      img.src = url;
    } catch (err) {
      console.error(err);
      toast.error('Failed to download QR code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-[#0b2030] rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Link Details</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-4 text-center font-medium transition ${activeTab === 'details' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-4 text-center font-medium transition ${activeTab === 'edit' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            Full Info
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-4 text-center font-medium transition ${activeTab === 'qr' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            QR Code
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'details' ? (
            <div className="space-y-6">
           
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{link.heading}</h3>
                {link.description && <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{link.description}</p>}
              </div>

             
              <div className="flex items-center gap-2">
                {isSecure ? (
                  <>
                    <Shield className="text-green-400" size={20} />
                    <span className="text-sm text-green-400 font-medium">Secure URL (HTTPS)</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="text-yellow-400" size={20} />
                    <span className="text-sm text-yellow-400 font-medium">Not Secure (HTTP)</span>
                  </>
                )}
              </div>

              
              <div className="bg-[#061226] border border-gray-700 rounded-lg p-4">
                <label className="block text-xs font-medium text-gray-400 mb-2">SHORT URL</label>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-blue-400 font-mono text-sm break-all">{link.shortUrl}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(link.shortUrl, 'Short URL')}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                      title="Copy"
                    >
                      {copied && copiedField === 'Short URL' ? <Check size={18} className="text-green-400" /> : <Copy size={18} className="text-gray-300" />}
                    </button>
                    <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition" title="Visit">
                      <ExternalLink size={18} className="text-gray-300" />
                    </a>
                  </div>
                </div>
              </div>

             
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#061226] border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="text-gray-400" size={18} />
                    <label className="text-xs font-medium text-gray-400">CREATED</label>
                  </div>
                  <p className="text-white text-sm">{formatDate(new Date(link.createdAt).getTime())}</p>
                </div>

                <div className="bg-[#061226] border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MousePointerClick className="text-gray-400" size={18} />
                    <label className="text-xs font-medium text-gray-400">CLICKS</label>
                  </div>
                  <p className="text-white text-2xl font-bold">{link.clickCount || 0}</p>
                </div>
              </div>
            </div>
          ) : activeTab === 'edit' ? (
            <div className="space-y-4">
              <div className="bg-[#061226] border border-gray-700 rounded-lg p-4">
                <label className="block text-xs font-medium text-gray-400 mb-2">HEADING</label>
                <p className="text-white font-medium text-lg">{link.heading}</p>
              </div>

              <div className="bg-[#061226] border border-gray-700 rounded-lg p-4">
                <label className="block text-xs font-medium text-gray-400 mb-2">DESCRIPTION</label>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{link.description || 'No description provided'}</p>
              </div>

              <div className="bg-[#061226] border border-gray-700 rounded-lg p-4">
                <label className="block text-xs font-medium text-gray-400 mb-2">SHORT URL</label>
                <div className="flex items-center justify-between gap-3">
                  <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-mono text-sm break-all">
                    {link.shortUrl}
                  </a>
                  <button onClick={() => handleCopy(link.shortUrl, 'Short URL')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition shrink-0" title="Copy">
                    {copied && copiedField === 'Short URL' ? <Check size={18} className="text-green-400" /> : <Copy size={18} className="text-gray-300" />}
                  </button>
                </div>
              </div>

              <div className="bg-[#061226] border border-gray-700 rounded-lg p-4">
                <label className="block text-xs font-medium text-gray-400 mb-2">DESTINATION URL</label>
                <div className="flex items-center justify-between gap-3">
                  <a href={link.longUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm break-all">
                    {link.longUrl}
                  </a>
                  <button onClick={() => handleCopy(link.longUrl, 'Destination URL')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition shrink-0" title="Copy">
                    <Copy size={18} className="text-gray-300" />
                  </button>
                </div>
              </div>

              <div className="bg-[#061226] border border-gray-700 rounded-lg p-4">
                <label className="block text-xs font-medium text-gray-400 mb-2">SHORT CODE</label>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white font-mono text-lg break-all">{link.shortCode}</span>
                  <button
                    onClick={() => handleCopy(link.shortCode, 'Short Code')}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition shrink-0 flex items-center gap-2"
                    title="Copy short code"
                    aria-label="Copy short code"
                  >
                    {copied && copiedField === 'Short Code' ? (
                      <Check size={18} className="text-green-400" />
                    ) : (
                      <Copy size={18} className="text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#061226] border border-gray-700 rounded-lg p-4">
                  <label className="block text-xs font-medium text-gray-400 mb-2">CREATED</label>
                  <p className="text-white text-sm">{formatDate(new Date(link.createdAt).getTime())}</p>
                </div>

                <div className="bg-[#061226] border border-gray-700 rounded-lg p-4">
                  <label className="block text-xs font-medium text-gray-400 mb-2">CLICKS</label>
                  <p className="text-white text-2xl font-bold">{link.clickCount || 0}</p>
                </div>
              </div>

              <div className="bg-[#061226] border border-gray-700 rounded-lg p-4">
                <label className="block text-xs font-medium text-gray-400 mb-2">SECURITY STATUS</label>
                <div className="flex items-center gap-2">
                  {isSecure ? (
                    <>
                      <Shield className="text-green-400" size={20} />
                      <span className="text-sm text-green-400 font-medium">Secure (HTTPS)</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="text-yellow-400" size={20} />
                      <span className="text-sm text-yellow-400 font-medium">Not Secure (HTTP)</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // QR Tab
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="bg-white p-6 rounded-2xl" ref={qrContainerRef}>
                {/* QRCodeSVG renders an inline <svg> which we target for download */}
                <QRCodeSVG value={link.shortUrl} size={256} level="H" includeMargin={true} bgColor="#ffffff" fgColor="#000000" />
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Scan to Visit Link</h3>
                <p className="text-gray-400 text-sm mb-4">Point your camera at the QR code</p>

                <div className="flex items-center gap-3 justify-center">
                  <button
                    onClick={() => downloadQrAsPng()}
                    className="cursor-pointer p-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                  >
                    Download QR
                  </button>

                  <button
                    onClick={() => handleCopy(link.shortUrl, 'Short URL')}
                    className="cursor-pointer p-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition flex items-center gap-2"
                  >
                    {copied && copiedField === 'Short URL' ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-300" />}
                    <span className="text-sm">Copy Link</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-700">
          <button onClick={handleClose} className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkDetailsModal;
