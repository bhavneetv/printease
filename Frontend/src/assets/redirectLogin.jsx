export const redirectLogin = () => {
  const user = sessionStorage.getItem("user") || null;
  if (!user) {
    // window.location.href = "/login";
    return;
  }
  const userData = JSON.parse(atob(user));
  if (userData.role == "shopkeeper") {
    window.location.href = "/ShopDashboard";
    return;
  }
  if (userData.role == "admin") {
    window.location.href = "/admin";
    return;
  }
  window.location.href = "/";
};
