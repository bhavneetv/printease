export const isLoggedIn = (page) => {
  // const login = localStorage.getItem("isLogin");
  const user = sessionStorage.getItem("user") || null;

  if (!user) {
    return null;
  }

  const userData = JSON.parse(atob(user));
  if (page == "shop" && userData.role != "shopkeeper") {
    return null;
  }
  if (page == "admin" && userData.role != "admin") {
    return null;
  } else {
    return userData.id;
  }
};
