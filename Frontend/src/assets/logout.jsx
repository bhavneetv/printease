export const logout = () => {
    sessionStorage.removeItem("user");
    window.location.href = "/login";
}