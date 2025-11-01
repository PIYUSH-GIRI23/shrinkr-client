export const handleGoogleAuth = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const googleAuthRoute = import.meta.env.VITE_GOOGLE_AUTH_ROUTE;

  if (!backendUrl || !googleAuthRoute) {
    throw new Error("Environment variables VITE_BACKEND_URL or VITE_GOOGLE_AUTH_ROUTE are not defined");
  }

  const authUrl = new URL(`${backendUrl}${googleAuthRoute}`);
  window.location.href = authUrl.toString();
};

export const handleGoogleRedirect = (navigate) => {
  // Check if we have tokens in URL params
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get('accessToken');
  const refreshToken = params.get('refreshToken');
  const isNewUser = params.get('isNewUser') === 'true';

  if (accessToken && refreshToken) {
    try {
      // Store tokens immediately
      localStorage.setItem('shrinkr-accessToken', accessToken);
      localStorage.setItem('shrinkr-refreshToken', refreshToken);

      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Navigate to dashboard immediately
      navigate('/dashboard');
      return true; // Indicate successful auth
    }
     catch (error) {
      console.error('Auth error:', error);
      toast.error('Failed to complete Google authentication');
      return false;
    }
  }
  
  return false; // No tokens found
};

export const deleteAccount = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const deleteAccountRoute = import.meta.env.VITE_ACCOUNT_DELETE_ROUTE;

    const accessToken = localStorage.getItem('shrinkr-accessToken');
    if (!accessToken) {
      throw new Error("No access token found. User might not be authenticated.");
    }

    const refreshToken = localStorage.getItem('shrinkr-refreshToken');
    if (!refreshToken) {
      throw new Error("No refresh token found. User might not be authenticated.");
    }

    const token = {
        access_token: accessToken,
        refresh_token: refreshToken
    }

    const response = await fetch(`${backendUrl}${deleteAccountRoute}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'token': JSON.stringify(token)
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete account');
    }

    const data = await response.json();
    return data;
}

export const getDetails = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const accountDetailsRoute = import.meta.env.VITE_ACCOUNT_DETAILS_ROUTE;

    const accessToken = localStorage.getItem('shrinkr-accessToken');
    if (!accessToken) {
      throw new Error("No access token found. User might not be authenticated.");
    }

    const refreshToken = localStorage.getItem('shrinkr-refreshToken');
    if (!refreshToken) {
      throw new Error("No refresh token found. User might not be authenticated.");
    }

    const token= {
        access_token: accessToken,
        refresh_token: refreshToken
    }

    const response = await fetch(`${backendUrl}${accountDetailsRoute}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': JSON.stringify(token)
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch account details');
    }
    const newAccessToken = response.headers.get('New-Access-Token');
    const newRefreshToken = response.headers.get('New-Refresh-Token');

    if (newAccessToken) {
      localStorage.setItem('shrinkr-accessToken', newAccessToken);
    }
    if (newRefreshToken) {
      localStorage.setItem('shrinkr-refreshToken', newRefreshToken);
    }
    const data = await response.json();
    return data;
}