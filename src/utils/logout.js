export const handleLogout = (navigate) => {
  // Clear all tokens
  localStorage.removeItem('shrinkr-accessToken');
  localStorage.removeItem('shrinkr-refreshToken');
  
  // Navigate to homepage
  if (navigate) {
    navigate('/');
  } else {
    window.location.href = '/';
  }
};
