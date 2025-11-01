export const createLink = async (formData) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const createLinkRoute = import.meta.env.VITE_CREATE_LINK_ROUTE;
    
    const accessToken = localStorage.getItem('shrinkr-accessToken');
    if (!accessToken) {
      throw new Error("No access token found. User might not be authenticated.");
    }

    const refreshToken = localStorage.getItem('shrinkr-refreshToken');
    if (!refreshToken) {
      throw new Error("No refresh token found. User might not be authenticated.");
    }

    if(!formData || !formData.longUrl ) {
        throw new Error("Long URL is required to create a short link.");
    }

    const token = {
        access_token: accessToken,
        refresh_token: refreshToken
    }
    console.log(formData)
    const response = await fetch(`${backendUrl}${createLinkRoute}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': JSON.stringify(token)
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create short link');
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

export const deleteCode = async (shortCode) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const deleteShortUrlRoute = import.meta.env.VITE_DELETE_SHORT_URL_ROUTE;

    const accessToken = localStorage.getItem('shrinkr-accessToken');
    if (!accessToken) {
      throw new Error("No access token found. User might not be authenticated.");
    }
    
    const refreshToken = localStorage.getItem('shrinkr-refreshToken');
    if (!refreshToken) {
      throw new Error("No refresh token found. User might not be authenticated.");
    }

    if(!shortCode) {
        throw new Error("Short code is required to delete a link.");
    }

    const token = {
        access_token: accessToken,
        refresh_token: refreshToken
    }
    console.log(shortCode)
    const response = await fetch(`${backendUrl}${deleteShortUrlRoute}${shortCode}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'token': JSON.stringify(token)
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete short link');
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

export const getPaginationLinks = async (page, limit) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const getUserLinksRoute = import.meta.env.VITE_GET_USER_LINKS_ROUTE;

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

    const response = await fetch(`${backendUrl}${getUserLinksRoute}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': JSON.stringify(token)
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch paginated links');
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

export const getFullUrl = async (shortCode) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const getFullUrlRoute = import.meta.env.VITE_GET_FULL_URL_ROUTE;

    if(!shortCode) {
        throw new Error("Short code is required to fetch the full URL.");
    }

    console.log(`${backendUrl}${getFullUrlRoute}${shortCode}`)
    const response = await fetch(`${backendUrl}${getFullUrlRoute}${shortCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch full URL');
    }

    const data = await response.json();
    return data;
}