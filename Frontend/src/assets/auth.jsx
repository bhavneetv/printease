export const isLoggedIn = (pageRole = null) => {
  try {
    const user = localStorage.getItem("user");
    if (!user) return null;

    const userData = JSON.parse(atob(user));

    if (pageRole && userData.role !== pageRole) {
      return null;
    }

    return userData.id || null;
  } catch (err) {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("user");
  window.location.replace("/login");
};
