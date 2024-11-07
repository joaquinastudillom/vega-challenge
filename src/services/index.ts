export const login = (username: string, password: string): boolean => {
    if (username === 'user' && password === 'password') {
        localStorage.setItem('isLoggedIn', 'true');
        return true;
    }
    return false;
};

export const logout = (): void => {
    localStorage.removeItem('isLoggedIn');
};

export const isAuthenticated = (): boolean => {
    return localStorage.getItem('isLoggedIn') === 'true';
};
