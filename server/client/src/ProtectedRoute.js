let isAuthenticated = false;
if (sessionStorage.length > 0)
    isAuthenticated = true;

export default isAuthenticated;