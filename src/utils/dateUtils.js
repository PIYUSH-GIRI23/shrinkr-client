export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getTimeAgo = (timestamp) => {
  if (!timestamp) return 'N/A';
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

export const getDateFilterTimestamp = (filter) => {
  const now = Date.now();
  
  switch(filter) {
    case 'all':
      return 0;
    case '1week':
      return now - (7 * 24 * 60 * 60 * 1000);
    case '2weeks':
      return now - (14 * 24 * 60 * 60 * 1000);
    case '1month':
      return now - (30 * 24 * 60 * 60 * 1000);
    case '3months':
      return now - (90 * 24 * 60 * 60 * 1000);
    case '6months':
      return now - (180 * 24 * 60 * 60 * 1000);
    case '1year':
      return now - (365 * 24 * 60 * 60 * 1000);
    default:
      return 0;
  }
};
