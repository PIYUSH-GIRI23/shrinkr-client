import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Plus,
  Search,
  Copy,
  ExternalLink,
  Trash2,
  LogOut,
  UserX,
  Link as LinkIcon,
  Calendar,
  Filter,
  Loader,
  Info
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getDetails, deleteAccount } from '../controller/authController';
import { createLink, getPaginationLinks, deleteCode } from '../controller/linkController';
import { handleLogout } from '../utils/logout';
import { formatDate, getTimeAgo, getDateFilterTimestamp } from '../utils/dateUtils';
import { truncateText } from '../utils/urlValidator';
import CreateLinkModal from './CreateLinkModal';
import LinkDetailsModal from './LinkDetailsModal';
import DeleteAccountModal from './DeleteAccountModal';
import GetLinkInfoModal from './GetLinkInfoModal';
import noProfileImg from '../assets/no_profile.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, itemsPerPage: 10, totalPages: 1, totalItems: 0, hasNextPage: false, hasPreviousPage: false });
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showItemsPerPage, setShowItemsPerPage] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [isGetInfoModalOpen, setIsGetInfoModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      const accessToken = localStorage.getItem('shrinkr-accessToken');
      const refreshToken = localStorage.getItem('shrinkr-refreshToken');

      if (!accessToken || !refreshToken) {
        toast.error('Please log in to access dashboard');
        handleLogout(navigate);
        return;
      }

      try {
        const data = await getDetails();
        setAccountData(data.user);
      } catch (error) {
        console.error('Error fetching account details:', error);
        toast.error('Session expired. Please log in again.');
        handleLogout(navigate);
      } finally {
        setIsLoadingAccount(false);
      }
    };

    fetchAccountDetails();
  }, [navigate]);

  
  useEffect(() => {
    const fetchLinks = async () => {
      setIsLoadingLinks(true);
      try {
        const data = await getPaginationLinks(pagination.currentPage, pagination.itemsPerPage);
        setLinks(data.links || []);
        setFilteredLinks(data.links || []);
        setPagination(data.pagination || { currentPage: 1, itemsPerPage: 10, totalPages: 1, totalItems: 0, hasNextPage: false, hasPreviousPage: false });
      } catch (error) {
        console.error('Error fetching links:', error);
        toast.error('Session expired. Please log in again.');
        handleLogout(navigate);
      } finally {
        setIsLoadingLinks(false);
      }
    };
    if (!isLoadingAccount && accountData) {
      fetchLinks();
    }
  }, [isLoadingAccount, accountData, pagination.currentPage, pagination.itemsPerPage, navigate]);


    useEffect(() => {
      if (!links.length) return;

      let result = [...links];

      
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        result = result.filter(link => {
          const headingMatch = link.heading?.toLowerCase().includes(query);
          const descriptionMatch = link.description?.toLowerCase().includes(query);
          const shortCodeMatch = link.shortCode?.toLowerCase().includes(query);
          const longUrlMatch = link.longUrl?.toLowerCase().includes(query);
          return headingMatch || descriptionMatch || shortCodeMatch || longUrlMatch;
        });
      }

      // 2️⃣ Then apply Date Filter on the *already filtered* result
      if (dateFilter !== 'all') {
        const now = Date.now();
        let thresholdDays = 0;

        switch (dateFilter) {
          case '1week': thresholdDays = 7; break;
          case '2weeks': thresholdDays = 14; break;
          case '1month': thresholdDays = 30; break;
          case '3months': thresholdDays = 90; break;
          case '6months': thresholdDays = 180; break;
          case '1year': thresholdDays = 365; break;
          default: thresholdDays = 0;
        }

        if (thresholdDays > 0) {
          const cutoff = now - thresholdDays * 24 * 60 * 60 * 1000;
          result = result.filter(link => new Date(link.createdAt).getTime() >= cutoff);
        }
      }

      setFilteredLinks(result);
    }, [searchQuery, dateFilter, links]);



  const handleCreateLink = async (formData) => {
    setIsCreatingLink(true);
    try {
      const data = await createLink(formData);
      if (data && data.shortCode) {
        toast.success('Link created successfully!');
        setIsCreateModalOpen(false);
        window.location.reload();
      } else {
        toast.error('Failed to create link - invalid response');
      }
      console.log(formData);
    } catch (error) {
      console.error('Error creating link:', error);
      if (error.message.includes('token') || error.message.includes('auth')) {
        toast.error('Session expired. Please log in again.');
        handleLogout(navigate);
      } else {
        toast.error(error.message || 'Failed to create link');
      }
    } finally {
      setIsCreatingLink(false);
    }
  };

  const handleDeleteLink = async (shortCode, e) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this link?')) {
      return;
    }

    try {

      await deleteCode(shortCode);
      toast.success('Link deleted successfully!');
      setLinks(prev => prev.filter(link => link.shortCode !== shortCode));
      window.location.reload();
    } catch (error) {
      console.error('Error deleting link:', error);
      if (error.message.includes('token') || error.message.includes('auth')) {
        toast.error('Session expired. Please log in again.');
        handleLogout(navigate);
      } else {
        toast.error(error.message || 'Failed to delete link');
      }
    }
  };

  const handleCopyLink = async (shortCode, e) => {
    e.stopPropagation();
    const shortUrl = `${import.meta.env.VITE_BASE_URL}/${shortCode}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleVisitLink = (shortCode, e) => {
    e.stopPropagation();
    const shortUrl = `${import.meta.env.VITE_BASE_URL}/${shortCode}`;
    window.open(shortUrl, '_blank');
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await deleteAccount();
      toast.success('Account deleted successfully');
      handleLogout(navigate);
    } catch (error) {
      console.error('Error deleting account:', error);
      if (error.message.includes('token') || error.message.includes('auth')) {
        toast.error('Session expired. Please log in again.');
        handleLogout(navigate);
      } else {
        toast.error(error.message || 'Failed to delete account');
      }
      setIsDeletingAccount(false);
    }
  };

  const handleLinkClick = (link) => {
    setSelectedLink(link);
    setIsDetailsModalOpen(true);
  };

  if (isLoadingAccount) {
    return (
      <div className="min-h-screen bg-[#071129] flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
          <p className="text-gray-300 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const dateFilterOptions = [
    { value: 'all', label: 'All Time' },
    { value: '1week', label: 'Last Week' },
    { value: '2weeks', label: 'Last 2 Weeks' },
    { value: '1month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' }
  ];

  const itemsPerPageOptions = [3, 10, 20, 30, 50, 100];

  return (
    <div className="min-h-screen bg-[#071129] text-white">
      <header className="bg-[#0b2030] border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-gray-300 hover:text-white"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-linear-to-tr from-orange-400 to-pink-500 flex items-center justify-center font-bold text-lg">
                S
              </div>
              <div className="text-white font-semibold text-xl">Shrinkr</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGetInfoModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
            >
              <Info size={18} />
              <span className="text-sm">Get Link Info</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]"> 
        <aside
          className={`
            bg-[#0b2030] border-r border-gray-800 w-80 z-50
            transition-transform duration-300 ease-in-out
            lg:sticky lg:top-0 lg:self-start
            h-screen
            ${isSidebarOpen ? 'fixed top-0 left-0 translate-x-0' : 'fixed top-0 left-0 -translate-x-full lg:relative lg:translate-x-0'}
          `}
          style={{ minHeight: '100vh' }}
        >
          <div className="flex flex-col h-full p-6 pb-4">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>

            {/* Account section flush to top, no extra margin */}
            <div className="flex items-center gap-3 mb-8 mt-2">
              <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-orange-400 to-pink-500 flex items-center justify-center font-bold text-xl">
                S
              </div>
              <div className="text-white font-bold text-xl">Account</div>
            </div>

            <div className="flex flex-col items-center mb-6">
              <img
                src={accountData?.profilePic || noProfileImg}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-gray-700 mb-4 object-cover"
                onerror={() => { this.src = noProfileImg }}
              />
              <h2 className="text-xl font-bold text-white mb-1">{accountData?.name || 'User'}</h2>
              <p className="text-sm text-gray-400 mb-4 break-all text-center px-2">{accountData?.email || ''}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-[#061226] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="text-gray-400" size={16} />
                  <span className="text-xs text-gray-400">JOINED</span>
                </div>
                <p className="text-sm text-white">{formatDate(accountData?.dateOfJoining)}</p>
              </div>

              <div className="bg-[#061226] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="text-gray-400" size={16} />
                  <span className="text-xs text-gray-400">LAST LOGIN</span>
                </div>
                <p className="text-sm text-white">{getTimeAgo(accountData?.lastLogin)}</p>
              </div>

              <div className="bg-[#061226] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <LinkIcon className="text-gray-400" size={16} />
                  <span className="text-xs text-gray-400">TOTAL LINKS</span>
                </div>
                <p className="text-2xl font-bold text-white">{links.length}</p>
              </div>
            </div>

           
            <div className="mt-auto space-y-3 pt-2">
              <button
                onClick={() => handleLogout(navigate)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
              >
                <LogOut size={18} />
                Logout
              </button>
              <button
                onClick={() => setIsDeleteAccountModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
              >
                <UserX size={18} />
                Delete Account
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by heading, description, short code, or URL..."
                  className="w-full pl-12 pr-4 py-3 bg-[#0b2030] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowDateFilter(!showDateFilter)}
                  className="flex items-center gap-2 px-4 py-3 bg-[#0b2030] border border-gray-700 rounded-lg hover:bg-[#0d2540] transition w-full sm:w-auto"
                >
                  <Filter size={20} />
                  <span>{dateFilterOptions.find(opt => opt.value === dateFilter)?.label}</span>
                </button>
                {showDateFilter && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0b2030] border border-gray-700 rounded-lg shadow-xl z-10">
                    {dateFilterOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setDateFilter(option.value);
                          setShowDateFilter(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-[#061226] transition ${
                          dateFilter === option.value ? 'text-blue-400 bg-[#061226]' : 'text-white'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsGetInfoModalOpen(true)}
                className="sm:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                <Info size={18} />
                <span className="text-sm">Get Link Info</span>
              </button>
            </div>
          </div>

          {isLoadingLinks ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
                <p className="text-gray-300 text-lg">Loading your links...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="relative">
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                  style={{ maxHeight: '60vh', minHeight: '200px', scrollbarWidth: 'thin', scrollbarColor: '#374151 #0000', msOverflowStyle: 'auto' }}
                >
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-[#0b2030] border-2 border-dashed border-gray-600 rounded-xl p-8 hover:border-blue-500 hover:bg-[#0d2540] transition flex flex-col items-center justify-center min-h-[200px] group"
                  >
                    <div className="w-16 h-16 rounded-full bg-blue-600 group-hover:bg-blue-700 flex items-center justify-center mb-4 transition">
                      <Plus size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Create New Link</h3>
                    <p className="text-sm text-gray-400">Shorten a new URL</p>
                  </button>
                  {filteredLinks.map((link) => (
                    <div
                      key={link._id || link.shortCode}
                      onClick={() => handleLinkClick(link)}
                      className="bg-[#0b2030] border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition cursor-pointer group relative"
                    >
                      <button
                        onClick={(e) => handleDeleteLink(link.shortCode, e)}
                        className="absolute top-4 right-4 p-2  text-red-500 cursor-pointer rounded-lg transition opacity-100"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                      <h3 className="text-lg font-bold text-white mb-2 pr-8">{truncateText(link.heading, 40)}</h3>
                      {link.description && (
                        <p className="text-sm text-gray-400 mb-4">{truncateText(link.description, 80)}</p>
                      )}
                      <div className="bg-[#061226] rounded-lg p-3 mb-4">
                        <p className="text-xs text-gray-400 mb-1">SHORT URL</p>
                        <p className="text-sm text-blue-400 font-mono truncate">
                          {import.meta.env.VITE_BASE_URL}/{link.shortCode}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleCopyLink(link.shortCode, e)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-sm"
                        >
                          <Copy size={16} />
                          Copy
                        </button>
                        <button
                          onClick={(e) => handleVisitLink(link.shortCode, e)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm"
                        >
                          <ExternalLink size={16} />
                          Visit
                        </button>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between text-xs text-gray-400">
                        <span>{getTimeAgo(new Date(link.createdAt).getTime())}</span>
                        <span>{link.clickCount || 0} clicks</span>
                      </div>
                    </div>
                  ))}
                  {links.length === 0 && !isLoadingLinks && (
                    <div className="col-span-full text-center py-20">
                      <LinkIcon className="mx-auto mb-4 text-gray-600" size={64} />
                      <h3 className="text-2xl font-bold text-white mb-2">No links found</h3>
                      <p className="text-gray-400 mb-6">
                        {searchQuery || dateFilter !== 'all'
                          ? 'Try adjusting your search or filters'
                          : 'Create your first short link to get started'}
                      </p>
                      {!searchQuery && dateFilter === 'all' && (
                        <button
                          onClick={() => setIsCreateModalOpen(true)}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                        >
                          Create Your First Link
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* Pagination Controls at the bottom */}
              {pagination.totalItems > 0 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0b2030] p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Show</span>
                    <div className="relative">
                      <button
                        onClick={() => setShowItemsPerPage(!showItemsPerPage)}
                        className="flex items-center gap-2 px-3 py-2 bg-[#061226] border border-gray-700 rounded-lg hover:bg-[#071a2a] transition"
                      >
                        <span className="text-white">{pagination.itemsPerPage}</span>
                        <Filter size={16} className="text-gray-400" />
                      </button>
                      {showItemsPerPage && (
                        <div className="absolute bottom-full mb-2 w-20 bg-[#0b2030] border border-gray-700 rounded-lg shadow-xl z-10">
                          {itemsPerPageOptions.map(option => (
                            <button
                              key={option}
                              onClick={() => {
                                setPagination(p => ({ ...p, itemsPerPage: option, currentPage: 1 }));
                                setShowItemsPerPage(false);
                              }}
                              className={`w-full text-center px-3 py-2 hover:bg-[#061226] transition ${
                                pagination.itemsPerPage === option ? 'text-blue-400 bg-[#061226]' : 'text-white'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-400">per page</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>
                      Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
                      {' '}to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} links
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPagination(p => ({ ...p, currentPage: Math.max(1, p.currentPage - 1) }))}
                      disabled={!pagination.hasPreviousPage}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg font-medium transition disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 bg-[#061226] text-white rounded-lg">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setPagination(p => ({ ...p, currentPage: Math.min(p.totalPages, p.currentPage + 1) }))}
                      disabled={!pagination.hasNextPage}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg font-medium transition disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        />
      )}

      <CreateLinkModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateLink}
        isLoading={isCreatingLink}
      />

      <LinkDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedLink(null);
        }}
        link={selectedLink}
      />

      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeletingAccount}
      />

      <GetLinkInfoModal
        isOpen={isGetInfoModalOpen}
        onClose={() => setIsGetInfoModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
