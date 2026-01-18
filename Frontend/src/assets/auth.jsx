export const isLoggedIn = (pageRole = null) => {

  const user = sessionStorage.getItem("user");



  if (!user) {

    logout();

    return false;

  }



  let userData;

  try {

    userData = JSON.parse(atob(user));

  } catch (e) {

    logout();

    return false;

  }



  if (pageRole && userData.role !== pageRole) {

    logout();

    return false;

  }



  return userData.id;

};



export const logout = () => {

  sessionStorage.clear();

  window.location.replace("/login");

};