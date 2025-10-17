import { signOut } from 'next-auth/react';

/**
 * Comprehensive logout utility that clears all application data
 * and redirects to login page
 */
export const performLogout = async (redirectUrl: string = '/login'): Promise<void> => {
  try {
    // Clear local storage
    localStorage.clear();
    
    // Clear session storage
    sessionStorage.clear();
    
    // Clear IndexedDB (if used)
    if ('indexedDB' in window) {
      try {
        const databases = await indexedDB.databases();
        await Promise.all(
          databases.map(db => {
            if (db.name) {
              return new Promise<void>((resolve, reject) => {
                const deleteReq = indexedDB.deleteDatabase(db.name!);
                deleteReq.onsuccess = () => resolve();
                deleteReq.onerror = () => reject(deleteReq.error);
              });
            }
          })
        );
      } catch (error) {
        console.warn('Could not clear IndexedDB:', error);
      }
    }
    
    // Clear all cookies
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      
      // Clear for current path
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      
      // Clear for domain
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      
      // Clear for parent domain
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
      
      // Clear for all possible paths
      const pathParts = window.location.pathname.split('/');
      for (let i = 1; i < pathParts.length; i++) {
        const path = '/' + pathParts.slice(0, i + 1).join('/');
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;
      }
    });
    
    // Clear NextAuth session
    await signOut({ 
      redirect: false,
      callbackUrl: redirectUrl 
    });
    
    // Clear any remaining application state in memory
    if (window.history?.replaceState) {
      window.history.replaceState(null, '', redirectUrl);
    }
    
    // Force page reload to ensure all state is cleared
    window.location.href = redirectUrl;
    
  } catch (error) {
    console.error('Logout error:', error);
    
    // Force redirect even if there's an error
    window.location.href = redirectUrl;
  }
};

/**
 * Clear specific storage types
 */
export const clearStorage = {
  localStorage: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Could not clear localStorage:', error);
    }
  },
  
  sessionStorage: () => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Could not clear sessionStorage:', error);
    }
  },
  
  cookies: () => {
    try {
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
    } catch (error) {
      console.error('Could not clear cookies:', error);
    }
  }
};

/**
 * Check if user session is still valid
 */
export const validateSession = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/session');
    if (response.ok) {
      const session = await response.json();
      return !!session?.user;
    }
    return false;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
};