export const TOKEN_KEY = "@_sesionID";
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const autenticar = token => {
    localStorage.setItem(TOKEN_KEY, token)
};
export const logout = () => {
    localStorage.clear()
};