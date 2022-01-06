export const TOKEN_KEY = "@_sesionID";
export const IsAuthenticated = () => {
    if (typeof window !== 'undefined') {
        // Perform localStorage action
        return localStorage.getItem(TOKEN_KEY) !== null;
    }
}
export const GetToken = () => localStorage.getItem(TOKEN_KEY);
export const Autenticar = token => {
    localStorage.setItem(TOKEN_KEY, token)
};
export const Logout = () => {
    localStorage.clear()
};